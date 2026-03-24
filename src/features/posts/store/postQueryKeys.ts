import type { PostSearchRequest } from '@/features/posts/model/PostSearch';

export const postQueryKeys = {
	all: () => ['posts'] as const,
	list: (page: number, limit: number, search: PostSearchRequest) =>
		['posts', page, limit, search] as const,

	comments: (postId: number) => ['comments', postId] as const,
	commentsPage: (postId: number, page: number) => ['comments', postId, page] as const,
};