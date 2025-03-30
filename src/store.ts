import {
  combineReducers,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { countersReducer } from "./modules/counters/counters.slice";
import {
  initialUsersList,
  usersReducer,
  UsersStoredAction,
} from "./modules/users/users.slice";

const reducer = combineReducers({
  users: usersReducer,
  counters: countersReducer,
});

/** Создает стор */
export const store = configureStore({
  reducer: reducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppSelector = createSelector.withTypes<AppState>();

store.dispatch({
  type: "usersStored",
  payload: { users: initialUsersList },
} satisfies UsersStoredAction);
