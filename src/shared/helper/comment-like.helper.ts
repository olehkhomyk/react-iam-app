import type { Comment } from '@/features/comments/model/Comment';
import { some } from 'lodash';

export function isCommentLiked(comment: Comment, userId: number): boolean {
	return some(comment.likes, { userId });
}
