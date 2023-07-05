import styled from "styled-components/native";
import { useUser } from "../libs/context";
import { useQuery } from "react-query";
import { BluecardWithProject } from "../libs/schema";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { TabNavParamList } from "../navigation/Root";
import { TouchableWithoutFeedback } from "react-native";
import { Path, Rect, Svg } from "react-native-svg";
import { greeting } from "../libs/api";

const ThumbContainer = styled.View<{ isUser?: boolean }>`
  flex-direction: ${(props) => (props.isUser ? "column" : "row")};
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${(props) => (props.isUser ? "100%" : "80px")};
  padding: 0px 20px;
  background-color: #f8f9fa;
`;

const IndexWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 30px;
`;

const Index = styled.View`
  justify-content: center;
  align-items: flex-end;
  flex: 1;
`;

const IndexH1 = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);
`;

const IndexH2 = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.85);
`;
const IndexSpan = styled.Text`
  font-size: 16px;
`;

interface Props {
  name?: string;
  isUser?: boolean;
  isLogin?: boolean;
}

interface Response {
  data: {
    updatedBluecards: BluecardWithProject[];
    upComingEvents: BluecardWithProject[];
    progressingEvents: BluecardWithProject[];
  };
}

export default function Greeting({ name, isUser, isLogin }: Props) {
  const navigation = useNavigation<NavigationProp<TabNavParamList>>();
  const user = useUser();
  const { data } = useQuery<Response>("greeting", greeting);

  return (
    <ThumbContainer isUser={isUser}>
      {data ? (
        <IndexWrapper>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("WatchList", { screen: "Main" })}
          >
            <Index>
              <IndexH1>Updated Bluecards</IndexH1>
              <IndexH2>{data?.data.updatedBluecards.length}</IndexH2>
            </Index>
          </TouchableWithoutFeedback>
          <Svg width="2" height="32" viewBox="0 0 2 32" fill="none">
            <Rect
              width="0"
              height="32"
              transform="translate(1 0.000976562)"
              fill="black"
              fillOpacity="0.06"
            />
            <Path
              d="M1 0.000976562V32.001"
              stroke="black"
              strokeOpacity="0.06"
            />
          </Svg>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Calendar")}
          >
            <Index>
              <IndexH1>Upcoming Events(3days)</IndexH1>
              <IndexH2>
                {isUser || isLogin
                  ? isUser || isLogin
                    ? `${
                        data?.data.progressingEvents.filter((card) =>
                          user.user?.calendar.includes(card.id)
                        ).length
                      }`
                    : `${data?.data.progressingEvents.length}`
                  : `${data?.data.progressingEvents.length}`}
                <IndexSpan>
                  {isUser || isLogin
                    ? isUser || isLogin
                      ? `/${
                          data?.data.progressingEvents.filter((card) =>
                            user.user?.calendar.includes(card.id)
                          ).length +
                          data?.data.upComingEvents.filter((card) =>
                            user.user?.calendar.includes(card.id)
                          ).length
                        }`
                      : `/${
                          data?.data.progressingEvents.length +
                          data?.data.upComingEvents.length
                        }`
                    : `/${
                        data?.data.progressingEvents.length +
                        data?.data.upComingEvents.length
                      }`}
                </IndexSpan>
              </IndexH2>
            </Index>
          </TouchableWithoutFeedback>
          {isUser ? (
            <>
              <Svg width="2" height="32" viewBox="0 0 2 32" fill="none">
                <Rect
                  width="0"
                  height="32"
                  transform="translate(1 0.000976562)"
                  fill="black"
                  fillOpacity="0.06"
                />
                <Path
                  d="M1 0.000976562V32.001"
                  stroke="black"
                  strokeOpacity="0.06"
                />
              </Svg>
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("WatchList", { screen: "Main" })
                }
              >
                <Index>
                  <IndexH1>Following Projects</IndexH1>
                  <IndexH2>{user.user?.subscribe.length}</IndexH2>
                </Index>
              </TouchableWithoutFeedback>
            </>
          ) : null}
        </IndexWrapper>
      ) : null}
    </ThumbContainer>
  );
}
