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
  fetchUsersStatus: "idle" | "pending" | "success" | "failed";
  fetchUserStatus: "idle" | "pending" | "success" | "failed";
};

const initialUsersState: UsersState = {
  entities: {},
  ids: [],
  fetchUsersStatus: "idle",
  fetchUserStatus: "idle",
};

export const usersSlice = createSlice({
  name: "users",
  initialState: initialUsersState,
  selectors: {
    selectUserById: (state, userId: UserId) => state.entities[userId],
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
    selectIsFetchUsersPending: (state) => state.fetchUsersStatus === "pending",
    selectIsFetchUsersIdle: (state) => state.fetchUsersStatus === "idle",
    selectIsFetchUserPending: (state) => state.fetchUserStatus === "pending",
    selectIsFetchUserIdle: (state) => state.fetchUserStatus === "idle",
  },
  reducers: {
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
    fetchUserPending: (state) => {
      state.fetchUserStatus = "pending";
    },
    fetchUserFailed: (state) => {
      state.fetchUserStatus = "failed";
    },
    fetchUserSuccess: (state, action: PayloadAction<{ user: User }>) => {
      const { user } = action.payload;
      state.fetchUserStatus = "success";
      state.entities[user.id] = user;
    },
  },
});
