import type {LucideIcon} from 'lucide-react';
import type {Post} from '@/features/posts/model/Post';

export interface PostAction {
	id: string;
	label: string;
	icon: LucideIcon;
	onClick: (post: Post) => void;
	variant?: 'default' | 'destructive';
	show?: (post: Post) => boolean;
}

export interface PostActionGroup {
	label?: string;
	actions: PostAction[];
}