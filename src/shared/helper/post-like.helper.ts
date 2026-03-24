import type { Post } from '@/features/posts/model/Post.ts';
import { some } from 'lodash';

export function isPostLiked(post: Post, userId: number): boolean {
	return some(post.likes, { userId })
}
