import { useState, useMemo, useEffect } from 'react';
import { flatMap, take } from 'lodash';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Send, Heart } from 'lucide-react';
import type { Comment } from '@/features/comments/model/Comment';
import { getInitials, formatDate } from '@/features/posts/ui/utils';
import { useAuth } from '@/features/auth/context/useAuth';
import { useInfiniteCommentsQuery, useAddCommentMutation } from '@/features/posts/store/PostCommentsStore';
import { useLikeCommentMutation, useUnlikeCommentMutation } from '@/features/comments/store/CommentLikesStore';
import { isCommentLiked } from '@/shared/helper/comment-like.helper';

const PREVIEW_COUNT = 3;

interface PostCommentsProps {
	postId: number;
	previewComments: Comment[];
	totalComments: number;
	showLikes?: boolean;
}

interface CommentItemProps {
	comment: Comment;
	postId: number;
	currentUserId: number;
	showLikes: boolean;
}

function CommentItem({ comment, postId, currentUserId, showLikes }: CommentItemProps) {
	const likedByServer = isCommentLiked(comment, currentUserId);
	const [isLikeInPending, setIsLikeInPending] = useState(false);

	const isLiked = isLikeInPending ? !likedByServer : likedByServer;
	const likeCount = isLikeInPending
		? comment.likesCount + (likedByServer ? -1 : 1)
		: comment.likesCount;

	const likeCommentMutation = useLikeCommentMutation(postId);
	const unlikeCommentMutation = useUnlikeCommentMutation(postId);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsLikeInPending(false);
	}, [likedByServer]);

	const handleLike = async () => {
		if (isLikeInPending) return;
		setIsLikeInPending(true);
		if (likedByServer) {
			await unlikeCommentMutation.mutateAsync(comment.id);
		} else {
			await likeCommentMutation.mutateAsync(comment.id);
		}
	};

	return (
		<div className="flex gap-3">
			<Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-white shadow-sm">
				<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.createdBy}`}/>
				<AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white font-semibold text-xs">
					{getInitials(comment.createdBy)}
				</AvatarFallback>
			</Avatar>
			<div className="flex-1 min-w-0">
				<div className="bg-gray-50 rounded-xl px-3 py-2">
					<p className="text-xs font-semibold text-gray-900 mb-0.5">{comment.createdBy}</p>
					<p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
				</div>
				<div className="flex items-center justify-between mt-1 pl-1">
					<p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
					{showLikes && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleLike}
							className={`h-6 px-2 gap-1 text-xs ${isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-400 hover:text-gray-600'}`}
						>
							<Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`}/>
							{likeCount > 0 && <span>{likeCount}</span>}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

function CommentAvatar(user: string) {
	return (
		<Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-white shadow-sm mt-1">
			<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`}/>
			<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
				{getInitials(user)}
			</AvatarFallback>
		</Avatar>
	);
}

export function PostComments({ postId, previewComments: rawPreview, totalComments = 0, showLikes = false }: PostCommentsProps) {
	const { user } = useAuth();
	const currentUser = user?.username ?? 'me';

	const [expanded, setExpanded] = useState(false);
	const [commentText, setCommentText] = useState('');

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteCommentsQuery(postId, expanded);
	const addCommentMutation = useAddCommentMutation(postId);

	const allFetched = useMemo(
		() => flatMap(data?.pages, page => page.content) ?? [],
		[data],
	);

	const hasFetched = allFetched.length > 0;
	const comments = hasFetched ? allFetched : (rawPreview ?? []);
	const displayedComments = expanded ? comments : take(comments, PREVIEW_COUNT);
	const canLoadMore = expanded ? hasNextPage : totalComments > PREVIEW_COUNT;

	const handleLoadMore = () => {
		if (!expanded) {
			setExpanded(true);
			return;
		}
		fetchNextPage();
	};

	const handleShowLess = () => {
		setExpanded(false);
	};

	const handleSubmit = () => {
		const trimmed = commentText.trim();
		if (!trimmed || addCommentMutation.isPending) return;
		addCommentMutation.mutate(trimmed, {
			onSuccess: () => setCommentText(''),
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="border-t border-gray-100 px-4 sm:px-5 pt-4 pb-4 space-y-4">
			<div className="flex gap-3">
				{ CommentAvatar(currentUser) }
				<div className="flex-1 space-y-2">
					<Textarea
						placeholder="Write a comment... (Enter to submit, Shift+Enter for new line)"
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						onKeyDown={handleKeyDown}
						className="min-h-[64px] resize-none text-sm bg-gray-50 border-gray-200 focus-visible:bg-white"
					/>
					<div className="flex justify-end">
						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={addCommentMutation.isPending || commentText.trim().length === 0}
							className="h-8 px-3 gap-1.5">
							{
								addCommentMutation.isPending
									? <Spinner className="size-3"/>
									: <Send className="w-3 h-3"/>
							}
							<span className="text-xs">Send</span>
						</Button>
					</div>
				</div>
			</div>

			{displayedComments.length > 0 && (
				<div className="space-y-3">
					{
						displayedComments.map(comment => (
							<CommentItem key={comment.id} comment={comment} postId={postId} currentUserId={user!.id} showLikes={showLikes}/>
						))
					}
					{
						canLoadMore && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleLoadMore}
								disabled={isFetchingNextPage}
								className="w-full text-xs text-gray-500 hover:text-gray-700 h-8">
								{isFetchingNextPage
									? <><Spinner className="size-3 mr-1.5"/>Loading...</>
									: 'Load more comments'
								}
							</Button>
						)
					}
					{
						expanded && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleShowLess}
								className="w-full text-xs text-gray-500 hover:text-gray-700 h-8">
								Show less
							</Button>
						)
					}
				</div>
			)}
		</div>
	);
}
