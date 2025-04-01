import { memo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchUsers } from "./model/fetch-users";
import { UserId, usersSlice } from "./users.slice";
import "./usersList.css";

export function UsersList() {
  const [sortType, setSortType] = useState<"asc" | "desc">("asc");
  const dispatch = useAppDispatch();
  // const appStore = useAppStore();

  useEffect(() => {
    dispatch(fetchUsers);
    // fetchUsers(appStore.dispatch, appStore.getState);
  }, [dispatch]);

  const sortedUsers = useAppSelector((state) =>
    usersSlice.selectors.selectSortedUsers(state, sortType)
  );

  const selectedUserId = useAppSelector(
    usersSlice.selectors.selectSelectedUserId
  );

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
              <UserListItem userId={user.id} key={user.id} />
            ))}
          </ul>
        </div>
      ) : (
        <SelectedUser userId={selectedUserId} />
      )}
    </div>
  );
}

const UserListItem = memo(function UserListItem({
  userId,
}: {
  userId: UserId;
}) {
  const user = useAppSelector((state) => state.users.entities[userId]);
  const dispatch = useAppDispatch();

  const handleUserClick = () => {
    dispatch(usersSlice.actions.selected({ userId }));
  };

  return (
    <li className="user-item" onClick={handleUserClick}>
      <span>{user.name}</span>
    </li>
  );
});

function SelectedUser({ userId }: { userId: UserId }) {
  const user = useAppSelector((state) => state.users.entities[userId]);
  const dispatch = useAppDispatch();

  const handleBackButtonClick = () => {
    dispatch(usersSlice.actions.selectRemove());
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
