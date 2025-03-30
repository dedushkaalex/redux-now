import { Counters } from "./modules/counters/counters";
import { UsersList } from "./modules/users/users-list";

function App() {
  return (
    <div className="app">
      <Counters />
      <UsersList />
    </div>
  );
}

export default App;
