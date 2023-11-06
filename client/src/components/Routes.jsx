import { useContext } from "react";
import Auth from "../pages/Auth";
import Chat from "../pages/Chat";
import { UserContext } from "./UserContext";

const Routes = () => {
  const { userData } = useContext(UserContext);

  if (userData) {
    return <Chat />;
  }

  return <Auth />;
};

export default Routes;
