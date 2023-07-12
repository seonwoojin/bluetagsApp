import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import {
  BackHandler,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import BlueTag from "../Bluetag";
import { BluecardWithProject } from "../../libs/schema";
import { useEffect, useRef, useState } from "react";
import { Shadow } from "react-native-shadow-2";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootNavParamList } from "../../navigation/Root";

const AllWrapper = styled.View`
  width: ${Dimension.width}px;
  height: ${Dimension.height}px;
`;

const Overlay = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  width: ${Dimension.width}px;
  height: ${Dimension.height * 1.2}px;
  top: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ScrollViewWrapper = styled.View`
  width: ${Dimension.width * 0.9}px;
  height: auto;
`;

const Scroll = styled.ScrollView`
  width: 100%;
  height: auto;
  max-height: ${Dimension.height * 0.8}px;
  margin-bottom: ${Dimension.height * 0.2}px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid rgba(25, 31, 40, 0.2);
  background-color: #ffffff;
`;

const DetailDate = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px 20px;
  gap: 25px;
  z-index: 99;
  border-radius: 10px;
  min-width: 200px;
`;

const DetailDateTitle = styled.View`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 30px;
  padding: 0 10px;
`;

const DetailDateTitleView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const DetailDateTitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: #2d3748;
`;

const DetailDateToDos = styled.View`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  gap: 20px;
`;

const Wrapper = styled.View`
  position: relative;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding-left: 5px;
  gap: 10px;
`;

const VerticalBar = styled.View<{ height: number }>`
  position: absolute;
  width: 1px;
  height: ${(props) => (props.height > 0 ? `${props.height - 80}px` : `0px`)};
  background-color: rgba(0, 0, 0, 0.1);
  left: 35px;
  top: 80px;
  z-index: -1;
`;

const HorizontalBar = styled.View`
  position: absolute;
  width: 50px;
  height: 8px;
  border-bottom-left-radius: 50px;
  left: 15px;
  top: 22px;
  z-index: -1;
`;

const Time = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 45px;
  min-width: 30px;
  height: 20px;
  background-color: white;
`;

const TimeText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -1px;
  color: #2d3748;
`;

const DetailDateToDoWrapper = styled.View`
  width: 100%;
  height: auto;
  padding: 10px 20px;
  background: rgba(37, 124, 255, 0.02);
  border: 1px solid rgba(37, 124, 255, 0.05);
  border-radius: 15px;
`;

const Bar = styled.View<{ class: string }>`
  justify-content: center;
  align-items: center;
  height: 30px;
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

const Button = styled.View<{ detail: string }>`
  display: ${(props) => (props.detail === "true" ? "flex" : "none")};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-top: 25px;
  background-color: #191f28;
  border-radius: 4px;
`;

const ButtonText = styled.Text`
  font-size: 10px;
  color: white;
`;

const DetailDateToDoDeadline = styled.View<{ detail: string }>`
  display: ${(props) => (props.detail === "true" ? "flex" : "none")};
  flex-direction: row;
  margin-top: 25px;
  margin-bottom: 25px;
  opacity: 0.5;
`;

const DetailDateToDoDeadlineText = styled.Text`
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -1px;
  color: #191f28;
  margin-right: 3px;
`;

const DetailDateToDo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  width: 100%;
  height: auto;
`;

const DetailDateToDoLogo = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 30px;
  overflow: hidden;
`;

const DetailDateToDoLogoImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const DetailDateToDoLogoTitle = styled.View<{ detail: string }>`
  overflow: ${(props) => (props.detail === "true" ? "visible" : "hidden")};
  width: 85%;
`;

const DetailDateToDoLogoTitleText = styled.Text`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: -1px;
  color: #191f28;
`;

const DetailDescription = styled.View<{ detail: string }>`
  display: ${(props) => (props.detail === "true" ? "flex" : "none")};
  flex-direction: row;
  width: 100%;
  height: auto;
  margin-top: 20px;
`;

const DetailDescriptionText = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: -1px;
  color: #191f28;
`;

const BluetagsWrapper = styled.View<{ detail: string }>`
  display: ${(props) => (props.detail === "true" ? "flex" : "none")};
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  opacity: 1;
  margin-bottom: 0px;
`;

interface Props {
  toDos: BluecardWithProject[];
  todayDate: Date;
  setCalendarDetail: React.Dispatch<React.SetStateAction<string>>;
}

const week = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

export default function CalendarDetail({
  setCalendarDetail,
  toDos: allTodos,
  todayDate,
}: Props) {
  const navigation = useNavigation<NavigationProp<RootNavParamList>>();

  const [detail1, setDetail1] = useState("");
  const [toDos, setToDos] = useState<BluecardWithProject[]>([]);

  const handleBackPress = () => {
    setCalendarDetail("");

    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  useEffect(() => {
    setToDos(
      allTodos.filter((data) => {
        return (
          new Date(
            new Date(data.deadLineStart!).getFullYear(),
            new Date(data.deadLineStart!).getMonth(),
            new Date(data.deadLineStart!).getDate(),
            0,
            0,
            0,
            0
          ) <= todayDate && new Date(data.deadLineEnd!) >= todayDate
        );
      })
    );
  }, [todayDate]);

  return (
    <TouchableWithoutFeedback onPress={() => setCalendarDetail("")}>
      <Overlay>
        <TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => setCalendarDetail("")}>
            <ScrollViewWrapper>
              <TouchableWithoutFeedback
                onPress={(event) => event.stopPropagation()}
              >
                <Scroll showsVerticalScrollIndicator={false}>
                  <TouchableWithoutFeedback>
                    <DetailDate>
                      <DetailDateTitle>
                        <DetailDateTitleView>
                          <DetailDateTitleText>
                            {`${
                              week[todayDate.getDay()]
                            } ${todayDate.getDate()}, ${todayDate.getFullYear()}`}
                          </DetailDateTitleText>
                        </DetailDateTitleView>
                        <TouchableOpacity
                          activeOpacity={1}
                          hitSlop={{ top: 30, right: 30, bottom: 30, left: 30 }}
                          onPress={() => {
                            setCalendarDetail("");
                          }}
                        >
                          <Svg
                            width={15}
                            height={15}
                            fill={"black"}
                            viewBox="0 0 448 512"
                          >
                            <Path d="M224 222.1L407 39.03C416.4 29.66 431.6 29.66 440.1 39.03C450.3 48.4 450.3 63.6 440.1 72.97L257.9 256L440.1 439C450.3 448.4 450.3 463.6 440.1 472.1C431.6 482.3 416.4 482.3 407 472.1L224 289.9L40.97 472.1C31.6 482.3 16.4 482.3 7.029 472.1C-2.343 463.6-2.343 448.4 7.029 439L190.1 256L7.029 72.97C-2.343 63.6-2.343 48.4 7.029 39.03C16.4 29.66 31.6 29.66 40.97 39.03L224 222.1z" />
                          </Svg>
                        </TouchableOpacity>
                      </DetailDateTitle>
                      <DetailDateToDos>
                        {toDos.length > 0 ? (
                          toDos.length === 1 ? (
                            toDos.map((toDo, index) => (
                              <Wrapper key={index}>
                                <Shadow
                                  distance={1}
                                  startColor="rgba(0, 0, 0, 0.16)"
                                >
                                  <Time>
                                    <TimeText>
                                      {`${
                                        new Date(
                                          toDo.deadLineStart!
                                        ).getHours() < 10
                                          ? "0" +
                                            new Date(
                                              toDo.deadLineStart!
                                            ).getHours()
                                          : new Date(
                                              toDo.deadLineStart!
                                            ).getHours()
                                      } : ${
                                        new Date(
                                          toDo.deadLineStart!
                                        ).getMinutes() < 10
                                          ? "0" +
                                            new Date(
                                              toDo.deadLineStart!
                                            ).getMinutes()
                                          : new Date(
                                              toDo.deadLineStart!
                                            ).getMinutes()
                                      }`}
                                    </TimeText>
                                  </Time>
                                </Shadow>
                                <DetailDateToDoWrapper>
                                  <TouchableWithoutFeedback
                                    onPress={() => {
                                      if (detail1 !== toDo.id)
                                        setDetail1(toDo.id);
                                      else setDetail1("");
                                    }}
                                  >
                                    <DetailDateToDo>
                                      <TouchableWithoutFeedback
                                        onPress={() => {
                                          setCalendarDetail("");
                                          navigation.navigate("ProjectDetail", {
                                            ...toDo.project,
                                          });
                                        }}
                                      >
                                        <DetailDateToDoLogo>
                                          <DetailDateToDoLogoImage
                                            source={{
                                              uri: toDo.project.logoImage,
                                            }}
                                          />
                                        </DetailDateToDoLogo>
                                      </TouchableWithoutFeedback>
                                      <Bar
                                        class={toDo.bluetags[0].toLowerCase()}
                                      />
                                      <DetailDateToDoLogoTitle
                                        detail={
                                          detail1 === toDo.id ? "true" : "false"
                                        }
                                      >
                                        <DetailDateToDoLogoTitleText
                                          numberOfLines={2}
                                        >
                                          {toDo.title}
                                        </DetailDateToDoLogoTitleText>
                                      </DetailDateToDoLogoTitle>
                                    </DetailDateToDo>
                                  </TouchableWithoutFeedback>
                                  <DetailDescription detail={"true"}>
                                    <DetailDescriptionText>
                                      {toDo.summary}
                                    </DetailDescriptionText>
                                  </DetailDescription>
                                  <DetailDateToDoDeadline detail={"true"}>
                                    <DetailDateToDoDeadlineText>{`${new Date(
                                      toDo.deadLineStart!
                                    ).getFullYear()} . ${
                                      new Date(toDo.deadLineStart!).getMonth() +
                                      1
                                    } . ${new Date(
                                      toDo.deadLineStart!
                                    ).getDate()} `}</DetailDateToDoDeadlineText>
                                    <DetailDateToDoDeadlineText>{`${
                                      new Date(toDo.deadLineStart!).getHours() <
                                      10
                                        ? "0" +
                                          new Date(
                                            toDo.deadLineStart!
                                          ).getHours()
                                        : new Date(
                                            toDo.deadLineStart!
                                          ).getHours()
                                    } : ${
                                      new Date(
                                        toDo.deadLineStart!
                                      ).getMinutes() < 10
                                        ? "0" +
                                          new Date(
                                            toDo.deadLineStart!
                                          ).getMinutes()
                                        : new Date(
                                            toDo.deadLineStart!
                                          ).getMinutes()
                                    }`}</DetailDateToDoDeadlineText>
                                    <DetailDateToDoDeadlineText>
                                      ~
                                    </DetailDateToDoDeadlineText>
                                    <DetailDateToDoDeadlineText>
                                      {`${new Date(
                                        toDo.deadLineEnd!
                                      ).getFullYear()}. ${
                                        new Date(toDo.deadLineEnd!).getMonth() +
                                        1
                                      }. ${new Date(
                                        toDo.deadLineEnd!
                                      ).getDate()} `}
                                    </DetailDateToDoDeadlineText>
                                    <DetailDateToDoDeadlineText>{`${
                                      new Date(toDo.deadLineEnd!).getHours() <
                                      10
                                        ? "0" +
                                          new Date(toDo.deadLineEnd!).getHours()
                                        : new Date(toDo.deadLineEnd!).getHours()
                                    } : ${
                                      new Date(toDo.deadLineEnd!).getMinutes() <
                                      10
                                        ? "0" +
                                          new Date(
                                            toDo.deadLineEnd!
                                          ).getMinutes()
                                        : new Date(
                                            toDo.deadLineEnd!
                                          ).getMinutes()
                                    }`}</DetailDateToDoDeadlineText>
                                  </DetailDateToDoDeadline>
                                  <BluetagsWrapper detail={"true"}>
                                    {toDo.bluetags.map((tag, index) => (
                                      <BlueTag
                                        key={index}
                                        className="bluetag"
                                        color="#3733FF"
                                        isWhite="false"
                                        text={`#${tag}`}
                                      />
                                    ))}
                                  </BluetagsWrapper>
                                  <TouchableWithoutFeedback
                                    onPress={() => {
                                      navigation.navigate("BluecardDetail", {
                                        data: toDo,
                                      });
                                      setCalendarDetail("");
                                    }}
                                  >
                                    <Button detail={"true"}>
                                      <ButtonText>Show Detail</ButtonText>
                                    </Button>
                                  </TouchableWithoutFeedback>
                                </DetailDateToDoWrapper>
                              </Wrapper>
                            ))
                          ) : (
                            toDos
                              .sort(
                                (a, b) =>
                                  new Date(a.deadLineStart!).getTime() -
                                  new Date(b.deadLineStart!).getTime()
                              )
                              .map((toDo, index) => (
                                <Wrapper key={index}>
                                  <Shadow
                                    distance={1}
                                    startColor="rgba(0, 0, 0, 0.16)"
                                  >
                                    <Time>
                                      <TimeText>
                                        {`${
                                          new Date(
                                            toDo.deadLineStart!
                                          ).getHours() < 10
                                            ? "0" +
                                              new Date(
                                                toDo.deadLineStart!
                                              ).getHours()
                                            : new Date(
                                                toDo.deadLineStart!
                                              ).getHours()
                                        } : ${
                                          new Date(
                                            toDo.deadLineStart!
                                          ).getMinutes() < 10
                                            ? "0" +
                                              new Date(
                                                toDo.deadLineStart!
                                              ).getMinutes()
                                            : new Date(
                                                toDo.deadLineStart!
                                              ).getMinutes()
                                        }`}
                                      </TimeText>
                                    </Time>
                                  </Shadow>
                                  <DetailDateToDoWrapper>
                                    <TouchableWithoutFeedback
                                      onPress={() => {
                                        if (detail1 !== toDo.id)
                                          setDetail1(toDo.id);
                                        else setDetail1("");
                                      }}
                                    >
                                      <DetailDateToDo>
                                        <TouchableWithoutFeedback
                                          onPress={() => {
                                            setCalendarDetail("");
                                            navigation.navigate(
                                              "ProjectDetail",
                                              {
                                                ...toDo.project,
                                              }
                                            );
                                          }}
                                        >
                                          <DetailDateToDoLogo>
                                            <DetailDateToDoLogoImage
                                              source={{
                                                uri: toDo.project.logoImage,
                                              }}
                                            />
                                          </DetailDateToDoLogo>
                                        </TouchableWithoutFeedback>
                                        <Bar
                                          class={toDo.bluetags[0].toLowerCase()}
                                        />
                                        <DetailDateToDoLogoTitle
                                          detail={
                                            detail1 === toDo.id
                                              ? "true"
                                              : "false"
                                          }
                                        >
                                          <DetailDateToDoLogoTitleText
                                            numberOfLines={2}
                                          >
                                            {toDo.title}
                                          </DetailDateToDoLogoTitleText>
                                        </DetailDateToDoLogoTitle>
                                      </DetailDateToDo>
                                    </TouchableWithoutFeedback>
                                    <DetailDescription
                                      detail={
                                        detail1 === toDo.id ? "true" : "false"
                                      }
                                    >
                                      <DetailDescriptionText>
                                        {toDo.summary}
                                      </DetailDescriptionText>
                                    </DetailDescription>
                                    <DetailDateToDoDeadline
                                      detail={
                                        detail1 === toDo.id ? "true" : "false"
                                      }
                                    >
                                      <DetailDateToDoDeadlineText>{`${new Date(
                                        toDo.deadLineStart!
                                      ).getFullYear()} . ${
                                        new Date(
                                          toDo.deadLineStart!
                                        ).getMonth() + 1
                                      } . ${new Date(
                                        toDo.deadLineStart!
                                      ).getDate()} `}</DetailDateToDoDeadlineText>
                                      <DetailDateToDoDeadlineText>{`${
                                        new Date(
                                          toDo.deadLineStart!
                                        ).getHours() < 10
                                          ? "0" +
                                            new Date(
                                              toDo.deadLineStart!
                                            ).getHours()
                                          : new Date(
                                              toDo.deadLineStart!
                                            ).getHours()
                                      } : ${
                                        new Date(
                                          toDo.deadLineStart!
                                        ).getMinutes() < 10
                                          ? "0" +
                                            new Date(
                                              toDo.deadLineStart!
                                            ).getMinutes()
                                          : new Date(
                                              toDo.deadLineStart!
                                            ).getMinutes()
                                      }`}</DetailDateToDoDeadlineText>
                                      <DetailDateToDoDeadlineText>
                                        ~
                                      </DetailDateToDoDeadlineText>
                                      <DetailDateToDoDeadlineText>
                                        {`${new Date(
                                          toDo.deadLineEnd!
                                        ).getFullYear()}. ${
                                          new Date(
                                            toDo.deadLineEnd!
                                          ).getMonth() + 1
                                        }. ${new Date(
                                          toDo.deadLineEnd!
                                        ).getDate()} `}
                                      </DetailDateToDoDeadlineText>
                                      <DetailDateToDoDeadlineText>{`${
                                        new Date(toDo.deadLineEnd!).getHours() <
                                        10
                                          ? "0" +
                                            new Date(
                                              toDo.deadLineEnd!
                                            ).getHours()
                                          : new Date(
                                              toDo.deadLineEnd!
                                            ).getHours()
                                      } : ${
                                        new Date(
                                          toDo.deadLineEnd!
                                        ).getMinutes() < 10
                                          ? "0" +
                                            new Date(
                                              toDo.deadLineEnd!
                                            ).getMinutes()
                                          : new Date(
                                              toDo.deadLineEnd!
                                            ).getMinutes()
                                      }`}</DetailDateToDoDeadlineText>
                                    </DetailDateToDoDeadline>
                                    <BluetagsWrapper
                                      detail={
                                        detail1 === toDo.id ? "true" : "false"
                                      }
                                    >
                                      {detail1 === toDo.id
                                        ? toDo.bluetags.map((tag, index) => (
                                            <BlueTag
                                              key={index}
                                              className="bluetag"
                                              color="#3733FF"
                                              isWhite="false"
                                              text={`#${tag}`}
                                            />
                                          ))
                                        : null}
                                    </BluetagsWrapper>
                                    <TouchableWithoutFeedback
                                      onPress={() => {
                                        navigation.navigate("BluecardDetail", {
                                          data: toDo,
                                        });
                                        setCalendarDetail("");
                                      }}
                                    >
                                      <Button
                                        detail={
                                          detail1 === toDo.id ? "true" : "false"
                                        }
                                      >
                                        <ButtonText>Show Detail</ButtonText>
                                      </Button>
                                    </TouchableWithoutFeedback>
                                  </DetailDateToDoWrapper>
                                </Wrapper>
                              ))
                          )
                        ) : (
                          <DetailDateToDo>
                            <View>
                              <Text>없음</Text>
                            </View>
                          </DetailDateToDo>
                        )}
                      </DetailDateToDos>
                    </DetailDate>
                  </TouchableWithoutFeedback>
                </Scroll>
              </TouchableWithoutFeedback>
            </ScrollViewWrapper>
          </TouchableWithoutFeedback>
        </TouchableWithoutFeedback>
      </Overlay>
    </TouchableWithoutFeedback>
  );
}
