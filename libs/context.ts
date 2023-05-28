import React, { useContext } from "react";
import { SocialUser, User } from "./schema";

export const UserContext = React.createContext<{
  user: User | SocialUser | null;
  setUser: any;
}>({ user: null, setUser: null });

export const useUser = () => {
  return useContext(UserContext);
};
