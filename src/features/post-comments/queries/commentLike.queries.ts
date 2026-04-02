import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/api/queryClient';
import { postQueryKeys } from '@/features/posts/queries/postQuery.keys.ts';
import { likePostComment, unlikePostComment } from '@/features/post-comments/api/comments.api.ts';

export function useLikePostCommentMutation(postId: number) {
	return useMutation({
		mutationFn: (commentId: number) => likePostComment(postId, commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
		},
	});
}

export function useUnlikePostCommentMutation(postId: number) {
	return useMutation({
		mutationFn: (commentId: number) => unlikePostComment(postId, commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
		},
	});
}
