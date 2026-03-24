import { useMutation } from '@tanstack/react-query';
import { http } from '@/app/api/http';
import { queryClient } from '@/app/api/queryClient';
import type { ApiResponse } from '@/features/auth/model/Auth';
import type { Post } from '@/features/posts/model/Post';
import { postQueryKeys } from '@/features/posts/store/postQueryKeys';

export function useLikePostMutation() {
	return useMutation({
		mutationFn: async (postId: number) => {
			const response = await http.post<ApiResponse<Post>>(`/posts/${postId}/like`);
			return response.data.payload;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
		},
	});
}

export function useUnlikePostMutation() {
	return useMutation({
		mutationFn: async (postId: number) => {
			const response = await http.delete<ApiResponse<Post>>(`/posts/${postId}/like`);
			return response.data.payload;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
		},
	});
}
