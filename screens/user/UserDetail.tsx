import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useUser } from "../../libs/context";
import { BluecardWithProject, CommentWithUser } from "../../libs/schema";
import { RootNavParamList } from "../../navigation/Root";
import { useQuery } from "react-query";
import Spinner from "../../components/Spinner";
import { userBluecards, userComments, userUpcoming } from "../../libs/api";
import { useState } from "react";
import styled from "styled-components/native";
import Upcoming from "../../components/Upcoming";
import Greeting from "../../components/Greeting";
import CommentUser from "../../components/bluecard/CommentUser";
import BluecardSlider from "../../components/slider/BluecardSlider";
import { RefreshControl, TouchableWithoutFeedback } from "react-native";

const Container = styled.ScrollView`
  width: 100%;
  height: auto;
`;

const UserWrapper = styled.View`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
`;

const UpcomingWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

const LeftContext = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 25px 20px;
  background-color: #ffffff;
  gap: 10px;
`;

const UserProfilePrev = styled.View`
  width: 100px;
  min-width: 100px;
  height: 100px;
  margin-right: 50px;
  border-radius: 50%;
  background: #dddddd;
`;

const UserProfile = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-right: 50px;
`;

const UserProfileImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const UserProfileWrapper = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: auto;
  height: auto;
  gap: 10px;
`;

const UserTitle = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: auto;
  height: auto;
`;

const UserTitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  color: #010101;
`;

const UserEdit = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 90px;
  height: 32px;
  background: #6271eb;
  border-radius: 8px;
`;

const UserEditText = styled.Text`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: #ffffff;
`;

const JoinDate = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
`;

const JoinDateText = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #93989a;
`;

const RightContext = styled.View`
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 120px;
  background-color: #ffffff;
`;

const ContextWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: 320px;
  overflow: hidden;
  gap: 15px;
`;

const CommentWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  overflow: hidden;
  gap: 15px;
`;

const BluecardWrapper = styled.View`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 0px 30px 30px 30px;
  background-color: #ffffff;
`;

const BluecardWrapperTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
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

interface Response {
  data: {
    history: BluecardWithProject[];
    saved: BluecardWithProject[];
  };
  status: number;
}

interface ResponseUpcoming {
  data: {
    upComingEvents: BluecardWithProject[];
  };
}

interface ResponseComments {
  data: {
    comments: CommentWithUser[];
  };
}

type UserDetailScreenProps = NativeStackScreenProps<
  RootNavParamList,
  "UserDetail"
>;

const UserDetail = ({ navigation }: UserDetailScreenProps) => {
  const { user } = useUser();

  const { data, isLoading, refetch } = useQuery<Response>(
    `${user!.id}bluecard`,
    () => userBluecards(user!.id),
    { enabled: user ? true : false }
  );
  const {
    data: upcoming,
    isLoading: upcomingIsLoading,
    refetch: upcomingRefetch,
  } = useQuery<ResponseUpcoming>(
    `${user!.id}upcoming`,
    () => userUpcoming(user!.id),
    { enabled: user ? true : false }
  );
  const {
    data: comments,
    isLoading: commentsIsLoading,
    refetch: commentsRefetch,
  } = useQuery<ResponseComments>(
    `${user!.id}comments`,
    () => userComments(user!.id),
    { enabled: user ? true : false }
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await upcomingRefetch();
    await commentsRefetch();
    setRefreshing(false);
  };

  const loading = isLoading || upcomingIsLoading || commentsIsLoading || !user;

  return loading ? (
    <Spinner />
  ) : (
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <UserWrapper>
        <LeftContext>
          {user?.profile === "" ? (
            <UserProfilePrev />
          ) : (
            <UserProfile>
              <UserProfileImage
                source={{
                  uri: user!.profile.includes("googleusercontent")
                    ? user!.profile
                    : `https://imagedelivery.net/o9OxHWpSBsqZquvzmxx1bQ/${
                        user!.profile
                      }/avatar`,
                }}
              />
            </UserProfile>
          )}
          <UserProfileWrapper>
            <UserTitle>
              <UserTitleText>{user?.name}</UserTitleText>
            </UserTitle>
            <UserEdit>
              <UserEditText>Edit Profile</UserEditText>
            </UserEdit>
            <JoinDate>
              <JoinDateText>{`Joined ${new Date(
                user?.createdAt!
              ).getMonth()} ${new Date(
                user?.createdAt!
              ).getFullYear()}`}</JoinDateText>
            </JoinDate>
          </UserProfileWrapper>
        </LeftContext>
        <RightContext>
          <Greeting isUser={true} name={user?.name} />
        </RightContext>
      </UserWrapper>
      <UpcomingWrapper>
        {upcoming?.data && upcoming.data.upComingEvents.length > 0 ? (
          <Upcoming
            isUser={true}
            path="/calendar"
            data={upcoming.data.upComingEvents
              .filter((event) => user?.calendar.includes(event.id))
              .slice(0, 3)}
          />
        ) : null}
      </UpcomingWrapper>
      {data?.data.history && data.data.history.length > 0 ? (
        <BluecardWrapper>
          <BluecardWrapperTitle>
            <BluecardWrapperTitleText>History</BluecardWrapperTitleText>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("UserHistory")}
            >
              <SubSelect>
                <SubSelectText>VIEW ALL</SubSelectText>
              </SubSelect>
            </TouchableWithoutFeedback>
          </BluecardWrapperTitle>
          <BluecardSlider data={data.data.history.slice(0, 3)} />
        </BluecardWrapper>
      ) : null}
      {data?.data.saved && data.data.saved.length > 0 ? (
        <BluecardWrapper>
          <BluecardWrapperTitle>
            <BluecardWrapperTitleText>Saved</BluecardWrapperTitleText>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("UserSaved")}
            >
              <SubSelect>
                <SubSelectText>VIEW ALL</SubSelectText>
              </SubSelect>
            </TouchableWithoutFeedback>
          </BluecardWrapperTitle>
          <BluecardSlider data={data.data.saved.slice(0, 3)} />
        </BluecardWrapper>
      ) : null}
      <BluecardWrapper style={{ marginBottom: 30 }}>
        <BluecardWrapperTitle>
          <BluecardWrapperTitleText>Comments</BluecardWrapperTitleText>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("UserComment")}
          >
            <SubSelect>
              <SubSelectText>VIEW ALL</SubSelectText>
            </SubSelect>
          </TouchableWithoutFeedback>
        </BluecardWrapperTitle>
        <CommentWrapper>
          {comments?.data.comments.slice(0, 3).map((comment, index) => (
            <CommentUser
              key={index}
              touch={() =>
                navigation.navigate("BluecardDetail", {
                  bluecardId: comment.blueCardId,
                })
              }
              comment={comment}
            />
          ))}
        </CommentWrapper>
      </BluecardWrapper>
    </Container>
  );
};

export default UserDetail;
