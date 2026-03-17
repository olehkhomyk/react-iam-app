import type { PostLike } from "@/features/posts/model/PostLikes.ts";

export interface Post {
	id: number;
	title: string;
	content: string;
	likesCount: number;
	likes: PostLike[];
	created: string;
	updated: string;
	isDeleted: boolean;
	createdBy: string;
}
