import type { PostTypes } from '@/features/posts/model/post.types.ts';
import type { PostAction } from '../model/postAction.types.ts';
import { PostCard } from './PostCard';
import { Spinner } from '@/components/ui/spinner';

interface PostListProps {
	posts: PostTypes[];
	loading?: boolean;
	onLike?: (post: PostTypes, isLiked: boolean) => void;
	onShare?: (postId: number) => void;
	actions?: PostAction[];
}

export function PostList({ posts, onShare, actions, loading = false }: PostListProps) {
	if (loading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Spinner className="size-7 text-primary"/>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 gap-2 text-center bg-card border border-border rounded-xl">
				<p className="text-base font-medium text-foreground">No posts yet</p>
				<p className="text-sm text-muted-foreground">Be the first to share something!</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{posts.map((post) => (
				<PostCard
					key={post.id}
					post={post}
					onShare={onShare}
					actions={actions}
				/>
			))}
		</div>
	);
}