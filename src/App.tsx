import { useEffect } from "react";
import { Counters } from "./modules/counters/counters";
import { UsersList } from "./modules/users/users-list";

function App() {
  useEffect(() => {
    console.log("Рендеринг компонента");
  }, []);
  return (
    <div className="app">
      <Counters />
      <UsersList />
    </div>
  );
}

export default App;
