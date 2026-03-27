import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/api/queryClient';
import { postQueryKeys } from '@/features/posts/store/postQueryKeys';
import { likeComment, unlikeComment } from '@/features/comments/api/commentsApi';

export function useLikeCommentMutation(postId: number) {
	return useMutation({
		mutationFn: (commentId: number) => likeComment(postId, commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
		},
	});
}

export function useUnlikeCommentMutation(postId: number) {
	return useMutation({
		mutationFn: (commentId: number) => unlikeComment(postId, commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
		},
	});
}
