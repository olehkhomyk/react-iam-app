import { http } from "@/app/api/http.ts";
import type { ApiResponse } from "@/features/auth/model/auth.types.ts";
import type { PaginationResponse } from "@/shared/model/Pagination.ts";
import type { PostTypes } from "@/features/posts/model/post.types.ts";


export async function getCommentReply(): Promise<any> {
	const response = await http.get<ApiResponse<PaginationResponse<PostTypes>>>(
		// '/posts/35/comments/86/replies',
		'/posts/35/comments',
		{}
	);

	console.log('getCommentReply', response);

	return response;
}
