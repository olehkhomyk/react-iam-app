export interface PostComment {
	id: number;
	content: string;
	repliesCount: number;
	likesCount: number;
	likes: PostCommentLike[];
	createdAt: string;
	createdBy: string;
}

export interface PostCommentLike {
	id: number;
	commentId: number;
	userId: number;
	createdAt: string;
}

