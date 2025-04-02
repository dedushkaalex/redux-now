import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchUser } from "./model/fetch-user";
import { usersSlice } from "./users.slice";

export const UserInfo = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isPending = useAppSelector(
    usersSlice.selectors.selectIsFetchUserPending
  );
  const user = useAppSelector((state) =>
    usersSlice.selectors.selectUserById(state, id)
  );

  useEffect(() => {
    dispatch(fetchUser(id));
  }, [id, dispatch]);

  const handleBackButtonClick = () => {
    navigate("..", { relative: "path" });
  };

  if (isPending || !user) {
    return <h1>LOADING....</h1>;
  }
  return (
    <div className="selected-user">
      <button onClick={handleBackButtonClick} className="button">
        Back
      </button>
      <h2 className="user-title">{user.name}</h2>
      <p className="user-description">{user.description}</p>
    </div>
  );
};
