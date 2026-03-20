import {useQuery, useMutation} from '@tanstack/react-query';
import {http} from '@/app/api/http';
import {queryClient} from '@/app/api/queryClient';
import {toast} from 'sonner';
import type {ApiResponse} from '@/features/auth/model/Auth';
import type {Post} from '@/features/posts/model/Post';
import type {PaginationResponse} from '@/shared/model/Pagination';
import type {PostSearchRequest} from '@/features/posts/model/PostSearch';

export function usePostsQuery(page: number, limit: number, searchParams: PostSearchRequest) {
	return useQuery({
		queryKey: ['posts', page, limit, searchParams],
		queryFn: async () => {
			const response = await http.post<ApiResponse<PaginationResponse<Post>>>(
				`/posts/search?page=${page - 1}&limit=${limit}`,
				searchParams
			);
			return response.data.payload;
		},
	});
}

export function useCreatePostMutation() {
	return useMutation({
		mutationFn: async (values: {title: string; content: string}) => {
			const response = await http.post<ApiResponse<Post>>('/posts', values);
			return response.data.payload;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['posts']});
			toast.success('Post successfully created');
		},
	});
}

export function useUpdatePostMutation() {
	return useMutation({
		mutationFn: async ({postId, values}: {postId: number; values: {title: string; content: string}}) => {
			const response = await http.put<ApiResponse<Post>>(`/posts/${postId}`, values);
			return response.data.payload;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ['posts']});
			toast.success('Post successfully updated');
		},
	});
}