import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PostComment } from "@/features/post-comments/model/postComment.ts";

/**
 * State for ONE replies thread. The store is created locally in a Provider
 * per comment, so there's no need for a map keyed by commentId — this state
 * IS the reply thread of a single comment.
 *
 * Even though we write `state.items = ...` (looks like a mutation), createSlice
 * runs the reducer through Immer: you edit a draft, and Immer builds a new
 * immutable object from it. The original state is never touched.
 */
export interface RepliesState {
  items: PostComment[];
  page: number;        // last loaded page
  total: number;       // total replies on the server
  isLoading: boolean;  // initial load
  isFetchingMore: boolean;
  isAdding: boolean;
}

const initialState: RepliesState = {
  items: [],
  page: -1,
  total: 0,
  isLoading: false,
  isFetchingMore: false,
  isAdding: false,
};

export const LOAD_MORE_LIMIT = 5;

const repliesSlice = createSlice({
  name: "replies",
  initialState,
  reducers: {
    // --- loading the thread (first page or "load more") ---
    // These actions do NOT change the data themselves — they only flip flags
    // and act as a signal for the saga. The data is filled in by *Success.
    // postId/commentId in the payload are only needed by the saga (to hit the
    // API); they are not stored in state.
    fetchReplies(
      state,
      _action: PayloadAction<{ postId: number; commentId: number }>
    ) {
      state.isLoading = true;
    },
    fetchMoreReplies(
      state,
      _action: PayloadAction<{ postId: number; commentId: number }>
    ) {
      state.isFetchingMore = true;
    },
    fetchRepliesSuccess(
      state,
      action: PayloadAction<{
        items: PostComment[];
        page: number;
        total: number;
        append: boolean;
      }>
    ) {
      const { items, page, total, append } = action.payload;
      state.items = append ? [...state.items, ...items] : items;
      state.page = page;
      state.total = total;
      state.isLoading = false;
      state.isFetchingMore = false;
    },
    fetchRepliesFailure(state) {
      state.isLoading = false;
      state.isFetchingMore = false;
    },

    // --- adding a reply ---
    addReply(
      state,
      _action: PayloadAction<{ postId: number; commentId: number; content: string }>
    ) {
      state.isAdding = true;
    },
    addReplySuccess(state, action: PayloadAction<{ reply: PostComment }>) {
      state.items = [...state.items, action.payload.reply];
      state.total += 1;
      state.isAdding = false;
    },
    addReplyFailure(state) {
      state.isAdding = false;
    },

    // --- like / unlike a reply ---
    // Optimistically update the specific reply right away; the saga hits the server.
    likeReply(
      state,
      action: PayloadAction<{
        postId: number;
        commentId: number;
        replyId: number;
        userId: number;
      }>
    ) {
      const reply = state.items.find((r) => r.id === action.payload.replyId);
      if (reply) {
        reply.likesCount = (reply.likesCount ?? 0) + 1;
        reply.likes = [
          ...(reply.likes ?? []),
          {
            id: -1,
            commentId: reply.id,
            userId: action.payload.userId,
            createdAt: new Date().toISOString(),
          },
        ];
      }
    },
    unlikeReply(
      state,
      action: PayloadAction<{
        postId: number;
        commentId: number;
        replyId: number;
        userId: number;
      }>
    ) {
      const reply = state.items.find((r) => r.id === action.payload.replyId);
      if (reply) {
        reply.likesCount = Math.max(0, (reply.likesCount ?? 0) - 1);
        reply.likes = (reply.likes ?? []).filter(
          (l) => l.userId !== action.payload.userId
        );
      }
    },
    // On success the server returns the up-to-date reply — sync it in.
    likeReplySuccess(state, action: PayloadAction<{ reply: PostComment }>) {
      const idx = state.items.findIndex((r) => r.id === action.payload.reply.id);
      if (idx !== -1) state.items[idx] = action.payload.reply;
    },
  },
});

export const {
  fetchReplies,
  fetchMoreReplies,
  fetchRepliesSuccess,
  fetchRepliesFailure,
  addReply,
  addReplySuccess,
  addReplyFailure,
  likeReply,
  unlikeReply,
  likeReplySuccess,
} = repliesSlice.actions;

export const repliesReducer = repliesSlice.reducer;