import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCommentAvatar } from "@/features/post-comments/ui/PostCommentAvatar";
import type { PostComment } from "@/features/post-comments/model/postComment.ts";
import { formatDate } from "@/features/posts/utils/utils.ts";
import { isCommentLiked } from "@/shared/helper/comment-like.helper";
import { useAppDispatch } from "@/features/post-comments/redux-saga-sample/store/hooks.ts";
import {
  likeReply,
  unlikeReply,
} from "@/features/post-comments/redux-saga-sample/store/repliesSlice.ts";

interface PostCommentReplyItemProps {
  reply: PostComment;
  postId: number;
  parentCommentId: number;
  currentUserId: number;
  showLikes: boolean;
  readonly: boolean;
}

export function PostCommentReplyItemSaga({
  reply,
  postId,
  parentCommentId,
  currentUserId,
  showLikes,
  readonly,
}: PostCommentReplyItemProps) {
  const dispatch = useAppDispatch();

  // No local state: the reply comes from the store already optimistically
  // updated by the reducer. The UI just renders it as the single source of truth.
  const isLiked = reply.likes != null ? isCommentLiked(reply, currentUserId) : false;
  const likeCount = reply.likesCount ?? 0;

  const handleLike = () => {
    if (readonly) return;
    const payload = { postId, commentId: parentCommentId, replyId: reply.id, userId: currentUserId };
    if (isLiked) {
      dispatch(unlikeReply(payload));
    } else {
      dispatch(likeReply(payload));
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