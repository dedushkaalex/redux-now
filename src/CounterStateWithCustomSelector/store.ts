import { configureStore } from "@reduxjs/toolkit";

type CounterState = {
  counter: number;
};

export type CounterId = string;

export type State = {
  counters: Record<CounterId, CounterState | undefined>; // | undefined - так будет меньше ошибок тайпскрипта
};

export type IncrementAction = {
  type: "increment";
  payload: {
    counterId: CounterId;
  };
};

export type DecrementAction = {
  type: "decrement";
  payload: {
    counterId: CounterId;
  };
};

type Action = IncrementAction | DecrementAction;

const initialCounterState: CounterState = { counter: 0 };

const initialState: State = {
  counters: {},
};

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case "increment": {
      const { counterId } = action.payload;
      const currentCounter = state.counters[counterId] ?? initialCounterState;

      return {
        ...state,
        counters: {
          ...state.counters,
          [counterId]: {
            ...currentCounter,
            counter: currentCounter.counter + 1,
          },
        },
      };
    }
    case "decrement": {
      const { counterId } = action.payload;
      const currentCounter = state.counters[counterId] ?? initialCounterState;

      return {
        ...state,
        counters: {
          ...state.counters,
          [counterId]: {
            ...currentCounter,
            counter: currentCounter.counter - 1,
          },
        },
      };
    }

    default:
      return state;
  }
};

/** Создает стор */
export const store = configureStore({
  reducer: reducer,
});

// store.dispatch;
// store.getState;
// store.subscribe;

export type AppState = ReturnType<typeof store.getState>;
