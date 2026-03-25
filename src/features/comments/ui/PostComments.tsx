import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Spinner} from '@/components/ui/spinner';
import {Send} from 'lucide-react';
import {fetchComments, addComment} from '@/features/comments/api/commentsApi';
import type {Comment} from '@/features/comments/model/Comment';
import {getInitials, formatDate} from '@/features/posts/ui/utils';
import {useAuth} from '@/features/auth/context/useAuth';

const LOAD_MORE_LIMIT = 3;
const PREVIEW_COUNT = 3;

interface PostCommentsProps {
	postId: number;
	previewComments: Comment[];
	totalComments: number;
}

function CommentItem({comment}: {comment: Comment}) {
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
				<p className="text-xs text-gray-400 mt-1 pl-1">{formatDate(comment.createdAt)}</p>
			</div>
		</div>
	);
}

export function PostComments({postId, previewComments: rawPreview, totalComments = 0}: PostCommentsProps) {
	const {user} = useAuth();
	const currentUser = user?.username ?? 'me';

	const [allComments, setAllComments] = useState<Comment[]>(rawPreview ?? []);
	const [localTotal, setLocalTotal] = useState(totalComments);
	const [showAll, setShowAll] = useState(false);
	const [nextPage, setNextPage] = useState(1);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [commentText, setCommentText] = useState('');

	const displayedComments = showAll ? allComments : allComments.slice(0, PREVIEW_COUNT);
	const canLoadMore = showAll ? localTotal > allComments.length : localTotal > PREVIEW_COUNT;
	const canShowLess = showAll;

	const handleLoadMore = async () => {
		if (isFetchingMore) return;
		setIsFetchingMore(true);
		try {
			const data = await fetchComments(postId, nextPage, LOAD_MORE_LIMIT);
			setAllComments(prev => [...prev, ...data.content]);
			setNextPage(p => p + 1);
			setShowAll(true);
		} finally {
			setIsFetchingMore(false);
		}
	};

	const handleShowLess = () => {
		setAllComments(prev => prev.slice(0, PREVIEW_COUNT));
		setNextPage(1);
		setShowAll(false);
	};

	const addCommentMutation = useMutation({
		mutationFn: () => addComment(postId, commentText.trim()),
		onSuccess: (newComment) => {
			setAllComments(prev => [newComment, ...prev]);
			setLocalTotal(t => t + 1);
			setCommentText('');
		},
	});

	const handleSubmit = () => {
		if (!commentText.trim() || addCommentMutation.isPending) return;
		addCommentMutation.mutate();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="border-t border-gray-100 px-4 sm:px-5 pt-4 pb-4 space-y-4">
			{displayedComments.length > 0 && (
				<div className="space-y-3">
					{displayedComments.map(comment => (
						<CommentItem key={comment.id} comment={comment}/>
					))}
					{canLoadMore && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleLoadMore}
							disabled={isFetchingMore}
							className="w-full text-xs text-gray-500 hover:text-gray-700 h-8"
						>
							{isFetchingMore
								? <><Spinner className="size-3 mr-1.5"/>Loading...</>
								: 'Load more comments'
							}
						</Button>
					)}
					{canShowLess && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleShowLess}
							className="w-full text-xs text-gray-500 hover:text-gray-700 h-8"
						>
							Show less
						</Button>
					)}
				</div>
			)}

			<div className="flex gap-3">
				<Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-white shadow-sm mt-1">
					<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`}/>
					<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
						{getInitials(currentUser)}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-2">
					<Textarea
						placeholder="Write a comment... (Enter to submit, Shift+Enter for new line)"
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						onKeyDown={handleKeyDown}
						className="min-h-[64px] resize-none text-sm bg-gray-50 border-gray-200 focus-visible:bg-white"
					/>
					{commentText.trim() && (
						<div className="flex justify-end">
							<Button
								size="sm"
								onClick={handleSubmit}
								disabled={addCommentMutation.isPending}
								className="h-8 px-3 gap-1.5"
							>
								{addCommentMutation.isPending
									? <Spinner className="size-3"/>
									: <Send className="w-3 h-3"/>
								}
								<span className="text-xs">Send</span>
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
