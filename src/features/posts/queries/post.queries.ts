import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/api/queryClient';
import { toast } from 'sonner';
import type { RequestPagination } from '@/shared/model/Pagination';
import type { PostSearchRequest } from '@/features/posts/model/postSearch.types.ts';
import { createPost, searchPosts, updatePost } from '@/features/posts/api/posts.api.ts';
import { postQueryKeys } from './postQuery.keys';
import type { WithExtra } from "@/shared/type/with-extra.type.ts";
import type { PostSavePayload } from '@/features/posts/model/post.types.ts';

export function usePostsQuery({ page, limit, ...otherParams }: WithExtra<RequestPagination>, searchParams: PostSearchRequest) {
	return useQuery({
		queryKey: postQueryKeys.list(page, limit, searchParams),
		queryFn: () =>
			searchPosts({
				page: page - 1,
				limit,
				searchParams,
				params: otherParams,
			}),
	});
}

export function useCreatePostMutation() {
	return useMutation({
		mutationFn: (formData: FormData) => createPost(formData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
			toast.success('PostTypes successfully created');
		},
	});
}

export function useUpdatePostMutation() {
	return useMutation({
		mutationFn: ({ postId, values }: { postId: number; values: PostSavePayload }) => updatePost(postId, values),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
			toast.success('PostTypes successfully updated');
		},
	});
}

