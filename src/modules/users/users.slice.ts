import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: UserId;
  name: string;
  description: string;
};

export type UserId = string;

export const initialUsersList: User[] = Array.from(
  { length: 3000 },
  (_, index) => ({
    id: `user${index + 11}`,
    name: `User ${index + 11}`,
    description: `Description for User ${index + 11}`,
  })
);

type UsersState = {
  entities: Record<UserId, User>;
  ids: UserId[];
  selectedUserId: UserId | undefined;
  fetchUsersStatus: "idle" | "pending" | "success" | "failed";
};

const initialUsersState: UsersState = {
  entities: {},
  ids: [],
  selectedUserId: undefined,
  fetchUsersStatus: "idle",
};

export const usersSlice = createSlice({
  name: "users",
  initialState: initialUsersState,
  selectors: {
    selectSelectedUserId: (state) => state.selectedUserId,
    selectSortedUsers: createSelector(
      (state: UsersState) => state.ids,
      (state: UsersState) => state.entities,
      (_: UsersState, sort: "asc" | "desc") => sort,
      (ids, entities, sort) =>
        ids
          .map((id) => entities[id])
          .sort((a, b) => {
            if (sort === "asc") {
              return a.name.localeCompare(b.name);
            } else {
              return b.name.localeCompare(a.name);
            }
          })
    ),
    selectIsFetchUserPending: (state) => state.fetchUsersStatus === "pending",
    selectIsFetchUserIdle: (state) => state.fetchUsersStatus === "idle",
  },
  reducers: {
    selected: (state, action: PayloadAction<{ userId: UserId }>) => {
      const { userId } = action.payload;
      state.selectedUserId = userId;
    },
    selectRemove: (state) => {
      state.selectedUserId = undefined;
    },
    fetchUsersPending: (state) => {
      state.fetchUsersStatus = "pending";
    },
    fetchUsersFailed: (state) => {
      state.fetchUsersStatus = "failed";
    },
    fetchUsersSuccess: (state, action: PayloadAction<{ users: User[] }>) => {
      const { users } = action.payload;

      state.fetchUsersStatus = "success";
      state.entities = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {} as Record<UserId, User>);

      state.ids = users.map((user) => user.id);
    },
  },
});
