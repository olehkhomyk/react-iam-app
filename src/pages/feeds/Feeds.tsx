import { useState, useMemo } from 'react';
import { debounce, reduce } from 'lodash';
import type { Post } from '@/features/posts/model/Post';
import type { PostSearchFormValues, PostSearchRequest } from '@/features/posts/model/PostSearch';
import {
	usePostsQuery, useUpdatePostMutation, useCreatePostMutation, useLikePostMutation, useUnlikePostMutation
} from '@/features/posts/store/posts.queries';
import { PostList } from '@/features/posts/ui/PostList';
import { PostActions } from '@/features/posts/ui/PostActions';
import { PostSearchForm } from '@/features/posts/ui/PostSearchForm';
import { UpdatePostDialog } from '@/features/posts/ui/UpdatePostDialog';
import { CreatePostDialog } from '@/features/posts/ui/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { DynamicPagination } from '@/shared/ui/dynamic-pagination/DynamicPagination';
import { useAuth } from '@/features/auth/context/useAuth';
import { toast } from 'sonner';
import { isPostLiked } from '@/shared/helper/post-like.helper.ts';

export default function Feeds() {
	const { user } = useAuth();

	const [page, setPage] = useState(1);
	const limit = 5;
	const [editingPost, setEditingPost] = useState<Post | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [searchParams, setSearchParams] = useState<PostSearchRequest>({});

	const { data, isFetching, isLoading } = usePostsQuery(page, limit, searchParams);
	const updatePostMutation = useUpdatePostMutation();
	const createPostMutation = useCreatePostMutation();
	const likePostMutation = useLikePostMutation();
	const unlikePostMutation = useUnlikePostMutation();

	const posts = data?.content ?? [];
	const pagination = data?.pagination ?? null;

	const likesMap: Record<number, boolean> = reduce(posts, (acc, post) => {
		acc[post.id] = isPostLiked(post, user!.id)

		return acc;
	}, {} as Record<number, boolean>);

	const handleLike = debounce(
		async (post: Post, isLike: boolean) => {
			const postLikeState = likesMap[post.id];

			if (postLikeState === isLike) {
				return;
			}

			if (isLike) {
				await unlikePostMutation.mutateAsync(post.id);
			} else {
				await likePostMutation.mutateAsync(post.id);
			}
		},
		500
	);

	const handleComment = (postId: number) => {
		console.log('Comment on post:', postId);
	};

	const handleShare = (postId: number) => {
		console.log('Share post:', postId);
		// TODO: Implement share functionality
	};

	const handleEdit = (post: Post) => {
		setEditingPost(post);
		setIsEditDialogOpen(true);
	};

	const handleDelete = (post: Post) => {
		console.log('Delete post:', post.id);
		toast.info('Delete functionality coming soon');
	};

	const handleReport = (post: Post) => {
		console.log('Report post:', post.id);
		toast.info('Report functionality coming soon');
	};

	const handleUpdate = async (postId: number, values: { title: string; content: string }) => {
		await updatePostMutation.mutateAsync({ postId, values });
	};

	const handleCreate = async (values: { title: string; content: string }) => {
		await createPostMutation.mutateAsync(values);
	};

	const handleSearch = (values: PostSearchFormValues) => {
		setSearchParams({
			keyword: values.keyword || undefined,
			sortField: values.sortField || undefined,
		});
		setPage(1);
	};

	const postActions = useMemo(() => [
		PostActions.edit(handleEdit, (post: Post) => post.createdBy === user?.username),
		PostActions.delete(handleDelete, (post: Post) => post.createdBy === user?.username),
		PostActions.report(handleReport),
	], [user]);

	return (
		<div className="min-h-screen">
			<main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0 space-y-6">
					<PostSearchForm onSearch={handleSearch} isLoading={isFetching}/>

					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="px-4 py-5 sm:p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg leading-6 font-medium text-gray-900">
									Recent Posts
								</h2>
								<Button onClick={() => setIsCreateDialogOpen(true)}>
									Create Post
								</Button>
							</div>
							<>
								<PostList
									posts={posts}
									loading={isLoading && posts.length === 0}
									onLike={handleLike}
									onComment={handleComment}
									onShare={handleShare}
									actions={postActions}
								/>

								{pagination && (
									<DynamicPagination
										currentPage={pagination.page}
										totalPages={pagination.pages}
										onPageChange={setPage}
									/>
								)}
							</>
						</div>
					</div>
				</div>
			</main>

			{editingPost && (
				<UpdatePostDialog
					post={editingPost}
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					onUpdate={handleUpdate}
				/>
			)}

			{isCreateDialogOpen && (
				<CreatePostDialog
					open={isCreateDialogOpen}
					onOpenChange={setIsCreateDialogOpen}
					onCreate={handleCreate}
				/>
			)}
		</div>
	);
}