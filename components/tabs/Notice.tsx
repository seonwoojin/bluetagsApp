import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import Constants from "expo-constants";
import {
  Animated,
  BackHandler,
  Easing,
  FlatList,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useUser } from "../../libs/context";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { notifications } from "../../libs/api";
import { Notification } from "../../libs/schema";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HomeStackNavParamList, RootNavParamList } from "../../navigation/Root";

const UserTextDetail = styled.View`
  position: absolute;
  top: ${Constants.statusBarHeight}px;
  width: ${Dimension.width}px;
  height: ${Dimension.height}px;
  padding-top: 20px;
  overflow: hidden;
  background-color: #ffffff;
  z-index: 60;
`;

const NotificationContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding-top: 10px;
`;

const Exit = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0px 20px 0px 30px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 500;
`;

const SelectWrapper = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 15px 10px;
`;

const Select = styled.View<{ isIndex: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 50px;
  padding: 10px 20px;
`;

const SelectText = styled.Text<{ isIndex: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.isIndex ? "#0075ff" : "rgba(0, 0, 0, 0.8)")};
`;

const SelectUnderBar = styled.View`
  position: absolute;
  width: 150%;
  height: 2px;
  bottom: -15px;
  border-radius: 1px;
  background-color: #0075ff;
`;

const NotificationWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  min-height: 60px;
  height: auto;
  padding: 20px 0px 20px 10px;
`;

const NotificationLogo = styled.View`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

const NotificationLogoImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const NotificationNew = styled.View`
  position: absolute;
  width: 5px;
  height: 5px;
  left: 0px;
  top: -3px;
  border-radius: 2.5px;
  background-color: #3733ff;
`;

const NotificationTextWrapper = styled.View`
  justify-content: center;
  width: 90%;
  height: auto;
`;

const NotificationTitleWrapper = styled.View`
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;
`;

const NotificationTitle = styled.View`
  width: 95%;
  height: auto;
  padding-left: 10px;
`;

const NotificationProjectTitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
`;

const NotificationProjectTitle = styled.Text`
  font-weight: 600;
  color: black;
  line-height: 18px;
  font-size: 14px;
  margin-right: 5px;
`;

const NotificationTitleText = styled.Text`
  line-height: 18px;
  color: #191f28;
  font-size: 14px;
  font-weight: 400;
`;

const NotificationPostTitle = styled.View`
  width: 100%;
  height: auto;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: rgba(0, 0, 0, 0.05);
`;

const NotificationPostTitleText = styled.Text`
  line-height: 18px;
  color: #191f28;
  font-size: 14px;
  font-weight: 400;
`;

const NotificationDate = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 20px;
  opacity: 0.8;
`;

const NotificationDateText = styled.Text`
  color: #191f28;
  font-size: 12px;
  font-weight: 400;
`;

const AnimatedUserTextDetail = Animated.createAnimatedComponent(UserTextDetail);

interface Props {
  notice: boolean;
  setNotice: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Response {
  data: {
    notifications: Notification[];
  };
}

export default function Notice({ notice, setNotice }: Props) {
  const { user } = useUser();
  const navigation = useNavigation<NavigationProp<RootNavParamList>>();
  const { data, isLoading, refetch } = useQuery<Response>(
    ["notifications", "notices"],
    notifications
  );
  const [index, setIndex] = useState(0);
  const [notices, setNotices] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const X = useRef(new Animated.Value(Dimension.width)).current;

  const opacity = X.interpolate({
    inputRange: [0, Dimension.width],
    outputRange: [1, 0],
  });

  const moveLeft = () => {
    Animated.timing(X, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  const moveRight = () => {
    Animated.timing(X, {
      toValue: Dimension.width,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleBackPress = () => {
    moveRight();
    setTimeout(() => setNotice((prev) => !prev), 300);

    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  useEffect(() => {
    if (data && data.data.notifications.length > 0) {
      switch (index) {
        case 0:
          setNotices(
            data.data.notifications.filter(
              (notice) =>
                (notice.role === "CREATE" || notice.role === "UPDATE") &&
                user?.subscribe.includes(notice.projectKey)
            )
          );
          break;
        case 1:
          setNotices(
            data.data.notifications.filter(
              (notice) =>
                (notice.role === "DAY" || notice.role === "HOUR") &&
                user?.calendar.includes(notice.blueCardId)
            )
          );
          break;
        case 2:
          setNotices(data.data.notifications);
      }
    }
  }, [index, data]);

  useEffect(() => {
    moveLeft();
  }, []);

  return (
    <AnimatedUserTextDetail style={{ transform: [{ translateX: X }], opacity }}>
      <FlatList
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <NotificationContainer>
            <Exit>
              <Title>Notification</Title>
              <TouchableWithoutFeedback
                onPress={() => {
                  moveRight();
                  setTimeout(() => setNotice((prev) => !prev), 300);
                }}
              >
                <Svg
                  fill={"black"}
                  width={25}
                  height={25}
                  viewBox="0 0 384 512"
                >
                  <Path d="M378.4 440.6c8.531 10.16 7.203 25.28-2.938 33.81C370.9 478.2 365.5 480 360 480c-6.844 0-13.64-2.906-18.39-8.562L192 293.3l-149.6 178.1C37.63 477.1 30.83 480 23.98 480c-5.453 0-10.92-1.844-15.42-5.625c-10.14-8.531-11.47-23.66-2.938-33.81L160.7 256L5.625 71.44C-2.906 61.28-1.578 46.16 8.563 37.63C18.69 29.08 33.84 30.39 42.38 40.56L192 218.7l149.6-178.1c8.547-10.17 23.67-11.47 33.81-2.938s11.47 23.66 2.938 33.81L223.3 256L378.4 440.6z" />
                </Svg>
              </TouchableWithoutFeedback>
            </Exit>
            <SelectWrapper
              style={{
                borderBottomWidth: 2,
                borderBottomColor: "rgba(0, 0, 0, 0.1)",
              }}
            >
              <TouchableWithoutFeedback onPress={() => setIndex(0)}>
                <Select isIndex={index === 0}>
                  <SelectText isIndex={index === 0}>Subscribed</SelectText>
                  {index === 0 ? <SelectUnderBar /> : null}
                </Select>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => setIndex(1)}>
                <Select isIndex={index === 1}>
                  <SelectText isIndex={index === 1}>Calendar</SelectText>
                  {index === 1 ? <SelectUnderBar /> : null}
                </Select>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => setIndex(2)}>
                <Select isIndex={index === 2}>
                  <SelectText isIndex={index === 2}>All</SelectText>
                  {index === 2 ? <SelectUnderBar /> : null}
                </Select>
              </TouchableWithoutFeedback>
            </SelectWrapper>
          </NotificationContainer>
        }
        data={notices}
        renderItem={({ item }) => (
          <TouchableHighlight
            underlayColor={"rgba(0, 0, 0, 0.2)"}
            onPress={() => {
              navigation.navigate("BluecardDetail", {
                bluecardId: item.blueCardId,
              });
              setNotice(false);
            }}
          >
            <NotificationWrapper
              style={{
                borderBottomWidth: 2,
                borderBottomColor: "rgba(0, 0, 0, 0.07)",
              }}
            >
              <NotificationLogo>
                <NotificationLogoImage source={{ uri: item.projectLogo! }} />
                {user?.readBlueCard.includes(item.blueCardId) ? null : (
                  <NotificationNew />
                )}
              </NotificationLogo>
              <NotificationTextWrapper>
                <NotificationTitleWrapper>
                  <NotificationTitle>
                    <>
                      {item.role === "CREATE" ? (
                        <NotificationProjectTitleWrapper>
                          <NotificationProjectTitle>
                            {item.projectTitle}
                          </NotificationProjectTitle>
                          <NotificationTitleText>
                            에서 게시글을 업로드했습니다.
                          </NotificationTitleText>
                        </NotificationProjectTitleWrapper>
                      ) : item.role === "DAY" ? (
                        <NotificationProjectTitleWrapper>
                          <NotificationProjectTitle>
                            {item.projectTitle}
                          </NotificationProjectTitle>
                          <NotificationTitleText>
                            에서 이벤트 하루 전 입니다.
                          </NotificationTitleText>
                        </NotificationProjectTitleWrapper>
                      ) : item.role === "HOUR" ? (
                        <NotificationProjectTitleWrapper>
                          <NotificationProjectTitle>
                            {item.projectTitle}
                          </NotificationProjectTitle>
                          <NotificationTitleText>
                            에서 이벤트 한 시간 전 입니다.
                          </NotificationTitleText>
                        </NotificationProjectTitleWrapper>
                      ) : item.role === "UPDATE" ? (
                        <NotificationProjectTitleWrapper>
                          <NotificationProjectTitle>
                            {item.projectTitle}
                          </NotificationProjectTitle>
                          <NotificationTitleText>
                            에서 게시글을 업데이트했습니다.
                          </NotificationTitleText>
                        </NotificationProjectTitleWrapper>
                      ) : null}
                    </>
                    <NotificationDate>
                      <NotificationDateText>
                        {(new Date().getTime() -
                          new Date(item.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24) <
                        1
                          ? Math.floor(
                              (new Date().getTime() -
                                new Date(item.createdAt).getTime()) /
                                (1000 * 60 * 60)
                            ) <= 1
                            ? `${Math.floor(
                                (new Date().getTime() -
                                  new Date(item.createdAt).getTime()) /
                                  (1000 * 60 * 60)
                              )} hour ago`
                            : `${Math.floor(
                                (new Date().getTime() -
                                  new Date(item.createdAt).getTime()) /
                                  (1000 * 60 * 60)
                              )} hours ago`
                          : Math.floor(
                              (new Date().getTime() -
                                new Date(item.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) === 1
                          ? `${Math.floor(
                              (new Date().getTime() -
                                new Date(item.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )} day ago`
                          : `${Math.floor(
                              (new Date().getTime() -
                                new Date(item.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )} days ago`}
                      </NotificationDateText>
                    </NotificationDate>
                    <NotificationPostTitle>
                      <NotificationPostTitleText>
                        {item.title}
                      </NotificationPostTitleText>
                    </NotificationPostTitle>
                  </NotificationTitle>
                </NotificationTitleWrapper>
              </NotificationTextWrapper>
            </NotificationWrapper>
          </TouchableHighlight>
        )}
      />
    </AnimatedUserTextDetail>
  );
}
