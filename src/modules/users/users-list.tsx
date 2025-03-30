import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  selectSelectedUserId,
  selectSortedUsers,
  User,
  UserId,
  UserRemoveSelectedAction,
  UserSelectedAction,
} from "./users.slice";
import "./usersList.css";

export function UsersList() {
  const [sortType, setSortType] = useState<"asc" | "desc">("asc");

  const sortedUsers = useAppSelector((state) =>
    selectSortedUsers(state, sortType)
  );

  const selectedUserId = useAppSelector(selectSelectedUserId);
  // const entities = useAppSelector((state) => {

  //   return state.users.entities;
  // });

  // const selectedUser = selectedUserId ? entities[selectedUserId] : undefined;

  // ООчень плохо. ‼️🔴 Будет лагать
  // const sortedUsers = useAppSelector((state) =>
  //   state.users.ids
  //     .map((id) => entities[id])
  //     .sort((a, b) =>
  //       sortType === "asc"
  //         ? a.name.localeCompare(b.name)
  //         : b.name.localeCompare(a.name)
  //     )
  // );

  // Или так
  // const selectSortedUsers = createAppSelector(
  //   (state: AppState) => state.users.ids,
  //   (state: AppState) => state.users.entities,
  //   (_: AppState, sort: "asc" | "desc") => sort,
  //   (ids, entities, sort) =>
  //     ids
  //       .map((id) => entities[id])
  //       .sort((a, b) => {
  //         if (sort === "asc") {
  //           return a.name.localeCompare(b.name);
  //         } else {
  //           return b.name.localeCompare(a.name);
  //         }
  //       })
  // );

  // const sortedUsers = ids
  //   .map((id) => entities[id])
  //   .sort((a, b) =>
  //     sortType === "asc"
  //       ? a.name.localeCompare(b.name)
  //       : b.name.localeCompare(a.name)
  //   );

  return (
    <div className="users-container">
      {!selectedUserId ? (
        <div className="user-list">
          <div className="sort-buttons">
            <button onClick={() => setSortType("asc")} className="button">
              Asc
            </button>
            <button onClick={() => setSortType("desc")} className="button">
              Desc
            </button>
          </div>
          <ul className="user-items">
            {sortedUsers.map((user) => (
              <UserListItem key={user.id} user={user} />
            ))}
          </ul>
        </div>
      ) : (
        <SelectedUser userId={selectedUserId} />
      )}
    </div>
  );
}

function UserListItem({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const handleUserClick = () => {
    dispatch({
      type: "userSelected",
      payload: { userId: user.id },
    } satisfies UserSelectedAction);
  };
  return (
    <li className="user-item" onClick={handleUserClick}>
      <span>{user.name}</span>
    </li>
  );
}

function SelectedUser({ userId }: { userId: UserId }) {
  const user = useAppSelector((state) => state.users.entities[userId]);

  const dispatch = useAppDispatch();

  const handleBackButtonClick = () => {
    dispatch({
      type: "userRemoveSelected",
    } satisfies UserRemoveSelectedAction);
  };

  return (
    <div className="selected-user">
      <button onClick={handleBackButtonClick} className="button">
        Back
      </button>
      <h2 className="user-title">{user.name}</h2>
      <p className="user-description">{user.description}</p>
    </div>
  );
}
