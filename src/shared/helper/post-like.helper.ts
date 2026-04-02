import type { PostTypes } from '@/features/posts/model/post.types.ts';
import { some } from 'lodash';

export function isPostLiked(post: PostTypes, userId: number): boolean {
	return some(post.likes, { userId })
}
