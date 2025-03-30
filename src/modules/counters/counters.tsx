import { useDispatch } from "react-redux";

import { useAppSelector } from "../../store";
import "./counter.css";
import {
  CounterId,
  DecrementAction,
  IncrementAction,
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
  const dispatch = useDispatch();
  const counterState = useAppSelector((state) =>
    selectCounter(state, counterId)
  );

  console.log("render counter", counterId);

  return (
    <div className="counter">
      <span>counter {counterState?.counter}</span>
      <button
        onClick={() =>
          dispatch({
            type: "increment",
            payload: { counterId },
          } satisfies IncrementAction)
        }
        className="button"
      >
        increment
      </button>
      <button
        onClick={() =>
          dispatch({
            type: "decrement",
            payload: { counterId },
          } satisfies DecrementAction)
        }
        className="button"
      >
        decrement
      </button>
    </div>
  );
}
