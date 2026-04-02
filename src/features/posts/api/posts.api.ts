import { http } from '@/app/api/http';
import type { ApiResponse } from '@/features/auth/model/auth.types.ts';
import type { SearchPostsParams } from '@/features/posts/model/postSearch.types.ts';
import type { PostSavePayload, PostTypes } from '@/features/posts/model/post.types.ts';
import type { PaginationResponse } from '@/shared/model/Pagination';

export async function searchPosts({
	page,
	limit,
	searchParams,
	params,
}: SearchPostsParams): Promise<PaginationResponse<PostTypes>> {
	const response = await http.post<ApiResponse<PaginationResponse<PostTypes>>>(
		'/posts/search',
		searchParams,
		{
			params: {
				page,
				limit,
				...params,
			},
		},
	);

	return response.data.payload;
}

export async function createPost(values: PostSavePayload): Promise<PostTypes> {
	const response = await http.post<ApiResponse<PostTypes>>('/posts', values);
	return response.data.payload;
}

export async function updatePost(postId: number, values: PostSavePayload): Promise<PostTypes> {
	const response = await http.put<ApiResponse<PostTypes>>(`/posts/${postId}`, values);
	return response.data.payload;
}

export async function likePost(postId: number): Promise<PostTypes> {
	const response = await http.post<ApiResponse<PostTypes>>(`/posts/${postId}/like`);
	return response.data.payload;
}

export async function unlikePost(postId: number): Promise<PostTypes> {
	const response = await http.delete<ApiResponse<PostTypes>>(`/posts/${postId}/like`);
	return response.data.payload;
}
