import {Edit, Trash2, Flag, Share2, Bookmark} from 'lucide-react';
import type {PostTypes} from '@/features/posts/model/post.types.ts';
import type {PostAction} from '../model/postAction.types.ts';

export function createPostAction(
	id: string,
	label: string,
	icon: typeof Edit,
	onClick: (post: PostTypes) => void,
	options?: {
		variant?: 'default' | 'destructive';
		show?: (post: PostTypes) => boolean;
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
	edit: (onClick: (post: PostTypes) => void, canEdit?: (post: PostTypes) => boolean): PostAction =>
		createPostAction('edit', 'Edit PostTypes', Edit, onClick, {show: canEdit}),

	delete: (onClick: (post: PostTypes) => void, canDelete?: (post: PostTypes) => boolean): PostAction =>
		createPostAction('delete', 'Delete PostTypes', Trash2, onClick, {
			variant: 'destructive',
			show: canDelete,
		}),

	report: (onClick: (post: PostTypes) => void): PostAction =>
		createPostAction('report', 'Report PostTypes', Flag, onClick),

	share: (onClick: (post: PostTypes) => void): PostAction =>
		createPostAction('share', 'Share PostTypes', Share2, onClick),

	bookmark: (onClick: (post: PostTypes) => void): PostAction =>
		createPostAction('bookmark', 'Save PostTypes', Bookmark, onClick),
};