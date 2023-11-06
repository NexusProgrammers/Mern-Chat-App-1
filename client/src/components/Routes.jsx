import { useContext } from "react";
import Auth from "../pages/Auth";
import Chat from "../pages/Chat";
import { UserContext } from "./UserContext";
import Cookies from "js-cookie";

const Routes = () => {
  const token = Cookies.get("token");

  const { userData } = useContext(UserContext);

  // if (token && userData) {
  //   return <Chat />;
  // }

  // return <Auth />;

  {
    token ? <Chat /> : <Auth />;
  }
};

export default Routes;
