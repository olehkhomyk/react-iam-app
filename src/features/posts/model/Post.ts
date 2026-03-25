import type { PostLike } from "@/features/posts/model/PostLikes.ts";
import type { Comment } from "@/features/comments/model/Comment.ts";

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
	previewComments: Comment[];
	totalComments: number;
}
