import styled from "styled-components/native";
import { BluecardWithProject, User } from "../../libs/schema";
import { Shadow } from "react-native-shadow-2";
import { TouchableWithoutFeedback } from "react-native";
import { Path, Svg } from "react-native-svg";
import BlueTag from "../Bluetag";
import useMutation from "../../libs/useMutation";
import { useEffect, useState } from "react";
import moment from "moment";
import useInterval from "../../libs/useInterval";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootNavParamList } from "../../navigation/Root";
import axios from "axios";
import { useUser } from "../../libs/context";

const BlueCardContainer = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  width: 335px;
  height: 315px;
  padding: 6px;
  border-radius: 15px;
  overflow: hidden;
  background: #ffffff;
`;

const BlueCardBackGround = styled.View`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 98%;
  height: 140px;
  margin-bottom: 20px;
  overflow: hidden;
  border-radius: 12px;
`;

const BlueCardBackGroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const TitleContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  padding: 0px 8px;
`;

const Title = styled.Text`
  font-weight: 600;
  font-size: 16px;
  color: #010101;
  overflow: hidden;
`;

const InfoWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 8px;
`;

const ProjectLogo = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 12px;
  overflow: hidden;
`;

const ProjectLogoImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const InfoContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: auto;
  height: 100%;
  gap: 10px;
`;

const PostDate = styled.View`
  display: flex;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background: rgba(19, 12, 26, 0.15);
  border-radius: 21px;
`;

const PostBlueTags = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  height: auto;
  opacity: 1;
  padding: 0px 8px;
`;

const PostContext = styled.View`
  display: flex;
  width: 100%;
  height: auto;
  max-height: 110px;
  margin-bottom: 15px;
  padding: 0px 8px;
  overflow: hidden;
`;

const PostContextText = styled.Text`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: #93989a;
`;

interface Props {
  data: BluecardWithProject;
}

const BlueCardMedium = ({ data }: Props) => {
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
        <BlueCardContainer>
          <BlueCardBackGround>
            <BlueCardBackGroundImage
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
                <ProjectLogo>
                  <ProjectLogoImage source={{ uri: data.project.logoImage }} />
                </ProjectLogo>
              </TouchableWithoutFeedback>
              <InfoContainer>
                {leftTime ? (
                  // <PostDate>2h 4m 32s</PostDate>
                  <PostDate>
                    <PostDateText>{`${
                      Math.floor(leftTime.asHours()) >= 0
                        ? Math.floor(leftTime.asHours())
                        : 0
                    }h ${
                      Math.floor(leftTime.asMinutes() % 60) >= 0
                        ? Math.floor(leftTime.asMinutes() % 60)
                        : 0
                    }m ${
                      Math.floor(leftTime.asSeconds() % 60) >= 0
                        ? Math.floor(leftTime.asSeconds() % 60)
                        : 0
                    }s`}</PostDateText>
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
          </BlueCardBackGround>
          <TitleContainer>
            <Title numberOfLines={2}>{data.title}</Title>
          </TitleContainer>
          <PostContext>
            <PostContextText numberOfLines={3}>
              {data.summary.replace(/<[^>]*>?/g, "")}
            </PostContextText>
          </PostContext>
          <PostBlueTags>
            {data.bluetags.map((tag, index) =>
              tag !== "Etc" ? (
                <BlueTag
                  key={index}
                  color="#3733FF"
                  isWhite="false"
                  text={`${tag}`}
                />
              ) : null
            )}
          </PostBlueTags>
        </BlueCardContainer>
      </TouchableWithoutFeedback>
    </Shadow>
  );
};

export default BlueCardMedium;
