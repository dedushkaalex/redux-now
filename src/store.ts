import {
  configureStore,
  createSelector,
  ThunkAction,
  UnknownAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { countersReducer } from "./modules/counters/counters.slice";
import { usersSlice } from "./modules/users/users.slice";
import { api } from "./shared/api";

const extraArgument = {
  api,
};
/** Создает стор */
export const store = configureStore({
  reducer: {
    counters: countersReducer,
    [usersSlice.name]: usersSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument } }),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<Return = void> = ThunkAction<
  Return,
  AppState,
  typeof extraArgument,
  UnknownAction
>;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>();
