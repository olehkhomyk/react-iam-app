import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store.ts";

// Typed wrappers — so we don't repeat the types in every component.
export const useAppDispatch = () => useDispatch<AppDispatch>();
export function useAppSelector<T>(selector: (state: RootState) => T): T {
  return useSelector(selector);
}