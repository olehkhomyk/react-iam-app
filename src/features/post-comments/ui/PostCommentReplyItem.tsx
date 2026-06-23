import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCommentAvatar } from "@/features/post-comments/ui/PostCommentAvatar";
import type { PostComment } from "@/features/post-comments/model/postComment.ts";
import {
  useLikeReplyMutation,
  useUnlikeReplyMutation,
} from "@/features/post-comments/queries/commentLike.queries.ts";
import { formatDate } from "@/features/posts/utils/utils.ts";
import { isCommentLiked } from "@/shared/helper/comment-like.helper";

interface PostCommentReplyItemProps {
  reply: PostComment;
  postId: number;
  parentCommentId: number;
  currentUserId: number;
  showLikes: boolean;
  readonly: boolean;
}

export function PostCommentReplyItem({
  reply,
  postId,
  parentCommentId,
  currentUserId,
  showLikes,
  readonly,
}: PostCommentReplyItemProps) {
  const likedByServer = reply.likes != null ? isCommentLiked(reply, currentUserId) : false;
  const [isLikeInPending, setIsLikeInPending] = useState(false);

  const isLiked = isLikeInPending ? !likedByServer : likedByServer;
  const likeCount = isLikeInPending ? (reply.likesCount ?? 0) + (likedByServer ? -1 : 1) : (reply.likesCount ?? 0);

  const likeReplyMutation = useLikeReplyMutation(postId, parentCommentId);
  const unlikeReplyMutation = useUnlikeReplyMutation(postId, parentCommentId);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLikeInPending(false);
  }, [likedByServer]);

  const handleLike = async () => {
    if (readonly || isLikeInPending) return;
    setIsLikeInPending(true);
    if (likedByServer) {
      await unlikeReplyMutation.mutateAsync(reply.id);
    } else {
      await likeReplyMutation.mutateAsync(reply.id);
    }
  };

  return (
    <div className="flex gap-2">
      <PostCommentAvatar user={reply.createdBy} className="h-7 w-7" fallbackClassName="gradient-brand" />
      <div className="flex-1 min-w-0">
        <div className="bg-card rounded-xl px-3 py-2 border border-border/60">
          <p className="text-xs font-semibold text-foreground mb-0.5">{reply.createdBy}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{reply.content}</p>
        </div>
        <div className="flex items-center justify-between mt-1 pl-1">
          <p className="text-xs text-muted-foreground/70">{formatDate(reply.createdAt)}</p>
          {showLikes && reply.likes != null && reply.likesCount != null && (
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
