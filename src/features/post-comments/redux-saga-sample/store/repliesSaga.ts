import { call, put, select, takeLatest, takeEvery } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  addPostComment,
  fetchCommentReplies,
  likePostComment,
  unlikePostComment,
} from "@/features/post-comments/api/comments.api.ts";
import type { CommentPage } from "@/features/post-comments/api/comments.api.ts";
import type { PostComment } from "@/features/post-comments/model/postComment.ts";
import {
  LOAD_MORE_LIMIT,
  addReply,
  addReplyFailure,
  addReplySuccess,
  fetchMoreReplies,
  fetchReplies,
  fetchRepliesFailure,
  fetchRepliesSuccess,
  likeReply,
  likeReplySuccess,
  unlikeReply,
} from "./repliesSlice.ts";
import type { RootState } from "./store.ts";

/**
 * WORKER: load the replies thread.
 * `append` = true for "load more", false for the initial load.
 *
 * Read the generator body top-to-bottom like ordinary sequential code:
 * each yield "pauses" it, the middleware runs the effect and returns the result.
 */
function* fetchInitialSaga(action: PayloadAction<{ postId: number; commentId: number }>) {
  yield* fetchRepliesSaga(action, false);
}

function* fetchMoreSaga(action: PayloadAction<{ postId: number; commentId: number }>) {
  yield* fetchRepliesSaga(action, true);
}

function* fetchRepliesSaga(
  action: PayloadAction<{ postId: number; commentId: number }>,
  append: boolean
) {
  const { postId, commentId } = action.payload;
  try {
    // select: read the current page from the store to know the next one
    const currentPage: number = yield select(
      (state: RootState) => state.replies.page
    );
    const nextPage = append ? currentPage + 1 : 0;

    // call: invoke the API and WAIT for the promise. The saga unwraps it for us.
    const page: CommentPage = yield call(
      fetchCommentReplies,
      postId,
      commentId,
      nextPage,
      LOAD_MORE_LIMIT
    );

    // put: dispatch the success action → the reducer puts the data into the store
    yield put(
      fetchRepliesSuccess({
        items: page.content,
        page: nextPage,
        total: page.pagination.total,
        append,
      })
    );
  } catch {
    yield put(fetchRepliesFailure());
  }
}

/** WORKER: add a reply. */
function* addReplySaga(
  action: PayloadAction<{ postId: number; commentId: number; content: string }>
) {
  const { postId, commentId, content } = action.payload;
  try {
    const reply: PostComment = yield call(addPostComment, postId, content, commentId);
    yield put(addReplySuccess({ reply }));
  } catch {
    yield put(addReplyFailure());
  }
}

/** WORKER: like. State was already updated optimistically in the reducer — this is just the server. */
function* likeReplySaga(
  action: PayloadAction<{ postId: number; replyId: number }>
) {
  const { postId, replyId } = action.payload;
  try {
    const reply: PostComment = yield call(likePostComment, postId, replyId);
    yield put(likeReplySuccess({ reply }));
  } catch {
    // roll back the optimistic update on error
    yield put(fetchRepliesFailure());
  }
}

/** WORKER: unlike. */
function* unlikeReplySaga(
  action: PayloadAction<{ postId: number; replyId: number }>
) {
  const { postId, replyId } = action.payload;
  try {
    const reply: PostComment = yield call(unlikePostComment, postId, replyId);
    yield put(likeReplySuccess({ reply }));
  } catch {
    yield put(fetchRepliesFailure());
  }
}

/**
 * ROOT WATCHER: listens for actions and starts the workers.
 * takeLatest MUST watch the worker generator directly (fetchInitialSaga), not an
 * arrow wrapper: an arrow returns the generator and finishes synchronously, so
 * cancellation attaches to the wrong thing.
 * Note: cancelling a worker does NOT abort an already-sent HTTP request — that
 * response still finishes on the network. What takeLatest guarantees is that only
 * the LAST dispatch's put(success) reaches the store, so a slower earlier response
 * can't overwrite the latest one (aborting the request needs AbortController).
 * - takeLatest: only the last run's result is applied — load/pagination.
 * - takeEvery: handles every action independently — good for likes.
 */
export function* repliesRootSaga() {
  yield takeLatest(fetchReplies.type, fetchInitialSaga);
  yield takeLatest(fetchMoreReplies.type, fetchMoreSaga);
  yield takeEvery(addReply.type, addReplySaga);
  yield takeEvery(likeReply.type, likeReplySaga);
  yield takeEvery(unlikeReply.type, unlikeReplySaga);
}
