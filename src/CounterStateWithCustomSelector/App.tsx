import { useEffect, useReducer, useRef } from "react";
import reactLogo from "./assets/react.svg";
import {
  AppState,
  CounterId,
  DecrementAction,
  IncrementAction,
  store,
} from "./store.ts";
import viteLogo from "/vite.svg";

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Counter counterId="first" />
        <Counter counterId="second" />
      </div>
    </>
  );
}

const selectCounter = (state: AppState, counterId: CounterId) =>
  state.counters[counterId];

export function Counter({ counterId }: { counterId: CounterId }) {
  const [, forceUpdate] = useReducer((count) => count + 1, 0);
  const lastStateRef = useRef<ReturnType<typeof selectCounter>>(undefined);

  console.log("render counter", counterId);
  useEffect(() => {
    const unsub = store.subscribe(() => {
      const currentState = selectCounter(store.getState(), counterId);
      const lastState = lastStateRef.current;

      console.log(currentState, lastState);

      if (currentState !== lastState) {
        forceUpdate();
      }
      lastStateRef.current = currentState;
    });

    return unsub;
  }, []);

  const counterState = selectCounter(store.getState(), counterId);
  return (
    <>
      <h2>Count: {counterState?.counter}</h2>
      <button
        onClick={() =>
          store.dispatch({
            type: "increment",
            payload: { counterId },
          } satisfies IncrementAction)
        }
      >
        Increment
      </button>
      <button
        onClick={() =>
          store.dispatch({
            type: "decrement",
            payload: { counterId },
          } satisfies DecrementAction)
        }
      >
        Decrement
      </button>
    </>
  );
}

export default App;
