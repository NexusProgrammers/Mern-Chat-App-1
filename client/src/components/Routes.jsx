import { useContext } from "react";
import Auth from "../pages/Auth";
import Chat from "../pages/Chat";
import { UserContext } from "./UserContext";
import Cookies from "js-cookie";

const Routes = () => {
  const token = Cookies.get("token");

  const { userData } = useContext(UserContext);

  console.log("userData", userData);

  if (userData) {
    return <Chat />;
  }

  return <Auth />;
};

export default Routes;
