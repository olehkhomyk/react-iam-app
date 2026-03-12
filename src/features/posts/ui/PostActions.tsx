import {Edit, Trash2, Flag, Share2, Bookmark} from 'lucide-react';
import type {Post} from '@/features/posts/model/Post';
import type {PostAction} from './types';

export function createPostAction(
	id: string,
	label: string,
	icon: typeof Edit,
	onClick: (post: Post) => void,
	options?: {
		variant?: 'default' | 'destructive';
		show?: (post: Post) => boolean;
	}
): PostAction {
	return {
		id,
		label,
		icon,
		onClick,
		variant: options?.variant || 'default',
		show: options?.show,
	};
}

export const PostActions = {
	edit: (onClick: (post: Post) => void, canEdit?: (post: Post) => boolean): PostAction =>
		createPostAction('edit', 'Edit Post', Edit, onClick, {show: canEdit}),

	delete: (onClick: (post: Post) => void, canDelete?: (post: Post) => boolean): PostAction =>
		createPostAction('delete', 'Delete Post', Trash2, onClick, {
			variant: 'destructive',
			show: canDelete,
		}),

	report: (onClick: (post: Post) => void): PostAction =>
		createPostAction('report', 'Report Post', Flag, onClick),

	share: (onClick: (post: Post) => void): PostAction =>
		createPostAction('share', 'Share Post', Share2, onClick),

	bookmark: (onClick: (post: Post) => void): PostAction =>
		createPostAction('bookmark', 'Save Post', Bookmark, onClick),
};