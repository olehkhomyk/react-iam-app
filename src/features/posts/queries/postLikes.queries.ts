import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/api/queryClient';
import { likePost, unlikePost } from '@/features/posts/api/posts.api.ts';
import { postQueryKeys } from '@/features/posts/queries/postQuery.keys.ts';

export function useLikePostMutation() {
	return useMutation({
		mutationFn: (postId: number) => likePost(postId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
		},
	});
}

export function useUnlikePostMutation() {
	return useMutation({
		mutationFn: (postId: number) => unlikePost(postId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
		},
	});
}
