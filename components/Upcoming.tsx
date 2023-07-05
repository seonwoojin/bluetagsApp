import styled from "styled-components/native";
import { BluecardWithProject } from "../libs/schema";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  CalendarStackNavParamList,
  RootNavParamList,
} from "../navigation/Root";
import { TouchableWithoutFeedback } from "react-native";

const BluecardWrapper = styled.View<{ isUser?: boolean }>`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
  min-height: ${(props) => (props.isUser ? "0px" : "800px")};
  padding: 0px 30px 30px 30px;
  background-color: #ffffff;
`;

const BluecardWrapperTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  min-height: 80px;
`;

const BluecardWrapperTitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #010101;
`;

const SubSelect = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 25px;
  border: 1px solid #257cff;
  border-radius: 12px;
`;

const SubSelectText = styled.Text`
  font-weight: 700;
  font-size: 10px;
  color: #257cff;
`;

const UpcomingWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
`;

const UpcomingBluecard = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 45%;
  min-width: 360px;
  max-width: 600px;
  height: 120px;
  gap: 10px;
`;

const UpcomingDate = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100%;
  gap: 10px;
`;

const UpcomingDateText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d3748;
`;

const UpcomingBox = styled.View<{ class: string }>`
  justify-content: center;
  align-items: center;
  height: 80%;
  width: 3px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.class === "event"
      ? "#64b5ff"
      : props.class === "network"
      ? "#9dce99"
      : props.class === "partnership"
      ? "#ffa0d3"
      : props.class === "announcement"
      ? "#fcc53a"
      : null};
`;

const UpcomingContext = styled.View`
  flex: 1;
  justify-content: center;
  height: 100%;
  gap: 10px;
`;

const TitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #010101;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  gap: 10px;
`;

const TitleWrapperText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  color: #010101;
`;

const Logo = styled.Image`
  width: 25px;
  height: 25px;
  border-radius: 6px;
`;

interface Props {
  data: BluecardWithProject[];
  path?: string;
  isUser?: boolean;
}

const monthName = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function Upcoming({ data, path, isUser }: Props) {
  const navigation = useNavigation<NavigationProp<RootNavParamList>>();
  return (
    <BluecardWrapper isUser={isUser}>
      <BluecardWrapperTitle>
        <BluecardWrapperTitleText>Upcoming Event</BluecardWrapperTitleText>
        {path ? (
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Tabs", { screen: "Calendar" })}
          >
            <SubSelect>
              <SubSelectText>VIEW ALL</SubSelectText>
            </SubSelect>
          </TouchableWithoutFeedback>
        ) : null}
      </BluecardWrapperTitle>
      <UpcomingWrapper>
        {data.map((bluecard, index) => (
          <TouchableWithoutFeedback
            onPress={() =>
              navigation?.navigate("BluecardDetail", {
                bluecardId: bluecard.id,
              })
            }
            key={index}
          >
            <UpcomingBluecard
              style={{
                borderBottomColor: "rgba(0, 0, 0, 0.2)",
                borderBottomWidth: 1,
              }}
            >
              <UpcomingDate>
                <UpcomingDateText>
                  {new Date(bluecard.deadLineStart!).getDate()}
                </UpcomingDateText>
                <UpcomingDateText>
                  {monthName[new Date(bluecard.deadLineStart!).getMonth()]}
                </UpcomingDateText>
              </UpcomingDate>
              {bluecard.bluetags.length > 0 ? (
                <UpcomingBox class={bluecard.bluetags[0].toLowerCase()} />
              ) : null}
              <UpcomingContext>
                <TitleWrapper>
                  <Logo source={{ uri: bluecard.project.logoImage }} />
                  <TitleWrapperText>{bluecard.project.title}</TitleWrapperText>
                </TitleWrapper>
                <TitleText numberOfLines={2}>{bluecard.title}</TitleText>
              </UpcomingContext>
            </UpcomingBluecard>
          </TouchableWithoutFeedback>
        ))}
      </UpcomingWrapper>
    </BluecardWrapper>
  );
}
