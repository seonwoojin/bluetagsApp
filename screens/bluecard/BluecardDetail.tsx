import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  HomeStackNavParamList,
  RootNavParamList,
  TabNavParamList,
} from "../../navigation/Root";
import styled from "styled-components/native";
import Banner from "../../components/Banner";
import Dimension from "../../libs/useDimension";
import {
  RefreshControl,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Line, Path, Svg } from "react-native-svg";
import BlueTag from "../../components/Bluetag";
import { useQuery } from "react-query";
import {
  bluecardComments,
  bluecardDetail,
  homeBluecards,
} from "../../libs/api";
import {
  BluecardWithProject,
  Comment,
  CommentWithUser,
} from "../../libs/schema";
import { useEffect, useState } from "react";
import { useUser } from "../../libs/context";
import calendarAdd from "../../libs/calendarAdd";
import useMutation from "../../libs/useMutation";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import {
  BottomTabBarProps,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import Spinner from "../../components/Spinner";
import axios from "axios";
import CommentUser from "../../components/bluecard/CommentUser";
import MostReadNews from "../../components/MostReadNews";
import BluecardSlider from "../../components/slider/BluecardSlider";

const Container = styled.ScrollView`
  width: 100%;
  height: auto;
`;

const Wrapper = styled.View`
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: auto;
`;

const LeftSide = styled.View`
  width: 100%;
  height: auto;
`;

const BluecardWrapper = styled.View`
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: ${Dimension.width * 1}px;
  height: auto;
  background: #ffffff;
`;

const BlueCardBackGround = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 150px;
  height: auto;
  border-radius: 10px;
  overflow: hidden;
`;

const BlueCardBackGroundImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const BlueCardDetail = styled.View`
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  height: auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
`;

const BlueCardWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

const BlueCardTitle = styled.View`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

const BlueCardTitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #212434;
`;

const BlueCardSummary = styled.View`
  width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

const BlueCardSummaryText = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #aaaaaa;
`;

const BlueCardProject = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 100%;
  height: 17px;
`;

const ProjectTitleText = styled.Text`
  font-style: normal;
  line-height: 17px;
  color: #191f28;
  font-size: 13px;
  font-weight: 500;
`;

const DateText = styled.Text`
  font-style: normal;
  line-height: 17px;
  color: #191f28;
  font-size: 14px;
  font-weight: 700;
`;

const ProjectLogo = styled.View`
  width: 25px;
  height: 25px;
  border-radius: 6px;
  margin-right: 5px;
  overflow: hidden;
`;

const ProjectLogoImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const BlueCardDescription = styled.View`
  flex-direction: row;
  width: 100%;
  height: auto;
`;

const BlueCardDescriptionText = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 30px;
  color: #191f28;
`;

const BlueCardDeadLine = styled.View`
  flex-direction: row;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

const BlueCardDeadLineText = styled.Text`
  margin-right: 5px;

  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  letter-spacing: -1px;
  color: #aaaaaa;
`;

const BlueCardTagWrapper = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: auto;
`;

const TagContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  padding: 10px;
`;

const CalendarButton = styled.View<{ isCalendar: boolean }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 80%;
  height: 60px;
  margin-top: 30px;
  background: #191f28;
  border-radius: 5px;
  opacity: ${(props) => (!props.isCalendar ? 0.3 : 1)};
`;

const CalendarButtonSpan = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

const Optionwrapper = styled.View`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  margin-top: 30px;
`;

const CommentWrapper = styled.View`
  align-items: center;
  padding: 40px 20px;
  width: ${Dimension.width}px;
  height: auto;
  background: #ffffff;
  /* textarea {
    width: 100%;
    height: 100px;
    min-height: 100px;
    margin-bottom: 20px;
    padding: 10px 20px;
    border: 1px solid #e2e8f0;
    border-radius: 15px;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 130%;
    color: #212434;
  } */
`;

const CommentTitle = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 15px;
`;

const CommentTitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: #333333;
`;
const CommentTextInputScroll = styled.ScrollView`
  width: 100%;
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  margin-bottom: 20px;
`;

const CommentTextInput = styled.TextInput`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  color: #212434;
`;

const Button = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 100%;
  height: 60px;
  margin-bottom: 40px;
  background: #191f28;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #ffffff;
`;

const RecommendedTitle = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0px 30px;
`;

const RecommendedTitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #010101;
`;

// const RecommendedWrapper = styled.View`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: 99%;
//   height: 420px;
//   margin-bottom: 100px;
//   background: #ffffff;
//   border-radius: 15px;
//   box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
//   @media ${breakingPoint.device.desktop} {
//     width: 99%;
//   }
//   @media ${breakingPoint.device.mobile} {
//     height: 490px;
//     width: 100vw;
//     border-radius: 0px;
//     box-shadow: none;
//     margin-bottom: 0px;
//     padding-bottom: 50px;
//   }
// `;

// const RecommendedTitle = styled.View`
//   display: flex;
//   align-items: center;
//   width: 100%;
//   height: auto;
//   padding: 30px;
//   font-style: normal;
//   font-weight: 700;
//   font-size: 18px;
//   line-height: 140%;
//   color: #2d3748;
//   @media ${breakingPoint.device.desktop} {
//     width: 100%;
//   }
// `;

// const RecommendedContainer = styled.View`
//   display: flex;
//   justify-content: space-evenly;
//   align-items: center;
//   flex-wrap: wrap;
//   width: 100%;
//   height: 320px;
//   overflow: hidden;
//   gap: 15px;
// `;

// const MostReadWrapper = styled.View<{
//   top: number;
//   end?: number;
//   height?: number;
// }>`
//   position: ${(props) =>
//     props.top >= 90
//       ? props.end && props.top <= props.end - 650
//         ? "fixed"
//         : "absolute"
//       : "realative"};
//   top: ${(props) =>
//     props.end && props.height && props.top >= props.end - 650
//       ? `${props.end - props.height - 30}px`
//       : "10px"};
//   right: 0px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: auto;
//   height: auto;
//   @media ${breakingPoint.device.desktop} {
//     position: relative;
//     top: 0px;
//     right: 0px;
//   }
// `;

interface ResponseRecommended {
  data: {
    latest: BluecardWithProject[];
    mostRead: BluecardWithProject[];
  };
}

interface Response {
  data: {
    bluecard: BluecardWithProject;
  };
}

interface ResponseComment {
  data: {
    comments: CommentWithUser[];
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
  const {
    data: bluecards,
    isLoading: bluecardsIsLoading,
    refetch: recommendedBluecardsRefetch,
  } = useQuery<ResponseRecommended>("recommended", homeBluecards);
  const {
    data,
    isLoading,
    refetch: bluecardsRefetch,
  } = useQuery<Response>(
    `${params.bluecardId}`,
    () => bluecardDetail(params.bluecardId as string),
    { enabled: params.bluecardId ? true : false }
  );
  const mutation = useMutation(
    "https://www.bluetags.app/api/bluecards/add-calendar"
  );
  const [isCalendar, setIsCalendar] = useState(false);
  const [bluecard, setBluecard] = useState<BluecardWithProject>();
  const [commentDetail, setCommentDetail] = useState("");
  const [commentEdit, setCommentEdit] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentEditText, setCommentEditText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: comments,
    isLoading: commentsisLoading,
    refetch,
  } = useQuery<ResponseComment>(
    `${bluecard?.id}comments`,
    () => {
      return bluecardComments(bluecard?.id as string);
    },
    { enabled: bluecard ? true : false }
  );

  const onValid = async () => {
    if (!user) {
      navigation.navigate("SignIn");
    }
    if (commentText.replaceAll(" ", "") === "" || !bluecard || !user) {
      return;
    }
    await axios
      .post("https://www.bluetags.app/api/comments", {
        bluecardId: bluecard.id,
        userId: user.id,
        text: commentText,
      })
      .then(() => {
        setCommentText("");
        refetch();
      })
      .catch((error) => {});
  };

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

  useEffect(() => {
    if (params.bluecardId && data) {
      setBluecard(data.data.bluecard);
    } else if (params.data) {
      setBluecard(params.data);
    }
  }, [data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await recommendedBluecardsRefetch();
    await refetch();
    setRefreshing(false);
  };

  const loading = commentsisLoading || bluecardsIsLoading || !bluecard;

  return !loading ? (
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (commentDetail) setCommentDetail("");
        }}
      >
        <Wrapper>
          <LeftSide>
            <BluecardWrapper>
              <TagContainer>
                {bluecard.bluetags.map((word, index) => (
                  <View key={index}>
                    <BlueTag
                      color="#3733FF"
                      isWhite="false"
                      text={`#${word}`}
                    />
                  </View>
                ))}
              </TagContainer>
              <BlueCardDetail>
                <BlueCardWrapper>
                  <BlueCardTitle>
                    <BlueCardTitleText>{bluecard.title}</BlueCardTitleText>
                  </BlueCardTitle>
                </BlueCardWrapper>
                <BlueCardSummary>
                  <BlueCardSummaryText>{bluecard.summary}</BlueCardSummaryText>
                </BlueCardSummary>
                <BlueCardProject>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate("ProjectDetail", {
                        ...bluecard!.project,
                      })
                    }
                  >
                    <ProjectLogo>
                      <ProjectLogoImage
                        source={{ uri: bluecard.project.logoImage }}
                      />
                    </ProjectLogo>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate("ProjectDetail", {
                        ...bluecard!.project,
                      })
                    }
                  >
                    <ProjectTitleText>
                      {bluecard.project.title}
                    </ProjectTitleText>
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
                  <DateText>
                    {`${new Date(bluecard.createdAt).getFullYear()}. ${
                      new Date(bluecard.createdAt).getMonth() + 1
                    }. ${new Date(bluecard.createdAt).getDate()}`}
                  </DateText>
                  {bluecard.sns === "twitter" ? (
                    <Svg
                      width={20}
                      height={20}
                      fill={"#1D9BF0"}
                      viewBox="0 0 512 512"
                    >
                      <Path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                    </Svg>
                  ) : (
                    <Svg
                      width={20}
                      height={20}
                      fill="#6E85D3"
                      viewBox="0 0 640 512"
                    >
                      <Path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                    </Svg>
                  )}
                </BlueCardProject>
                {bluecard.thumbnail !== "" ? (
                  <BlueCardBackGround>
                    <BlueCardBackGroundImage
                      source={{ uri: bluecard.thumbnail }}
                    />
                  </BlueCardBackGround>
                ) : null}
                <BlueCardDescription>
                  <BlueCardDescriptionText>
                    {bluecard.description}
                  </BlueCardDescriptionText>
                </BlueCardDescription>
                {/* <BlueCardTagWrapper>
              <Optionwrapper>
                <KakaoShare
                  title={bluecard.title}
                  description={bluecard.description}
                  url={`https://www.bluetags.app/bluecard/${
                    bluecard.id
                  }`}
                />
                <Like
                  type="bluecards"
                  id={bluecard.id}
                  likeNum={bluecard.like}
                  unlikeNum={bluecard.unlike}
                />
              </Optionwrapper>
            </BlueCardTagWrapper> */}
                {bluecard.deadLineStart && bluecard.deadLineEnd ? (
                  <BlueCardDeadLine>
                    <BlueCardDeadLineText>{`${new Date(
                      bluecard.deadLineStart
                    ).getFullYear()}. ${
                      new Date(bluecard.deadLineStart).getMonth() + 1
                    }. ${new Date(
                      bluecard.deadLineStart
                    ).getDate()} `}</BlueCardDeadLineText>
                    <BlueCardDeadLineText>{`${
                      new Date(bluecard.deadLineStart).getHours() < 10
                        ? "0" + new Date(bluecard.deadLineStart).getHours()
                        : new Date(bluecard.deadLineStart).getHours()
                    } : ${
                      new Date(bluecard.deadLineStart).getMinutes() < 10
                        ? "0" + new Date(bluecard.deadLineStart).getMinutes()
                        : new Date(bluecard.deadLineStart).getMinutes()
                    }`}</BlueCardDeadLineText>
                    <BlueCardDeadLineText>~</BlueCardDeadLineText>
                    <BlueCardDeadLineText>{`${new Date(
                      bluecard.deadLineEnd
                    ).getFullYear()}. ${
                      new Date(bluecard.deadLineEnd).getMonth() + 1
                    }. ${new Date(bluecard.deadLineEnd).getDate()} 
            `}</BlueCardDeadLineText>
                    <BlueCardDeadLineText>{`${
                      new Date(bluecard.deadLineEnd).getHours() < 10
                        ? "0" + new Date(bluecard.deadLineEnd).getHours()
                        : new Date(bluecard.deadLineEnd).getHours()
                    } : ${
                      new Date(bluecard.deadLineEnd).getMinutes() < 10
                        ? "0" + new Date(bluecard.deadLineEnd).getMinutes()
                        : new Date(bluecard.deadLineEnd).getMinutes()
                    }`}</BlueCardDeadLineText>
                  </BlueCardDeadLine>
                ) : null}
              </BlueCardDetail>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!user) {
                    navigation.navigate("SignIn");
                  } else {
                    calendarAdd({
                      bluecardId: bluecard!.id,
                      mutation,
                      setUser,
                      setCalendar: setIsCalendar,
                      user,
                    });
                  }
                }}
              >
                <CalendarButton
                  isCalendar={bluecard.deadLineStart ? true : false}
                >
                  <CalendarButtonSpan>
                    {isCalendar ? "Remove from calendar" : "Add to calendar"}
                  </CalendarButtonSpan>
                  <Svg
                    width="25"
                    height="25"
                    viewBox="0 0 20 17"
                    fill="#ffffff"
                  >
                    <Path
                      d="M4.44444 0C3.82986 0 3.33333 0.470395 3.33333 1.05263V2.10526H1.66667C0.746528 2.10526 0 2.8125 0 3.68421V5.26316H15.5556V3.68421C15.5556 2.8125 14.809 2.10526 13.8889 2.10526H12.2222V1.05263C12.2222 0.470395 11.7257 0 11.1111 0C10.4965 0 10 0.470395 10 1.05263V2.10526H5.55556V1.05263C5.55556 0.470395 5.05903 0 4.44444 0ZM8.88889 12.1053C8.88889 9.08553 11.3299 6.60526 14.4444 6.33882V6.31579H0V15.2632C0 16.1349 0.746528 16.8421 1.66667 16.8421H11.4861C9.91667 15.7928 8.88889 14.0625 8.88889 12.1053ZM15 16.8421C16.3261 16.8421 17.5979 16.343 18.5355 15.4547C19.4732 14.5664 20 13.3616 20 12.1053C20 10.849 19.4732 9.64414 18.5355 8.75581C17.5979 7.86748 16.3261 7.36842 15 7.36842C13.6739 7.36842 12.4021 7.86748 11.4645 8.75581C10.5268 9.64414 10 10.849 10 12.1053C10 13.3616 10.5268 14.5664 11.4645 15.4547C12.4021 16.343 13.6739 16.8421 15 16.8421ZM15.5556 10V11.5789H17.2222C17.5278 11.5789 17.7778 11.8158 17.7778 12.1053C17.7778 12.3947 17.5278 12.6316 17.2222 12.6316H15.5556V14.2105C15.5556 14.5 15.3056 14.7368 15 14.7368C14.6944 14.7368 14.4444 14.5 14.4444 14.2105V12.6316H12.7778C12.4722 12.6316 12.2222 12.3947 12.2222 12.1053C12.2222 11.8158 12.4722 11.5789 12.7778 11.5789H14.4444V10C14.4444 9.71053 14.6944 9.47368 15 9.47368C15.3056 9.47368 15.5556 9.71053 15.5556 10Z"
                      fill="white"
                    />
                  </Svg>
                </CalendarButton>
              </TouchableWithoutFeedback>
            </BluecardWrapper>
            <CommentWrapper>
              <CommentTitle>
                <CommentTitleText>Write a Comment</CommentTitleText>
              </CommentTitle>
              <CommentTextInputScroll>
                <CommentTextInput
                  editable
                  multiline
                  numberOfLines={6}
                  onChangeText={(text) => setCommentText(text)}
                  value={commentText}
                  placeholder="Your comment"
                  placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
                  textAlignVertical="top"
                />
              </CommentTextInputScroll>
              {/* <ReactTextareaAutosize
            value={commentText}
            onChange={(text) => setCommentText(text.currentTarget.value)}
            placeholder="Your comment"
          /> */}
              <TouchableWithoutFeedback onPress={onValid}>
                <Button>
                  <ButtonText>Post</ButtonText>
                </Button>
              </TouchableWithoutFeedback>
              {comments?.data.comments.map((comment, index) => (
                <CommentUser
                  key={index}
                  comment={comment}
                  commentDetail={commentDetail}
                  commentEdit={commentEdit}
                  commentEditText={commentEditText}
                  setCommentDetail={setCommentDetail}
                  setCommentEdit={setCommentEdit}
                  setCommentEditText={setCommentEditText}
                  mutate={refetch}
                />
              ))}
            </CommentWrapper>
          </LeftSide>
          <MostReadNews />
          <RecommendedTitle>
            <RecommendedTitleText>Recommended Bluecards</RecommendedTitleText>
          </RecommendedTitle>
          <BluecardSlider data={bluecards?.data.latest!} />
          {/* <MostReadWrapper
        ref={newsRef}
        top={Y}
        end={ref.current?.offsetTop}
        height={newsRef.current?.offsetHeight}
      >
        <MostReadNews />
      </MostReadWrapper> */}
        </Wrapper>
        {/* <RecommendedWrapper ref={ref}>
      <RecommendedTitle>Recommended Bluecards</RecommendedTitle>
      <RecommendedContainer>
        {bluecardsData?.data.bluecards
          .slice(7, 14)
          .map((bluecard, index) => (
            <BlueCardMedium data={bluecard} key={index} />
          ))}
      </RecommendedContainer>
    </RecommendedWrapper>
    {message ? (
      <Message setToast={setMessage} toast={message} text={text} />
    ) : null} */}
      </TouchableWithoutFeedback>
    </Container>
  ) : (
    <Spinner />
  );
};

export default BluecardDetail;
