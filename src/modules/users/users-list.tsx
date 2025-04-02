import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchUsers } from "./model/fetch-users";
import { UserId, usersSlice } from "./users.slice";
import "./usersList.css";

export function UsersList() {
  const [sortType, setSortType] = useState<"asc" | "desc">("asc");
  const dispatch = useAppDispatch();
  // const appStore = useAppStore();

  useEffect(() => {
    dispatch(fetchUsers());
    // fetchUsers(appStore.dispatch, appStore.getState);
  }, [dispatch]);

  const sortedUsers = useAppSelector((state) =>
    usersSlice.selectors.selectSortedUsers(state, sortType)
  );

  return (
    <div className="users-container">
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
    </div>
  );
}

const UserListItem = memo(function UserListItem({
  userId,
}: {
  userId: UserId;
}) {
  const user = useAppSelector((state) => state.users.entities[userId]);
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate(userId, { relative: "path" });
  };

  return (
    <li className="user-item" onClick={handleUserClick}>
      <span>{user.name}</span>
    </li>
  );
});
