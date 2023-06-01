import React, { useContext } from "react";
import { SocialUser, User } from "./schema";

export const UserContext = React.createContext<{
  user: User | SocialUser | null;
  setUser: any;
  setToken: any;
}>({ user: null, setUser: null, setToken: null });

export const useUser = () => {
  return useContext(UserContext);
};
