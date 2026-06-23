import { http } from '@/app/api/http';
import type { ApiResponse } from '@/features/auth/model/auth.types.ts';
import type { PaginationResponse } from '@/shared/model/Pagination';
import type { PostComment } from '@/features/post-comments/model/postComment.ts';
import { isNil } from "lodash";

export type CommentPage = PaginationResponse<PostComment>;

export async function fetchPostComments(postId: number, page: number, limit: number): Promise<CommentPage> {
	const res = await http.get<ApiResponse<CommentPage>>(
		`/posts/${postId}/comments`,
		{params: {page, limit}}
	);
	return res.data.payload;
}

export async function addPostComment(postId: number, content: string, parentCommentId: number): Promise<PostComment> {
	const res = await http.post<ApiResponse<PostComment>>(
		`/posts/${postId}/comments`,
		{
			content,
			...(isNil(parentCommentId) ? {} : { parentId: parentCommentId }),
		}
	);
	return res.data.payload;
}

export async function fetchCommentReplies(postId: number, commentId: number, page: number, limit: number): Promise<CommentPage> {
	const res = await http.get<ApiResponse<CommentPage>>(
		`/posts/${postId}/comments/${commentId}/replies`,
		{params: {page, limit}}
	);
	return res.data.payload;
}

export async function likePostComment(postId: number, commentId: number): Promise<PostComment> {
	const res = await http.post<ApiResponse<PostComment>>(`/posts/${postId}/comments/${commentId}/like`);
	return res.data.payload;
}

export async function unlikePostComment(postId: number, commentId: number): Promise<PostComment> {
	const res = await http.delete<ApiResponse<PostComment>>(`/posts/${postId}/comments/${commentId}/like`);
	return res.data.payload;
}
