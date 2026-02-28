import type {Post} from '@/features/posts/model/Post';
import type {PostAction} from './types';
import {PostCard} from './post-card';
import {Spinner} from "@/components/ui/spinner.tsx";
import React from "react";

interface PostListProps {
	posts: Post[];
	isLoading?: boolean;
	onLike?: (postId: number) => void;
	onComment?: (postId: number) => void;
	onShare?: (postId: number) => void;
	actions?: PostAction[];
}

export function PostList({posts, onLike, onComment, onShare, actions, isLoading = false}: PostListProps) {
	if (posts.length === 0 && !isLoading) {
		return (
			<div className="text-center py-12">
				<p className="text-gray-500 text-sm">No results found</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Spinner className="size-8 text-indigo-500"/>
			</div>
		)
	}

	return (
		<div className="space-y-6 grid grid-cols-1">
			{posts.map((post) => (
				<PostCard
					key={post.id}
					post={post}
					onLike={onLike}
					onComment={onComment}
					onShare={onShare}
					actions={actions}
				/>
			))}
		</div>
	)
}
