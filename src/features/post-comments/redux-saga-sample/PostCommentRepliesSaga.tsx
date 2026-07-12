import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import { PostCommentAvatar } from "@/features/post-comments/ui/PostCommentAvatar";
import { PostCommentReplyItemSaga } from "@/features/post-comments/redux-saga-sample/PostCommentReplyItemSaga.tsx";
import { store } from "@/features/post-comments/redux-saga-sample/store/store.ts";
import { useAppDispatch, useAppSelector } from "@/features/post-comments/redux-saga-sample/store/hooks.ts";
import {
  addReply,
  fetchMoreReplies,
  fetchReplies,
} from "@/features/post-comments/redux-saga-sample/store/repliesSlice.ts";

interface PostCommentRepliesProps {
  postId: number;
  commentId: number;
  repliesCount: number;
  currentUserId: number;
  showLikes: boolean;
  readonly: boolean;
}

function PostCommentRepliesSagaInner({
  postId,
  commentId,
  currentUserId,
  showLikes,
  readonly,
}: PostCommentRepliesProps) {
  const { user } = useAuth();
  const currentUser = user?.username ?? "me";

  const dispatch = useAppDispatch();
  const [replyText, setReplyText] = useState("");

  const replies = useAppSelector((state) => state.replies.items);
  const isLoading = useAppSelector((state) => state.replies.isLoading);
  const isAdding = useAppSelector((state) => state.replies.isAdding);
  const isFetchingMore = useAppSelector((state) => state.replies.isFetchingMore);
  const hasNextPage = useAppSelector(
    (state) => state.replies.items.length < state.replies.total
  );

  // Initial load — replaces useInfiniteQuery(..., enabled: true).
  useEffect(() => {
    dispatch(fetchReplies({ postId, commentId }));
  }, [dispatch, postId, commentId]);

  const handleSubmit = () => {
    const trimmed = replyText.trim();
    if (!trimmed || isAdding) return;
    dispatch(addReply({ postId, commentId, content: trimmed }));
    setReplyText("");
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
                disabled={isAdding || replyText.trim().length === 0}
                className="h-7 px-3 gap-1.5 text-xs rounded-lg gradient-brand text-white border-0 hover:opacity-90"
              >
                {isAdding ? <Spinner className="size-3" /> : <Send className="w-3 h-3" />}
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
        <PostCommentReplyItemSaga
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
          onClick={() => dispatch(fetchMoreReplies({ postId, commentId }))}
          disabled={isFetchingMore}
          className="w-full text-xs text-muted-foreground hover:text-foreground h-7 rounded-lg"
        >
          {isFetchingMore ? (
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

// Wrap in a Provider locally so we don't touch the global main.tsx.
// The whole app stays on React Query; the saga lives only here.
export function PostCommentRepliesSaga(props: PostCommentRepliesProps) {
  return (
    <Provider store={store}>
      <PostCommentRepliesSagaInner {...props} />
    </Provider>
  );
}