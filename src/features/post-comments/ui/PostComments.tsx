import { useState, useMemo } from 'react';
import { flatMap, take } from 'lodash';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Send } from 'lucide-react';
import { useAuth } from '@/features/auth/context/useAuth.ts';
import type { PostComment } from '@/features/post-comments/model/postComment.ts';
import { PostCommentAvatar } from '@/features/post-comments/ui/PostCommentAvatar';
import { useInfiniteCommentsQuery, useAddCommentMutation } from '@/features/posts/queries/postComments.queries.ts';
import { PostCommentItem } from '@/features/post-comments/ui/PostCommentItem';

const PREVIEW_COUNT = 3;

interface PostCommentsProps {
	postId: number;
	previewComments: PostComment[];
	totalComments: number;
	showLikes?: boolean;
}

export function PostComments({ postId, previewComments: rawPreview, totalComments = 0, showLikes = true }: PostCommentsProps) {
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
			onSuccess: () => {
				setCommentText('');
			},
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
				<PostCommentAvatar
					user={currentUser}
					className="mt-1"
					fallbackClassName="bg-gradient-to-br from-blue-500 to-purple-600"
				/>
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
							<PostCommentItem key={comment.id} comment={comment} postId={postId} currentUserId={user!.id} showLikes={showLikes}/>
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
									: 'Load more post-comments'
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
