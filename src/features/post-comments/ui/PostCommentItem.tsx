import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCommentAvatar } from "@/features/post-comments/ui/PostCommentAvatar";
import type { PostComment } from "@/features/post-comments/model/postComment.ts";
import {
  useLikePostCommentMutation,
  useUnlikePostCommentMutation,
} from "@/features/post-comments/queries/commentLike.queries.ts";
import { formatDate } from "@/features/posts/utils/utils.ts";
import { isCommentLiked } from "@/shared/helper/comment-like.helper";

interface PostCommentItemProps {
  comment: PostComment;
  postId: number;
  currentUserId: number;
  showLikes: boolean;
  readonly: boolean;
}

export function PostCommentItem({ comment, postId, currentUserId, showLikes, readonly }: PostCommentItemProps) {
  const likedByServer = comment.likes != null ? isCommentLiked(comment, currentUserId) : false;
  const [isLikeInPending, setIsLikeInPending] = useState(false);

  const isLiked = isLikeInPending ? !likedByServer : likedByServer;
  const likeCount = isLikeInPending ? (comment.likesCount ?? 0) + (likedByServer ? -1 : 1) : (comment.likesCount ?? 0);

  const likeCommentMutation = useLikePostCommentMutation(postId);
  const unlikeCommentMutation = useUnlikePostCommentMutation(postId);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLikeInPending(false);
  }, [likedByServer]);

  const handleLike = async () => {
    if (readonly || isLikeInPending) return;
    setIsLikeInPending(true);
    if (likedByServer) {
      await unlikeCommentMutation.mutateAsync(comment.id);
    } else {
      await likeCommentMutation.mutateAsync(comment.id);
    }
  };

  return (
    <div className="flex gap-2.5">
      <PostCommentAvatar user={comment.createdBy} fallbackClassName="gradient-brand" />
      <div className="flex-1 min-w-0">
        <div className="bg-card rounded-xl px-3 py-2 border border-border/60">
          <p className="text-xs font-semibold text-foreground mb-0.5">{comment.createdBy}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
        </div>
        <div className="flex items-center justify-between mt-1 pl-1">
          <p className="text-xs text-muted-foreground/70">{formatDate(comment.createdAt)}</p>
          {showLikes && comment.likes != null && comment.likesCount != null && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-6 px-2 gap-1 text-xs rounded-lg ${isLiked ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
            >
              <Heart className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
