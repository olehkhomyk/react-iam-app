import type { CommentLike } from './CommentLike';

export interface Comment {
	id: number;
	content: string;
	likesCount: number;
	likes: CommentLike[];
	createdAt: string;
	createdBy: string;
}
