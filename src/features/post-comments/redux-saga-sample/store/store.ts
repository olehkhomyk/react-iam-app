import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { repliesReducer } from "./repliesSlice.ts";
import { repliesRootSaga } from "./repliesSaga.ts";

// 1. Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// 2. Register the reducer(s) and add the middleware to the chain
export const store = configureStore({
  reducer: {
    replies: repliesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

// 3. Run the root saga — now the watchers listen for actions
sagaMiddleware.run(repliesRootSaga);

// Types for typed useSelector / useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;