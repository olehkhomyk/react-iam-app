import {http} from '@/app/api/http';
import type {ApiResponse} from '@/features/auth/model/Auth';
import type {PaginationResponse} from '@/shared/model/Pagination';
import type {Comment} from '@/features/comments/model/Comment';

export type CommentPage = PaginationResponse<Comment>;

export async function fetchComments(postId: number, page: number, limit: number): Promise<CommentPage> {
	const res = await http.get<ApiResponse<CommentPage>>(
		`/posts/${postId}/comments`,
		{params: {page, limit}}
	);
	return res.data.payload;
}

export async function addComment(postId: number, content: string): Promise<Comment> {
	const res = await http.post<ApiResponse<Comment>>(
		`/posts/${postId}/comments`,
		{content}
	);
	return res.data.payload;
}
