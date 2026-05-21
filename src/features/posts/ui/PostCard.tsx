import { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PostTypes } from "@/features/posts/model/post.types.ts";
import { getInitials, formatDate } from "../utils/utils.ts";
import { ImageZoom } from "@/shared/ui/image-zoom/ImageZoom";
import type { PostAction } from "../model/postAction.types.ts";
import { PostComments } from "@/features/post-comments/ui/PostComments";
import { isPostLiked } from "@/shared/helper/post-like.helper.ts";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import { useLikePostMutation, useUnlikePostMutation } from "@/features/posts/queries/postLikes.queries.ts";

interface PostCardProps {
  post: PostTypes;
  onShare?: (postId: number) => void;
  actions?: PostAction[];
}

export function PostCard({ post, onShare, actions = [] }: PostCardProps) {
  const auth = useAuth();
  const likedByServer = isPostLiked(post, auth.user!.id);

  const [isLikeInPending, setIsLikeInPending] = useState(false);

  const isLiked = isLikeInPending ? !likedByServer : likedByServer;
  const likeCount = isLikeInPending ? post.likesCount + (likedByServer ? -1 : 1) : post.likesCount;

  const [isExpanded, setIsExpanded] = useState(false);
  const [addedCommentsCount, setAddedCommentsCount] = useState(0);
  const totalComments = post.totalComments + addedCommentsCount;

  const likePostMutation = useLikePostMutation();
  const unlikePostMutation = useUnlikePostMutation();

  const CONTENT_PREVIEW_LENGTH = 220;
  const shouldShowReadMore = post.content.length > CONTENT_PREVIEW_LENGTH;

  const visibleActions = actions.filter((action) => action.show === undefined || action.show(post));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLikeInPending(false);
  }, [likedByServer]);

  const handleLike = async () => {
    if (isLikeInPending) return;
    setIsLikeInPending(true);
    if (likedByServer) {
      await unlikePostMutation.mutateAsync(post.id);
    } else {
      await likePostMutation.mutateAsync(post.id);
    }
  };

  const handleCommentWasAdded = useCallback(() => {
    setAddedCommentsCount((prev) => prev + 1);
  }, []);

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden card-hover">
      {/* Author row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-primary/15">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.createdBy}`} />
            <AvatarFallback className="gradient-brand text-white text-xs font-semibold">
              {getInitials(post.createdBy)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{post.createdBy}</p>
            <p className="text-xs text-muted-foreground">{formatDate(post.created)}</p>
          </div>
        </div>

        {visibleActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {visibleActions.map((action, index) => (
                <div key={action.id}>
                  {index > 0 &&
                    action.variant === "destructive" &&
                    visibleActions[index - 1]?.variant !== "destructive" && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={() => action.onClick(post)}
                    className={`cursor-pointer ${
                      action.variant === "destructive" ? "text-destructive focus:text-destructive focus:bg-destructive/10" : ""
                    }`}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </DropdownMenuItem>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Title & content */}
      <div className="px-4 pb-3">
        <h3 className="text-base font-bold text-foreground mb-1.5 leading-snug">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {isExpanded
            ? post.content
            : shouldShowReadMore
              ? `${post.content.slice(0, CONTENT_PREVIEW_LENGTH)}…`
              : post.content}
        </p>
        {shouldShowReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Image */}
      {post.imageKey && (
        <div className="px-4 pb-3">
          <div className="rounded-xl overflow-hidden border border-border bg-muted max-h-[360px] flex items-center justify-center">
            <ImageZoom
              imageKey={post.imageKey}
              alt={post.title}
              trigger="icon"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`h-8 px-2.5 gap-1.5 rounded-lg text-xs font-medium transition-colors ${
            isLiked
              ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{likeCount > 0 ? likeCount : ""}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 gap-1.5 rounded-lg text-xs font-medium text-muted-foreground cursor-default pointer-events-none"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{totalComments > 0 ? totalComments : ""}</span>
          <span className="hidden sm:inline">Comments</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare?.(post.id)}
          className="h-8 px-2.5 gap-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent ml-auto"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>

      {/* Comments section */}
      <PostComments
        postId={post.id}
        initialComments={post.previewComments}
        totalComments={totalComments}
        newCommentAdded={handleCommentWasAdded}
        readonly={false}
      />
    </article>
  );
}
