import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { http } from '@/app/api/http.ts';
import { queryClient } from '@/app/api/queryClient.ts';
import type { ApiResponse } from "@/features/auth/model/Auth.ts";
import type { Post } from "@/features/posts/model/Post.ts";
import type { PaginationResponse } from "@/shared/model/Pagination.ts";
import { PostCard } from "@/shared/ui/post-card/post-card.tsx";

export default function Dashboard() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const limit = 5;

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

  const refreshPosts = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

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
                <div className="space-y-6 grid lg:grid-cols-3 gap-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1">
                  {posts.map((post: Post) => (
                    <div className="">
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                      />
                    </div>
                  ))}

                  {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      <button
                        onClick={() => setPage(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-2 text-sm text-gray-600">
                        Page {pagination.page} of {pagination.pages}
                      </span>
                      <button
                        onClick={() => setPage(pagination.page + 1)}
                        disabled={pagination.page >= pagination.pages}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}