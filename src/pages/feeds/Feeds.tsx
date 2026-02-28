import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { http } from '@/app/api/http.ts';
import { queryClient } from '@/app/api/queryClient.ts';
import type { ApiResponse } from "@/features/auth/model/Auth.ts";
import type { Post } from "@/features/posts/model/Post.ts";
import type { PaginationResponse } from "@/shared/model/Pagination.ts";
import { PostList } from "@/shared/ui/post-card/post-list.tsx";
import { DynamicPagination } from "@/shared/ui/dynamic-pagination/DynamicPagination.tsx";
import { UpdatePostDialog } from "@/features/posts/ui/UpdatePostDialog.tsx";
import { PostSearchForm } from "@/features/posts/ui/PostSearchForm.tsx";
import type { PostSearchRequest, PostSearchFormValues } from "@/features/posts/model/PostSearch.ts";
import { PostActions } from "@/shared/ui/post-card/post-actions.tsx";
import { toast } from "sonner";
import {useAuth} from "@/features/auth/context/useAuth.ts";

export default function Feeds() {
  const navigate = useNavigate();
  const { user} = useAuth();

  const [page, setPage] = useState(1);
  const limit = 5;
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<PostSearchRequest>({});

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['posts', page, limit, searchParams],
    queryFn: async () => {
      const response = await http.post<ApiResponse<PaginationResponse<Post>>>(
        `/posts/search?page=${page - 1}&limit=${limit}`,
        searchParams
      );
      return response.data.payload;
    }
  });

  const posts = data?.content ?? [];
  const pagination = data?.pagination ?? null;

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, values }: { postId: number; values: { title: string; content: string } }) => {
      const response = await http.put<ApiResponse<Post>>(`/posts/${postId}`, values);
      return response.data.payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post successfully updated');
    },
    onError: (error) => {
      console.error('Failed to update post:', error);
    },
  });

  const handleLike = (postId: number) => {
    console.log('Liked post:', postId);
    // TODO: Implement like functionality
  };

  const handleComment = (postId: number) => {
    console.log('Comment on post:', postId);
    // TODO: Navigate to post or open comment modal
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
    // TODO: Implement delete functionality
    console.log('Delete post:', post.id);
    toast.info('Delete functionality coming soon');
  };

  const handleReport = (post: Post) => {
    // TODO: Implement report functionality
    console.log('Report post:', post.id);
    toast.info('Report functionality coming soon');
  };

  const handleUpdate = async (postId: number, values: { title: string; content: string }) => {
    await updatePostMutation.mutateAsync({ postId, values });
  };

  const handleSearch = (values: PostSearchFormValues) => {
    const searchRequest: PostSearchRequest = {
      keyword: values.keyword || undefined,
      sortField: values.sortField || undefined,
    };
    setSearchParams(searchRequest);
    setPage(1); // Reset to first page on new search
  };

  // Configure post actions with permissions
  const postActions = useMemo(() => [
    PostActions.edit(
      handleEdit,
      (post: Post) => post.createdBy === user?.username
    ),
    PostActions.delete(
      handleDelete,
      (post: Post) => post.createdBy === user?.username
    ),
    PostActions.report(handleReport),
  ], [handleEdit, handleDelete, handleReport, user]);

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-6">
          {/* Search Form */}
          <PostSearchForm onSearch={handleSearch} isLoading={loading} />

          {/* Posts Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Posts
              </h2>
                <>
                  <PostList
                    posts={posts}
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
    </div>
  );
}