import { Dispatch, SetStateAction } from "react";
import { Project, User } from "./schema";
import { useMutationResult } from "./useMutation";
import Toast from "react-native-toast-message";

interface Props {
  bluecardId: string;
  user: User | null;
  mutation: useMutationResult<any, any>;
  setUser: any;
  setCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default async function calendarAdd({
  bluecardId,
  user,
  mutation,
  setUser,
  setCalendar,
}: Props) {
  if (!mutation[1].loading && user) {
    if (user?.calendar.includes(bluecardId)) {
      const array: string[] = [];
      user?.calendar.map((id) => {
        if (id !== bluecardId) {
          array.push(id);
        }
      });
      setCalendar(false);
      setUser({ ...user, calendar: array });
      Toast.show({
        type: "success",
        text1: "취소하였습니다.",
        topOffset: 100,
      });
    } else {
      setCalendar(true);
      setUser({ ...user, calendar: [...user.calendar, bluecardId] });
      Toast.show({
        type: "success",
        text1: `추가하였습니다.`,
        topOffset: 100,
      });
    }
    mutation[0]({
      bluecardId,
      id: user.id,
    });
  }
}
