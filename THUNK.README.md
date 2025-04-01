### Вещь, которую нужно держать в голове - Redux создан для того, чтобы наше состояние не зависело от структуры интерфейса и от жизненного цикла компонентов. (такого же принципа придерживается, например, эффектор)

### Как выполнять асинхронную логику в связке с redux.

Для начала определим самый простой способ, где же вызывать впринципе запрос? - Ответ - _В компоненте_.
После чего делаем dispatch, указывая нужный нам редюсер.

**Псевдокод**

```js

//reducers
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

 // Component
  const dispatch = useAppDispatch();
  const isPending = useAppSelector(usersSlice.selectors.selectIsFetchUserPending);
  const isIdle = useAppSelector(usersSlice.selectors.selectIsFetchUserIdle);

  useEffect(() => {
    if (!isIdle) return;

    dispatch(usersSlice.actions.fetchUsersPending());
    api
      .getUsers()
      .then((users) => {
        dispatch(usersSlice.actions.fetchUsersSuccess({ users }));
      })
      .catch(() => {
        dispatch(usersSlice.actions.fetchUsersFailed());
      });
  }, [dispatch, isIdle]);
```

Тут есть проблема - а именно если у нас StrictMode - у нас будет несколько раз отрабатывать useEffect и рефетчинг, то есть мы завязались на эффекте и это не очень хорошо, добавим флаг isIdle чтобы не вызывать запрос, но это не сработает, - это связано с тем, как работают селекторы, эффект вызывается после рендеринга компонента и селекторы УЖЕ отработали и + ссылка на idle, которая true на момент времени начала и потом когда useEffect перевызывается idle все равно true, хотя внутри стора он false

Попробуем сделать так - так писали раньше.
Сделали запрос к серверу в компоненте, просто информация по запросу передается в редакс.
Базовый вариант и достаточно старый. Вроде бы на этот момент еще не было async Thunk и мидлварей (надо проверить) и поэтому использовали именно таким образом, как в примере ниже

```js
const appStore = useAppStore();

useEffect(() => {
  const isIdle = usersSlice.selectors.selectIsFetchUserIdle(
    appStore.getState()
  );
  if (!isIdle) return;

  dispatch(usersSlice.actions.fetchUsersPending());
  api
    .getUsers()
    .then((users) => {
      dispatch(usersSlice.actions.fetchUsersSuccess({ users }));
    })
    .catch(() => {
      dispatch(usersSlice.actions.fetchUsersFailed());
    });
}, [dispatch, appStore]);
```

Вынесем предыдущий пример в функцию и попробуем использовать паттерн Параллельного Фетчинга
_Паттерн параллельного фетчинга_ - запрос данных параллельно рендерингу компонента.

```js
// лучше брать стор, диспатч и т д из контекста - можно инициализировать в рантайме и т д, если берем стор который экспортируется, то могут быть проблемы.
export const fetchUsers = (dispatch: AppDispatch, getState: () => AppState) => {
  const isIdle = usersSlice.selectors.selectIsFetchUserIdle(getState());
  if (!isIdle) return;

  dispatch(usersSlice.actions.fetchUsersPending());
  api
    .getUsers()
    .then((users) => {
      dispatch(usersSlice.actions.fetchUsersSuccess({ users }));
    })
    .catch(() => {
      dispatch(usersSlice.actions.fetchUsersFailed());
    });
};

// параллельный фетчинг
fetchUsers(store.dispatch, store.getState);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

‼️‼️ **Но в чем здесь проблема ?** - нам теперь для вызова таких функций всегда импортировать useAppStore() через хуки, прокидывать из нее dispatch и getState в функцию параллельного фетчинга, а еще если прибавится роутер, всякие хуки для нотификаций, какие-то данные инициализации и прочее - это объемно и проблематично - поэтому и придумали _**Thunk**_. Но чтобы понять, что такое Thunk - разберемся сначала с middleware.

## Что такое middleware?

1. Сначала определимся, что сам store (тот самый, который создается через configureStore) с запросами не работает, мы работаем с запросами извне и редакс предоставляет нам инструменты, для того, чтобы делать эту логику извне, при этом удобным образом - паттерн middleware.

У нас бывает плотно интегрированная с редаксом логика, которая требует, чтобы можно было легко диспатчить экшены, легко получить состояние, подписываться и т д. Можно прокидывать стор в функцию, как делали в примере выше, но это неудобно, поэтому редакс предоставляет инструмент который можно использовать для подобной логике в определенном для этом месте - middleware (общераспространенный паттерн,)

Redux Middleware служит мостом между отправкой действия (action) и передачей его в reducer. Каждое действие, отправленное редуктору, может быть перехвачено с помощью Redux Middleware, что позволяет пользователю изменять или останавливать действие.
![alt text](images/image-10.png)

В самом простом варианте middleware это 3 функции, которые возвращают друг друга

```js
// функция мидлварь, которая принимает стор
// Принимает store — нужно для доступа к getState(), чтобы логировать изменения
function logger(store) {
  //функция, которая принимает старый диспатч и возвращает новый
  // Принимает next (следующий middleware или dispatch) — чтобы передать действие дальше по цепочке.
  return function wrapDispatchToAddLogging(next) {
    //Принимает action — само действие, которое обрабатываем и логируем.
    return function dispatchAndLog(action) {
      console.log("dispatching", action);
      const result = next(action); // Передача action в следующий middleware или reducer
      console.log("next state", store.getState());
      return result; // Возвращаем результат дальше по цепочке
    };
  };
}
```

## Что такое Thunk?

**Thunk** - это мидлварь, который по сути выполняет те вещи, которые мы рассматривали выше, например _fetchUsers(store.dispatch, store.getState);_. То есть может вызывать какие-то функции (диспатчить функции\*), но только те у которых есть доступ к **getState** и **dispatch**.

_Какую проблему решает?_ - расширяет возможности dispatch и позволяет передавать не только _объекты_({action: 'ADD_USER', payload: {id: 1, name: 'Alex'}}), но и функции.

🎯 Какие задачи решает Redux Thunk?

- [x]1️⃣ Асинхронные запросы
- [x]2️⃣ Отложенные (deferred) действия (Позволяет задерживать выполнение dispatch, например, используя setTimeout)
- [x]3️⃣ Доступ к getState()
- [x]4️⃣ Передача extraArguments (API, сервисы, конфиги) (Позволяет избежать импорта API в каждую функцию, передавая его в middleware)

Вот по сути как устроен thunk-middleware:

```js
function thunk(store) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }
      return next(action);
    };

 //на стрелках
 const thunkMiddleware = ({dispatch, getState}) =>
 next =>
 action => {
  if (typeof action === "function") {
    return action(dispatch, getState)
  }
  return next(action)
 }

 // или с extraArguments - дополнительные аргументы
 function createThunkMiddleware(extraArgument) {
  return function thunk(store) {
    return function wrapDispatch(next) {
      return function handleAction(action) {
        if (typeof action === 'function') {
          return action(store.dispatch, store.getState, extraArgument);
        }
        return next(action);
      };
    };
  };
}
```

🟢Важный момент - если нам надо передать параметр в thunk, нам нужно создать функцию, которая возвращает thunk. - экшн криейтор

```js
export const fetchUser =
  (userId: string) => (dispatch: AppDispatch, getState: () => AppState) => {};
const dispatch = useAppDispatch();

dispatch(fetchUser("12345"));
```
