import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_AUTH_URL } from "../api";
import Cookies from "js-cookie";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(`${BASE_AUTH_URL}/profile`, {
            withCredentials: true,
          });
          console.log("response", response);
          setUserData(response?.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>
  );
}
