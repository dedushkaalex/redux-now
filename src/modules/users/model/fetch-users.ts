import { api } from "../../../shared/api";
import { AppDispatch, AppState } from "../../../store";
import { usersSlice } from "../users.slice";

// лучше брать стор, диспатч и т д из контекста - можно инициализировать в рантайме и т д, если берем стор который экспортируется, то могут быть проблемы.

export const fetchUsers = (dispatch: AppDispatch, getState: () => AppState) => {
  const isIdle = usersSlice.selectors.selectIsFetchUserIdle(getState());
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
