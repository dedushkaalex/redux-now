import { createAction, createReducer } from "@reduxjs/toolkit";
import { AppState } from "../../store";

type CounterState = {
  counter: number;
};
const initialCounterState: CounterState = { counter: 0 };

export type CounterId = string;

export const incrementAction = createAction<{
  counterId: CounterId;
}>("counters/increment");

export const decrementAction = createAction<{
  counterId: CounterId;
}>("counters/decrement");

type CountersState = Record<CounterId, CounterState | undefined>;

const initialCountersState: CountersState = {};

export const countersReducer = createReducer(
  initialCountersState,
  (builder) => {
    builder.addCase(incrementAction, (state, action) => {
      const { counterId } = action.payload;

      if (!state[counterId]) {
        state[counterId] = initialCounterState;
        return state;
      }
      state[counterId].counter += 1;
    });
    builder.addCase(decrementAction, (state, action) => {
      const { counterId } = action.payload;

      if (!state[counterId]) {
        state[counterId] = initialCounterState;
        return state;
      }

      state[counterId].counter -= 1;
    });
  }
);

export const selectCounter = (state: AppState, counterId: CounterId) =>
  state.counters[counterId];
