import { Dispatch, SetStateAction } from "react";
import { Project, User } from "./schema";
import { useMutationResult } from "./useMutation";
import Toast from "react-native-toast-message";

interface Props {
  subscribeList: string[];
  setSubscribeList: Dispatch<SetStateAction<string[]>>;
  project: Project;
  user: User | null;
  mutation: useMutationResult<any, any>;
  setUser: any;
}

export default async function subscribeProject({
  subscribeList,
  setSubscribeList,
  project,
  user,
  mutation,
  setUser,
}: Props) {
  if (!user) {
  } else if (!mutation[1].loading) {
    if (subscribeList.includes(project.key)) {
      const array: string[] = [];
      subscribeList.map((pro) => {
        if (pro !== project.key) {
          array.push(pro);
        }
      });
      setUser({ ...user, subscribe: array });
      setSubscribeList(array);
      Toast.show({
        type: "success",
        text1: `${project.title} 구독 취소하였습니다.`,
        topOffset: 100,
      });
    } else {
      setUser({ ...user, subscribe: [...user.subscribe, project.key] });
      setSubscribeList((prev) => [...prev, project.key]);
      Toast.show({
        type: "success",
        text1: `${project.title} 구독하였습니다.`,
        topOffset: 100,
      });
    }
    mutation[0]({
      projectId: project.id,
      id: user.id,
    });
  }
}
