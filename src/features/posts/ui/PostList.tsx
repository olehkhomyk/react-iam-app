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
	if (posts.length === 0 && !loading) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500 text-sm">No results found</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Spinner className="size-8 text-indigo-500"/>
			</div>
		);
	}

	return (
		<div className="space-y-6 grid grid-cols-1">
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