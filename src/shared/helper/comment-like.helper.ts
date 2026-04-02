import type { PostComment } from '@/features/post-comments/model/postComment.ts';
import { some } from 'lodash';

export function isCommentLiked(comment: PostComment, userId: number): boolean {
	return some(comment.likes, { userId });
}
