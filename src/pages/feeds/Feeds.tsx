import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { http } from '@/app/api/http.ts';
import { queryClient } from '@/app/api/queryClient.ts';
import type { ApiResponse } from "@/features/auth/model/Auth.ts";
import type { Post } from "@/features/posts/model/Post.ts";
import type { PaginationResponse } from "@/shared/model/Pagination.ts";
import { PostCard } from "@/shared/ui/post-card/post-card.tsx";
import { DynamicPagination } from "@/shared/ui/dynamic-pagination/DynamicPagination.tsx";
import { UpdatePostDialog } from "@/features/posts/ui/UpdatePostDialog.tsx";

export default function Feeds() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 5;
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['posts', page, limit],
    queryFn: async () => {
      const response = await http.get<ApiResponse<PaginationResponse<Post>>>(
        `/posts/all?page=${page - 1}&limit=${limit}`
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

  const handleUpdate = async (postId: number, values: { title: string; content: string }) => {
    await updatePostMutation.mutateAsync({ postId, values });
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Posts Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Posts
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading posts...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error instanceof Error ? error.message : 'Failed to fetch posts'}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6 grid grid-cols-1">
                    {posts.map((post: Post) => (
                      <div key={post.id}>
                        <PostCard
                          post={post}
                          onLike={handleLike}
                          onComment={handleComment}
                          onShare={handleShare}
                          onEdit={handleEdit}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {pagination && (
                    <DynamicPagination
                      currentPage={pagination.page}
                      totalPages={pagination.pages}
                      onPageChange={setPage}
                    />
                  )}
                </>
              )}
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