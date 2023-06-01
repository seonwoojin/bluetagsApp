import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  HomeStackNavParamList,
  RootNavParamList,
  TabNavParamList,
} from "../../navigation/Root";
import styled from "styled-components/native";
import Banner from "../../components/Banner";
import Dimension from "../../libs/useDimension";
import { TouchableWithoutFeedback } from "react-native";
import { Line, Path, Svg } from "react-native-svg";
import BlueTag from "../../components/Bluetag";
import { useQuery } from "react-query";
import { bluecardDetail } from "../../libs/api";
import { BluecardWithProject } from "../../libs/schema";
import { useState } from "react";
import { useUser } from "../../libs/context";
import calendarAdd from "../../libs/calendarAdd";
import useMutation from "../../libs/useMutation";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import {
  BottomTabBarProps,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";

const Container = styled.ScrollView`
  width: 100%;
  height: auto;
  padding-top: 10px;
`;

const BannerWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

const BlueCardWrapper = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 30px;
  padding: 25px 30px;
  gap: 30px;
  max-width: 1430px;
  width: ${Math.round(Dimension.width)}px;
  height: auto;
  background: rgba(55, 51, 255, 0.03);
  border: 1px solid #e7e7e7;
  border-radius: 4px;
`;

const BlueCardBackGround = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
`;

const BlueCardBackGroundImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const BlueCardDetail = styled.View`
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
  width: 100%;
  height: auto;
  background: #ffffff;
  border: 1px solid #ededed;
  border-radius: 10px;
`;

const BlueCardDetailContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 0px;
  margin-bottom: 10px;
`;

const BlueCardTitle = styled.View`
  flex-direction: row;
  width: 90%;
  height: auto;
  padding: 0px;
  margin-bottom: 10px;
`;

const BlueCardTitleText = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  color: #191f28;
`;

const BlueCardProject = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 93%;
  height: 17px;
`;

const BlueCardProjectTitle = styled.Text`
  font-style: normal;
  line-height: 17px;
  color: #191f28;
  font-weight: 700;
  font-size: 14px;
`;

const BlueCardCreatedAt = styled.Text`
  font-style: normal;
  line-height: 17px;
  color: #191f28;
  font-weight: 500;
  font-size: 13px;
`;

const BlueCardDescription = styled.View`
  width: 100%;
  height: auto;
`;

const BlueCardDescriptionText = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 25px;
  color: #191f28;
`;

const BlueCardDeadLine = styled.View`
  flex-direction: row;
  width: auto;
  height: 12px;
  opacity: 0.5;
`;

const BlueCardDeadLineText = styled.Text`
  margin-right: 5px;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: -1px;
  color: #191f28;
`;

const BlueCardTagWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
`;

const TagContainer = styled.View`
  width: auto;
  height: auto;
`;

const TagText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 32px;
  color: #333333;
  margin-bottom: 10px;
`;

const TagView = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const CalendarButton = styled.View<{ isCalendar: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 80%;
  height: 60px;
  background: #191f28;
  border-radius: 5px;
  opacity: ${(props) => (!props.isCalendar ? 0.3 : 1)};
`;

const CalendarText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

interface Response {
  data: {
    bluecard: BluecardWithProject;
  };
}

type BluecardDetailScreenProps = CompositeScreenProps<
  BottomTabScreenProps<HomeStackNavParamList, "BluecardDetail">,
  NativeStackScreenProps<RootNavParamList>
>;

const BluecardDetail = ({
  route: { params },
  navigation,
}: BluecardDetailScreenProps) => {
  const { user, setUser } = useUser();
  const { data, isLoading } = useQuery<Response>(
    `${params.bluecardId}`,
    () => bluecardDetail(params.bluecardId as string),
    { enabled: params.bluecardId ? true : false }
  );
  const mutation = useMutation(
    "https://www.bluetags.app/api/bluecards/add-calendar"
  );
  const [isCalendar, setIsCalendar] = useState(false);

  useFocusEffect(() => {
    if (user) {
      if (params.bluecardId) {
        if (user.calendar.includes(params.bluecardId)) setIsCalendar(true);
        else setIsCalendar(false);
      } else if (params.data) {
        if (user.calendar.includes(params.data.id)) setIsCalendar(true);
        else setIsCalendar(false);
      }
    }
  });

  return params.bluecardId ? (
    data ? (
      <Container>
        <BannerWrapper>
          <Banner
            text={data.data.bluecard.project.title}
            url={data.data.bluecard.project.backGround}
          />
        </BannerWrapper>
        <BlueCardWrapper>
          {data.data.bluecard.thumbnail !== "" ? (
            <BlueCardBackGround>
              <BlueCardBackGroundImage
                source={{ uri: data.data.bluecard.thumbnail }}
              />
            </BlueCardBackGround>
          ) : null}
          <BlueCardDetail>
            <BlueCardDetailContainer>
              <BlueCardTitle>
                <BlueCardTitleText>
                  {data.data.bluecard.title}
                </BlueCardTitleText>
              </BlueCardTitle>
              {data.data.bluecard.sns === "twitter" ? (
                <Svg
                  width={30}
                  height={30}
                  fill={"#1D9BF0"}
                  viewBox="0 0 512 512"
                >
                  <Path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                </Svg>
              ) : (
                <Svg
                  width={30}
                  height={30}
                  fill="#6E85D3"
                  viewBox="0 0 640 512"
                >
                  <Path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                </Svg>
              )}
            </BlueCardDetailContainer>
            <BlueCardProject>
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("ProjectDetail", {
                    ...data.data.bluecard.project,
                  })
                }
              >
                <BlueCardProjectTitle>
                  {data.data.bluecard.project.title}
                </BlueCardProjectTitle>
              </TouchableWithoutFeedback>
              <Svg width="1" height="11" viewBox="0 0 1 11" fill="none">
                <Line
                  opacity="0.5"
                  x1="0.5"
                  y1="2.18557e-08"
                  x2="0.5"
                  y2="11"
                  stroke="#191F28"
                />
              </Svg>
              <BlueCardCreatedAt>
                {`${new Date(data.data.bluecard.createdAt).getFullYear()}. ${
                  new Date(data.data.bluecard.createdAt).getMonth() + 1
                }. ${new Date(data.data.bluecard.createdAt).getDate()}`}
              </BlueCardCreatedAt>
            </BlueCardProject>
            <BlueCardDescription>
              <BlueCardDescriptionText>
                {data.data.bluecard.description}
              </BlueCardDescriptionText>
            </BlueCardDescription>
            {data.data.bluecard.deadLineStart &&
            data.data.bluecard.deadLineEnd ? (
              <BlueCardDeadLine>
                <BlueCardDeadLineText>{`${new Date(
                  data.data.bluecard.deadLineStart
                ).getFullYear()}. ${
                  new Date(data.data.bluecard.deadLineStart).getMonth() + 1
                }. ${new Date(
                  data.data.bluecard.deadLineStart
                ).getDate()} `}</BlueCardDeadLineText>
                <BlueCardDeadLineText>{`${
                  new Date(data.data.bluecard.deadLineStart).getHours() < 10
                    ? "0" +
                      new Date(data.data.bluecard.deadLineStart).getHours()
                    : new Date(data.data.bluecard.deadLineStart).getHours()
                } : ${
                  new Date(data.data.bluecard.deadLineStart).getMinutes() < 10
                    ? "0" +
                      new Date(data.data.bluecard.deadLineStart).getMinutes()
                    : new Date(data.data.bluecard.deadLineStart).getMinutes()
                }`}</BlueCardDeadLineText>
                <BlueCardDeadLineText>~</BlueCardDeadLineText>
                <BlueCardDeadLineText>{`${new Date(
                  data.data.bluecard.deadLineEnd
                ).getFullYear()}. ${
                  new Date(data.data.bluecard.deadLineEnd).getMonth() + 1
                }. ${new Date(data.data.bluecard.deadLineEnd).getDate()} 
         `}</BlueCardDeadLineText>
                <BlueCardDeadLineText>{`${
                  new Date(data.data.bluecard.deadLineEnd).getHours() < 10
                    ? "0" + new Date(data.data.bluecard.deadLineEnd).getHours()
                    : new Date(data.data.bluecard.deadLineEnd).getHours()
                } : ${
                  new Date(data.data.bluecard.deadLineEnd).getMinutes() < 10
                    ? "0" +
                      new Date(data.data.bluecard.deadLineEnd).getMinutes()
                    : new Date(data.data.bluecard.deadLineEnd).getMinutes()
                }`}</BlueCardDeadLineText>
              </BlueCardDeadLine>
            ) : null}
            <BlueCardTagWrapper>
              <TagContainer>
                <TagText>Bluetags</TagText>
                <TagView>
                  {data.data.bluecard.bluetags.map((word, index) =>
                    word.startsWith("#") ? (
                      word !== "Etc" ? (
                        <BlueTag
                          key={index}
                          color="#3733FF"
                          isWhite="false"
                          text={`${word}`}
                        />
                      ) : null
                    ) : word !== "Etc" ? (
                      <BlueTag
                        key={index}
                        color="#3733FF"
                        isWhite="false"
                        text={`#${word}`}
                      />
                    ) : null
                  )}
                </TagView>
              </TagContainer>
            </BlueCardTagWrapper>
          </BlueCardDetail>
          <TouchableWithoutFeedback
            onPress={() => {
              if (!user) {
                navigation.navigate("SignIn");
              } else {
                calendarAdd({
                  bluecardId: params.bluecardId!,
                  mutation,
                  setUser,
                  setCalendar: setIsCalendar,
                  user,
                });
              }
            }}
          >
            <CalendarButton
              isCalendar={data.data.bluecard.deadLineStart ? true : false}
            >
              <CalendarText>
                {isCalendar ? "Remove from calendar" : "Add to calendar"}
              </CalendarText>
              <Svg
                width={20}
                height={20}
                fill={"#ffffff"}
                viewBox="0 0 448 512"
              >
                <Path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
              </Svg>
            </CalendarButton>
          </TouchableWithoutFeedback>
        </BlueCardWrapper>
      </Container>
    ) : null
  ) : params.data ? (
    <Container>
      <BannerWrapper>
        <Banner
          text={params.data.project.title}
          url={params.data.project.backGround}
        />
      </BannerWrapper>
      <BlueCardWrapper>
        {params.data.thumbnail !== "" ? (
          <BlueCardBackGround>
            <BlueCardBackGroundImage source={{ uri: params.data.thumbnail }} />
          </BlueCardBackGround>
        ) : null}
        <BlueCardDetail>
          <BlueCardDetailContainer>
            <BlueCardTitle>
              <BlueCardTitleText>{params.data.title}</BlueCardTitleText>
            </BlueCardTitle>
            {params.data.sns === "twitter" ? (
              <Svg
                width={30}
                height={30}
                fill={"#1D9BF0"}
                viewBox="0 0 512 512"
              >
                <Path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
              </Svg>
            ) : (
              <Svg width={30} height={30} fill="#6E85D3" viewBox="0 0 640 512">
                <Path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
              </Svg>
            )}
          </BlueCardDetailContainer>
          <BlueCardProject>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("ProjectDetail", {
                  ...params.data!.project,
                })
              }
            >
              <BlueCardProjectTitle>
                {params.data.project.title}
              </BlueCardProjectTitle>
            </TouchableWithoutFeedback>
            <Svg width="1" height="11" viewBox="0 0 1 11" fill="none">
              <Line
                opacity="0.5"
                x1="0.5"
                y1="2.18557e-08"
                x2="0.5"
                y2="11"
                stroke="#191F28"
              />
            </Svg>
            <BlueCardCreatedAt>
              {`${new Date(params.data.createdAt).getFullYear()}. ${
                new Date(params.data.createdAt).getMonth() + 1
              }. ${new Date(params.data.createdAt).getDate()}`}
            </BlueCardCreatedAt>
          </BlueCardProject>
          <BlueCardDescription>
            <BlueCardDescriptionText>
              {params.data.description}
            </BlueCardDescriptionText>
          </BlueCardDescription>
          {params.data.deadLineStart && params.data.deadLineEnd ? (
            <BlueCardDeadLine>
              <BlueCardDeadLineText>{`${new Date(
                params.data.deadLineStart
              ).getFullYear()}. ${
                new Date(params.data.deadLineStart).getMonth() + 1
              }. ${new Date(
                params.data.deadLineStart
              ).getDate()} `}</BlueCardDeadLineText>
              <BlueCardDeadLineText>{`${
                new Date(params.data.deadLineStart).getHours() < 10
                  ? "0" + new Date(params.data.deadLineStart).getHours()
                  : new Date(params.data.deadLineStart).getHours()
              } : ${
                new Date(params.data.deadLineStart).getMinutes() < 10
                  ? "0" + new Date(params.data.deadLineStart).getMinutes()
                  : new Date(params.data.deadLineStart).getMinutes()
              }`}</BlueCardDeadLineText>
              <BlueCardDeadLineText>~</BlueCardDeadLineText>
              <BlueCardDeadLineText>{`${new Date(
                params.data.deadLineEnd
              ).getFullYear()}. ${
                new Date(params.data.deadLineEnd).getMonth() + 1
              }. ${new Date(params.data.deadLineEnd).getDate()}
             `}</BlueCardDeadLineText>
              <BlueCardDeadLineText>{`${
                new Date(params.data.deadLineEnd).getHours() < 10
                  ? "0" + new Date(params.data.deadLineEnd).getHours()
                  : new Date(params.data.deadLineEnd).getHours()
              } : ${
                new Date(params.data.deadLineEnd).getMinutes() < 10
                  ? "0" + new Date(params.data.deadLineEnd).getMinutes()
                  : new Date(params.data.deadLineEnd).getMinutes()
              }`}</BlueCardDeadLineText>
            </BlueCardDeadLine>
          ) : null}
          <BlueCardTagWrapper>
            <TagContainer>
              <TagText>Bluetags</TagText>
              <TagView>
                {params.data.bluetags.map((word, index) =>
                  word.startsWith("#") ? (
                    word !== "Etc" ? (
                      <BlueTag
                        key={index}
                        color="#3733FF"
                        isWhite="false"
                        text={`${word}`}
                      />
                    ) : null
                  ) : word !== "Etc" ? (
                    <BlueTag
                      key={index}
                      color="#3733FF"
                      isWhite="false"
                      text={`#${word}`}
                    />
                  ) : null
                )}
              </TagView>
            </TagContainer>
          </BlueCardTagWrapper>
        </BlueCardDetail>
        <TouchableWithoutFeedback
          onPress={() => {
            if (!user) {
              navigation.navigate("SignIn");
            } else {
              calendarAdd({
                bluecardId: params.data!.id,
                mutation,
                setUser,
                setCalendar: setIsCalendar,
                user,
              });
            }
          }}
        >
          <CalendarButton isCalendar={params.data.deadLineStart ? true : false}>
            <CalendarText>
              {isCalendar ? "Remove from calendar" : "Add to calendar"}
            </CalendarText>
            <Svg width={20} height={20} fill={"#ffffff"} viewBox="0 0 448 512">
              <Path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
            </Svg>
          </CalendarButton>
        </TouchableWithoutFeedback>
      </BlueCardWrapper>
    </Container>
  ) : null;
};

export default BluecardDetail;
