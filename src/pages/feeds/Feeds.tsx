import { useState, useMemo } from "react";
import type { PostTypes } from "@/features/posts/model/post.types.ts";
import type { PostSearchFormValues, PostSearchRequest } from "@/features/posts/model/postSearch.types.ts";
import {
  usePostsQuery,
  useUpdatePostMutation,
  useCreatePostMutation,
  preparePostPayload,
} from "@/features/posts/queries/post.queries.ts";
import { PostList } from "@/features/posts/ui/PostList";
import { PostActions } from "@/features/posts/ui/PostActions";
import { PostSearchForm } from "@/features/posts/ui/PostSearchForm";
import { PostUpdateDialog } from "@/features/posts/ui/PostUpdateDialog.tsx";
import { PostCreateDialog } from "@/features/posts/ui/PostCreateDialog.tsx";
import { Button } from "@/components/ui/button";
import { DynamicPagination } from "@/shared/ui/dynamic-pagination/DynamicPagination";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import { toast } from "sonner";
import { PenSquare, TrendingUp, Users, Hash } from "lucide-react";

export default function Feeds() {
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const limit = 5;
  const [editingPost, setEditingPost] = useState<PostTypes | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<PostSearchRequest>({});

  const { data, isFetching, isLoading } = usePostsQuery({ page, limit, includeComments: true }, { ...searchParams });
  const updatePostMutation = useUpdatePostMutation();
  const createPostMutation = useCreatePostMutation();

  const posts = data?.content ?? [];
  const pagination = data?.pagination ?? null;

  const handleShare = (postId: number) => {
    console.log("Share post:", postId);
  };

  const handleEdit = (post: PostTypes) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (post: PostTypes) => {
    console.log("Delete post:", post.id);
    toast.info("Delete functionality coming soon");
  };

  const handleReport = (post: PostTypes) => {
    console.log("Report post:", post.id);
    toast.info("Report functionality coming soon");
  };

  const handleUpdate = async (postId: number, values: { title: string; content: string; image?: File }) => {
    const formData = preparePostPayload(values);
    await updatePostMutation.mutateAsync({ postId, formData });
  };

  const handleCreate = async (values: { title: string; content: string; image?: File }) => {
    const formData = preparePostPayload(values);
    await createPostMutation.mutateAsync(formData);
  };

  const handleSearch = (values: PostSearchFormValues) => {
    setSearchParams({
      keyword: values.keyword || undefined,
      sortField: values.sortField || undefined,
    });
    setPage(1);
  };

  const postActions = useMemo(
    () => [
      PostActions.edit(handleEdit, (post: PostTypes) => post.createdBy === user?.username),
      PostActions.delete(handleDelete, (post: PostTypes) => post.createdBy === user?.username),
      PostActions.report(handleReport),
    ],
    [user],
  );

  return (
    <div className="flex gap-6">
      {/* Main feed column */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Create post prompt */}
        <button
          type="button"
          onClick={() => setIsCreateDialogOpen(true)}
          className="w-full flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 text-left hover:border-primary/40 hover:shadow-sm transition-all duration-200 group"
        >
          <div className="gradient-brand h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold">
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">
            What's on your mind, {user?.username ?? "there"}?
          </span>
          <PenSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </button>

        {/* Search & filter */}
        <PostSearchForm onSearch={handleSearch} isLoading={isFetching} />

        {/* Posts */}
        <div className="space-y-4">
          <PostList
            posts={posts}
            loading={isLoading && posts.length === 0}
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
        </div>
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
        {/* Trending */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Trending</h3>
          </div>
          {["#react", "#typescript", "#design", "#webdev"].map((tag) => (
            <div key={tag} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
              <Hash className="w-3.5 h-3.5 shrink-0" />
              <span>{tag.slice(1)}</span>
            </div>
          ))}
        </div>

        {/* Suggested */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Suggested</h3>
          </div>
          {["alice", "bob", "carol"].map((name) => (
            <div key={name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                  alt={name}
                  className="h-7 w-7 rounded-full border border-border"
                />
                <span className="text-sm font-medium text-foreground">{name}</span>
              </div>
              <Button variant="outline" size="sm" className="h-6 text-xs px-2">Follow</Button>
            </div>
          ))}
        </div>
      </aside>

      {editingPost && (
        <PostUpdateDialog
          post={editingPost}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={handleUpdate}
        />
      )}

      {isCreateDialogOpen && (
        <PostCreateDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onCreate={handleCreate} />
      )}
    </div>
  );
}
