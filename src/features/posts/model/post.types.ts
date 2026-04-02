import type { PostLike } from "@/features/posts/model/postLikes.types.ts";
import type { PostComment } from "@/features/post-comments/model/postComment.ts";

export interface PostTypes {
	id: number;
	title: string;
	content: string;
	likesCount: number;
	likes: PostLike[];
	created: string;
	updated: string;
	isDeleted: boolean;
	createdBy: string;
	previewComments: PostComment[];
	totalComments: number;
}


export interface PostSavePayload {
	title: string;
	content: string;
}

