import { useMemo, useState } from "react";
import { flatMap, isNil } from "lodash";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import { PostCommentAvatar } from "@/features/post-comments/ui/PostCommentAvatar";
import { PostCommentReplyItem } from "@/features/post-comments/ui/PostCommentReplyItem";
import {
  useAddReplyMutation,
  useInfiniteRepliesQuery,
} from "@/features/post-comments/queries/postReplies.queries.ts";

interface PostCommentRepliesProps {
  postId: number;
  commentId: number;
  repliesCount: number;
  currentUserId: number;
  showLikes: boolean;
  readonly: boolean;
}

export function PostCommentReplies({
  postId,
  commentId,
  repliesCount,
  currentUserId,
  showLikes,
  readonly,
}: PostCommentRepliesProps) {
  const { user } = useAuth();
  const currentUser = user?.username ?? "me";

  const [replyText, setReplyText] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteRepliesQuery(
    postId,
    commentId,
    true
  );
  const addReplyMutation = useAddReplyMutation(postId, commentId);

  const replies = useMemo(() => {
    if (isNil(data?.pages)) return [];
    return flatMap(data.pages, (page) => page.content);
  }, [data]);

  const handleSubmit = () => {
    const trimmed = replyText.trim();
    if (!trimmed || addReplyMutation.isPending) return;
    addReplyMutation.mutate(trimmed, {
      onSuccess: () => {
        setReplyText("");
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-2 ml-10 space-y-2.5 border-l border-border/60 pl-3">
      {!readonly && (
        <div className="flex gap-2">
          <PostCommentAvatar user={currentUser} className="h-7 w-7 mt-0.5 shrink-0" fallbackClassName="gradient-brand" />
          <div className="flex-1 space-y-1.5">
            <Textarea
              placeholder="Write a reply… (Enter to send)"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[48px] resize-none text-sm bg-card border-border rounded-xl focus-visible:ring-primary/50"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={addReplyMutation.isPending || replyText.trim().length === 0}
                className="h-7 px-3 gap-1.5 text-xs rounded-lg gradient-brand text-white border-0 hover:opacity-90"
              >
                {addReplyMutation.isPending ? <Spinner className="size-3" /> : <Send className="w-3 h-3" />}
                Reply
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-1">
          <Spinner className="size-4" />
        </div>
      )}

      {replies.map((reply) => (
        <PostCommentReplyItem
          key={reply.id}
          reply={reply}
          postId={postId}
          parentCommentId={commentId}
          currentUserId={currentUserId}
          showLikes={showLikes}
          readonly={readonly}
        />
      ))}

      {hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full text-xs text-muted-foreground hover:text-foreground h-7 rounded-lg"
        >
          {isFetchingNextPage ? (
            <>
              <Spinner className="size-3 mr-1.5" />
              Loading…
            </>
          ) : (
            "Load more replies"
          )}
        </Button>
      )}
    </div>
  );
}
