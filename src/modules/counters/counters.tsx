import { bindActionCreators } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../store";
import "./counter.css";
import {
  CounterId,
  decrementAction,
  incrementAction,
  selectCounter,
} from "./counters.slice";

export function Counters() {
  return (
    <div className="counters">
      <Counter counterId="first" />
      <Counter counterId="second" />
    </div>
  );
}

export function Counter({ counterId }: { counterId: CounterId }) {
  const dispatch = useAppDispatch();
  const counterState = useAppSelector((state) =>
    selectCounter(state, counterId)
  );

  console.log("render counter", counterId);

  const actions = bindActionCreators(
    {
      incrementAction,
      decrementAction,
    },
    dispatch
  );

  return (
    <div className="counter">
      <span>counter {counterState?.counter}</span>
      <button
        onClick={() => actions.incrementAction({ counterId })}
        className="button"
      >
        increment
      </button>
      <button
        onClick={() => actions.decrementAction({ counterId })}
        className="button"
      >
        decrement
      </button>
    </div>
  );
}
