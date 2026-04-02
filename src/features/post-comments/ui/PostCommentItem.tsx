import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostCommentAvatar } from '@/features/post-comments/ui/PostCommentAvatar';
import type { PostComment } from '@/features/post-comments/model/postComment.ts';
import { useLikePostCommentMutation, useUnlikePostCommentMutation } from '@/features/post-comments/queries/commentLike.queries.ts';
import { formatDate } from '@/features/posts/utils/utils.ts';
import { isCommentLiked } from '@/shared/helper/comment-like.helper';

interface PostCommentItemProps {
	comment: PostComment;
	postId: number;
	currentUserId: number;
	showLikes: boolean;
}

export function PostCommentItem({ comment, postId, currentUserId, showLikes }: PostCommentItemProps) {
	const likedByServer = comment.likes != null ? isCommentLiked(comment, currentUserId) : false;
	const [isLikeInPending, setIsLikeInPending] = useState(false);

	const isLiked = isLikeInPending ? !likedByServer : likedByServer;
	const likeCount = isLikeInPending
		? (comment.likesCount ?? 0) + (likedByServer ? -1 : 1)
		: (comment.likesCount ?? 0);

	const likeCommentMutation = useLikePostCommentMutation(postId);
	const unlikeCommentMutation = useUnlikePostCommentMutation(postId);

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
			<PostCommentAvatar
				user={comment.createdBy}
				fallbackClassName="bg-gradient-to-br from-indigo-400 to-purple-500"
			/>
			<div className="flex-1 min-w-0">
				<div className="bg-gray-50 rounded-xl px-3 py-2">
					<p className="text-xs font-semibold text-gray-900 mb-0.5">{comment.createdBy}</p>
					<p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
				</div>
				<div className="flex items-center justify-between mt-1 pl-1">
					<p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
					{showLikes && comment.likes != null && comment.likesCount != null && (
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
