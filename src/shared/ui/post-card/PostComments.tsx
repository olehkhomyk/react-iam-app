import {useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Spinner} from '@/components/ui/spinner';
import {Send} from 'lucide-react';
import {fetchComments, addComment} from '@/features/comments/api/commentsApi';
import type {Comment} from '@/features/comments/model/Comment';
import {getInitials, formatDate} from './utils';

const INITIAL_LIMIT = 3;
const LOAD_MORE_LIMIT = 5;

interface PostCommentsProps {
	postId: number;
	currentUser?: string;
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
				<p className="text-xs text-gray-400 mt-1 pl-1">{formatDate(comment.created)}</p>
			</div>
		</div>
	);
}

export function PostComments({postId, currentUser = 'me'}: PostCommentsProps) {
	const [page, setPage] = useState(0);
	const [allComments, setAllComments] = useState<Comment[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [commentText, setCommentText] = useState('');
	const [pendingComments, setPendingComments] = useState<Comment[]>([]);

	const {isLoading, isFetching} = useQuery({
		queryKey: ['comments', postId, page],
		queryFn: async () => {
			const limit = page === 0 ? INITIAL_LIMIT : LOAD_MORE_LIMIT;
			const data = await fetchComments(postId, page, limit);
			setAllComments(prev => page === 0 ? data.content : [...prev, ...data.content]);
			setTotalPages(data.pagination.pages);
			return data;
		},
		staleTime: 1000 * 60,
	});

	const hasMore = page + 1 < totalPages;

	const addCommentMutation = useMutation({
		mutationFn: () => addComment(postId, commentText.trim(), currentUser),
		onSuccess: (newComment) => {
			setPendingComments(prev => [newComment, ...prev]);
			setCommentText('');
		},
	});

	const handleSubmit = () => {
		if (!commentText.trim() || addCommentMutation.isPending) return;
		addCommentMutation.mutate();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
			handleSubmit();
		}
	};

	const displayedComments = [...pendingComments, ...allComments];

	return (
		<div className="border-t border-gray-100 px-4 sm:px-5 pt-4 pb-4 space-y-4">
			{/* Add comment input */}
			<div className="flex gap-3">
				<Avatar className="h-8 w-8 flex-shrink-0 ring-1 ring-white shadow-sm mt-1">
					<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}`}/>
					<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
						{getInitials(currentUser)}
					</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-2">
					<Textarea
						placeholder="Write a comment... (Ctrl+Enter to submit)"
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

			{/* Comments list */}
			{isLoading && page === 0 ? (
				<div className="flex justify-center py-4">
					<Spinner className="size-5 text-indigo-400"/>
				</div>
			) : (
				<div className="space-y-3">
					{displayedComments.map(comment => (
						<CommentItem key={comment.id} comment={comment}/>
					))}

					{hasMore && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setPage(p => p + 1)}
							disabled={isFetching}
							className="w-full text-xs text-gray-500 hover:text-gray-700 h-8"
						>
							{isFetching
								? <><Spinner className="size-3 mr-1.5"/>Loading...</>
								: 'Load more comments'
							}
						</Button>
					)}
				</div>
			)}
		</div>
	);
}