import axios from "axios";
import { UserContextProvider } from "./components/UserContext";
import Routes from "./components/Routes";

axios.defaults.withCredentials = true;

const App = () => {
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
};

export default App;
