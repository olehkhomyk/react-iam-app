import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/features/posts/utils/utils.ts';
import { cn } from '@/lib/utils';

interface PostCommentAvatarProps {
	user: string;
	className?: string;
	fallbackClassName?: string;
}

export function PostCommentAvatar({ user, className, fallbackClassName }: PostCommentAvatarProps) {
	return (
		<Avatar className={cn('h-8 w-8 flex-shrink-0 ring-1 ring-white shadow-sm', className)}>
			<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`}/>
			<AvatarFallback className={cn('text-white font-semibold text-xs', fallbackClassName)}>
				{getInitials(user)}
			</AvatarFallback>
		</Avatar>
	);
}
