import type {LucideIcon} from 'lucide-react';
import type {PostTypes} from '@/features/posts/model/post.types.ts';

export interface PostAction {
	id: string;
	label: string;
	icon: LucideIcon;
	onClick: (post: PostTypes) => void;
	variant?: 'default' | 'destructive';
	show?: (post: PostTypes) => boolean;
}
