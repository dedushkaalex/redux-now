import { AppState } from "../../store";

type CounterState = {
  counter: number;
};
const initialCounterState: CounterState = { counter: 0 };

export type CounterId = string;

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

type CountersState = Record<CounterId, CounterState | undefined>;

const initialCountersState: CountersState = {};

export const countersReducer = (
  state = initialCountersState,
  action: Action
): CountersState => {
  switch (action.type) {
    case "increment": {
      const { counterId } = action.payload;
      const currentCounter = state[counterId] ?? initialCounterState;

      return {
        ...state,
        [counterId]: {
          ...currentCounter,
          counter: currentCounter.counter + 1,
        },
      };
    }
    case "decrement": {
      const { counterId } = action.payload;
      const currentCounter = state[counterId] ?? initialCounterState;

      return {
        ...state,
        [counterId]: {
          ...currentCounter,
          counter: currentCounter.counter - 1,
        },
      };
    }
    default:
      return state;
  }
};

export const selectCounter = (state: AppState, counterId: CounterId) =>
  state.counters[counterId];
