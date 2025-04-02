import { AppThunk } from "../../../store";
import { usersSlice } from "../users.slice";

// лучше брать стор, диспатч и т д из контекста - можно инициализировать в рантайме и т д, если берем стор который экспортируется, то могут быть проблемы.

export const fetchUsers =
  (): AppThunk =>
  (dispatch, getState, { api }) => {
    const isIdle = usersSlice.selectors.selectIsFetchUsersIdle(getState());
    if (!isIdle) return;

    dispatch(usersSlice.actions.fetchUsersPending());
    api
      .getUsers()
      .then((users) => {
        dispatch(usersSlice.actions.fetchUsersSuccess({ users }));
        console.log("отработал диспач из параллельного фечинга");
      })
      .catch(() => {
        dispatch(usersSlice.actions.fetchUsersFailed());
      });
  };
