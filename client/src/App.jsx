import { UserContextProvider } from "./components/UserContext";
import Routes from "./components/Routes";

const App = () => {
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
};

export default App;
