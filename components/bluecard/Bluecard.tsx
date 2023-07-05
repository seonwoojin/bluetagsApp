import styled from "styled-components/native";
import { BluecardWithProject } from "../../libs/schema";
import { useEffect, useState } from "react";
import { useUser } from "../../libs/context";
import useMutation from "../../libs/useMutation";
import moment from "moment";
import useInterval from "../../libs/useInterval";
import { Shadow } from "react-native-shadow-2";
import { TouchableWithoutFeedback } from "react-native";
import BlueTag from "../Bluetag";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootNavParamList } from "../../navigation/Root";
import { Path, Svg } from "react-native-svg";
import Dimension from "../../libs/useDimension";

const BluecardContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: ${Dimension.width * 0.95}px;
  max-width: 600px;
  height: 168px;
  padding: 10px;
  border-radius: 15px;
  background-color: #ffffff;
`;

const Logo = styled.View`
  position: relative;
  height: 100%;
  width: 30%;
  min-width: 190px;
  border-radius: 15px;
`;

const LogoImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 15px;
`;

const InfoWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 8px;
`;

const ProjectLogo = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 12px;
`;

const InfoContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  width: auto;
  height: 100%;
  gap: 10px;
`;

const PostDate = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: auto;
  height: 30px;
  padding: 6px 10px;
  background: rgba(19, 12, 26, 0.15);
  border-radius: 21px;
`;

const PostDateText = styled.Text`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
`;

const LikeWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: rgba(19, 12, 26, 0.15);
  border-radius: 21px;
`;

const Context = styled.View`
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 5px 10px;
  flex: 1;
`;

const Title = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
`;

const TitleText = styled.Text`
  font-weight: 600;
  font-size: 18px;
  color: #010101;
`;

const Summary = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
`;

const SummaryText = styled.Text`
  font-weight: 500;
  font-size: 12px;
  color: #93989a;
`;

const BluetagWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 20%;
  overflow: hidden;
`;

interface Props {
  data: BluecardWithProject;
}

export default function Bluecard({ data }: Props) {
  const { user, setUser } = useUser();
  const [save] = useMutation(
    `https://www.bluetags.app/api/bluecards/user-save`
  );
  const navigation = useNavigation<NavigationProp<RootNavParamList>>();
  const [isSave, setIsSave] = useState(
    user ? user.save_bluecards.includes(data.id) : false
  );
  const [leftTime, setLeftTime] = useState<moment.Duration | null>(null);
  const [type, setType] = useState<"NONE" | "BEFORE" | "AFTER" | "PROGRESS">(
    "NONE"
  );

  useEffect(() => {
    if (!data.deadLineStart || !data.deadLineEnd) return;
    if (new Date() <= new Date(data.deadLineStart)) {
      setType("BEFORE");
      setLeftTime(
        moment.duration(
          moment(new Date(data.deadLineStart!)).diff(moment(new Date()))
        )
      );
    } else if (
      new Date() >= new Date(data.deadLineStart) &&
      new Date() <= new Date(data.deadLineEnd)
    ) {
      setType("PROGRESS");
      setLeftTime(
        moment.duration(
          moment(new Date(data.deadLineEnd!)).diff(moment(new Date()))
        )
      );
    } else {
      setType("AFTER");
      setLeftTime(moment.duration(moment(new Date()).diff(moment(new Date()))));
    }
  }, []);

  useInterval(() => {
    if (!data.deadLineStart || !data.deadLineEnd) return;
    if (new Date() <= new Date(data.deadLineStart)) {
      setType("BEFORE");
      setLeftTime(
        moment.duration(
          moment(new Date(data.deadLineStart!)).diff(moment(new Date()))
        )
      );
    } else if (
      new Date() >= new Date(data.deadLineStart) &&
      new Date() <= new Date(data.deadLineEnd)
    ) {
      setType("PROGRESS");
      setLeftTime(
        moment.duration(
          moment(new Date(data.deadLineEnd!)).diff(moment(new Date()))
        )
      );
    } else {
      setType("AFTER");
      setLeftTime(moment.duration(moment(new Date()).diff(moment(new Date()))));
    }
  }, 1000);

  return (
    <Shadow
      startColor="rgba(0, 0, 0, 0.08)"
      distance={7}
      offset={[0, 3]}
      style={{ borderRadius: 15 }}
    >
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("BluecardDetail", { data: { ...data } })
        }
      >
        <BluecardContainer>
          <Logo>
            <LogoImage
              source={{
                uri:
                  data.thumbnail === ""
                    ? data.project.backgroundImage
                    : data.thumbnail,
              }}
            />
            <InfoWrapper>
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("ProjectDetail", { ...data.project })
                }
              >
                <ProjectLogo source={{ uri: data.project.logoImage }} />
              </TouchableWithoutFeedback>
              <InfoContainer>
                {leftTime ? (
                  // <PostDate>2h 4m 32s</PostDate>
                  <PostDate>
                    <PostDateText>
                      {`${Math.floor(leftTime.asHours())}h ${Math.floor(
                        leftTime.asMinutes() % 60
                      )}m ${Math.floor(leftTime.asSeconds() % 60)}s`}
                    </PostDateText>
                  </PostDate>
                ) : null}
                <TouchableWithoutFeedback
                  onPress={async () => {
                    if (!user) {
                      navigation.navigate("SignIn");
                    } else {
                      save({ id: data.id, userId: user.id });
                      if (user?.save_bluecards.includes(data.id)) {
                        const array: string[] = [];
                        user?.save_bluecards.map((id) => {
                          if (id !== data.id) {
                            array.push(id);
                          }
                        });
                        setUser({ ...user, save_bluecards: array });
                      } else {
                        setUser({
                          ...user,
                          save_bluecards: [...user.save_bluecards, data.id],
                        });
                      }
                      setIsSave((prev) => !prev);
                    }
                  }}
                >
                  <LikeWrapper>
                    {isSave ? (
                      <Svg
                        width="14"
                        height="18"
                        viewBox="0 0 14 18"
                        fill="none"
                      >
                        <Path
                          d="M0 18V1.6875C0 0.755508 0.753883 0 1.68387 0H11.7871C12.7171 0 13.471 0.755508 13.471 1.6875V18L6.73548 14.0625L0 18Z"
                          fill="#257CFF"
                        />
                        <Path
                          d="M11.7871 0H1.68387C0.753883 0 0 0.755508 0 1.6875V18L6.73548 14.0625L13.471 18V1.6875C13.471 0.755508 12.7171 0 11.7871 0ZM11.7871 15.062L6.73548 12.1089L1.68387 15.062V1.89844C1.68387 1.84249 1.70605 1.78884 1.74552 1.74928C1.78499 1.70972 1.83853 1.6875 1.89435 1.6875H11.5766C11.6929 1.6875 11.7871 1.78182 11.7871 1.8983V15.062Z"
                          fill="white"
                        />
                      </Svg>
                    ) : (
                      <Svg
                        width="14"
                        height="18"
                        viewBox="0 0 14 18"
                        fill="none"
                      >
                        <Path
                          d="M11.7871 0H1.68387C0.753883 0 0 0.755508 0 1.6875V18L6.73548 14.0625L13.471 18V1.6875C13.471 0.755508 12.7171 0 11.7871 0ZM11.7871 15.062L6.73548 12.1089L1.68387 15.062V1.89844C1.68387 1.84249 1.70605 1.78884 1.74552 1.74928C1.78499 1.70972 1.83853 1.6875 1.89435 1.6875H11.5766C11.6929 1.6875 11.7871 1.78182 11.7871 1.8983V15.062Z"
                          fill="white"
                        />
                      </Svg>
                    )}
                  </LikeWrapper>
                </TouchableWithoutFeedback>
              </InfoContainer>
            </InfoWrapper>
          </Logo>
          <Context>
            <Title>
              <TitleText numberOfLines={2}>{data.title}</TitleText>
            </Title>
            <Summary>
              <SummaryText numberOfLines={3}>{data.summary}</SummaryText>
            </Summary>
            <BluetagWrapper>
              {data.bluetags.map((word, index) => (
                <BlueTag
                  key={index}
                  color="#3733FF"
                  isWhite="false"
                  text={`${word}`}
                />
              ))}
            </BluetagWrapper>
          </Context>
        </BluecardContainer>
      </TouchableWithoutFeedback>
    </Shadow>
  );
}
