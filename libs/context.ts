import React, { useContext } from "react";
import { User } from "./schema";

export const UserContext = React.createContext<{
  user: User | null;
  setUser: any;
  setToken: any;
}>({ user: null, setUser: null, setToken: null });

export const useUser = () => {
  return useContext(UserContext);
};
