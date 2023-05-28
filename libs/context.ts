import React, { useContext } from "react";
import { User } from "./schema";

export const UserContext = React.createContext<{
  user: User | null;
  setUser: any;
}>({ user: null, setUser: null });

export const useUser = () => {
  return useContext(UserContext);
};
