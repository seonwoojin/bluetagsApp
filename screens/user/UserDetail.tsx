import { useInfiniteQuery } from "react-query";
import { userInfo } from "../../libs/api";
import { useUser } from "../../libs/context";
import { BluecardWithProject } from "../../libs/schema";
import { useState } from "react";
import { FlatList } from "react-native";
import Banner from "../../components/Banner";
import { Shadow } from "react-native-shadow-2";
import styled from "styled-components/native";
import Title from "../../components/Title";
import BlueCardHistory from "../../components/bluecard/BlueCardHistory";
import Dimension from "../../libs/useDimension";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavParamList } from "../../navigation/Root";
import Spinner from "../../components/Spinner";

const Container = styled.View`
  align-items: center;
  width: 100%;
  height: 300px;
  margin-top: 20px;
`;

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin-top: 60px;
  margin-bottom: 30px;
`;

const InfoWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 30px 10px;
  width: 80%;
  height: 80px;
  background: #f3f4f4;
  border: 1px solid rgba(25, 31, 40, 0.1);
  border-radius: 4px;
`;

const UserProfile = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const UserProfileImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Info = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 5px;
  width: 64px;
  height: 60px;
`;

const InfoCount = styled.Text`
  color: #434447;
  font-weight: 700;
  font-size: 12px;
  line-height: 22px;
`;

const InfoTitle = styled.Text`
  color: #434447;
  font-weight: 400;
  font-size: 11px;
`;

const ItemWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: ${Dimension.width}px;
  height: auto;
`;

const HSeparator = styled.View`
  height: 15px;
`;

type UserDetailScreenProps = NativeStackScreenProps<
  HomeStackNavParamList,
  "UserDetail"
>;

interface Response {
  data: {
    bluecards: BluecardWithProject[];
  };
}

const UserDetail: React.FC<UserDetailScreenProps> = ({ navigation }) => {
  const { user } = useUser();
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery<Response>(
      `${user!.name}`,
      ({ pageParam = "undefined" }) => userInfo(user!.id, pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.data.bluecards.length === 0) {
            return undefined;
          }
          return lastPage.data.bluecards[lastPage.data.bluecards.length - 1].id;
        },
      }
    );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return isLoading ? (
    <Spinner />
  ) : data ? (
    <FlatList
      contentContainerStyle={{ paddingBottom: 30 }}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        <Container>
          <Banner text={"My account"} />
          <Wrapper>
            <Shadow
              startColor="rgba(0, 0, 0, 0.03)"
              offset={[0, 3]}
              distance={8}
              style={{
                borderRadius: 10,
                height: 80,
              }}
            >
              <InfoWrapper>
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
                <Info>
                  <InfoCount>{user!.readBlueCard.length}</InfoCount>
                  <InfoTitle>Bluecards</InfoTitle>
                </Info>
                <Info>
                  <InfoCount>{23}</InfoCount>
                  <InfoTitle>News</InfoTitle>
                </Info>
                <Info>
                  <InfoCount>{user!.subscribe.length}</InfoCount>
                  <InfoTitle>Subscribe</InfoTitle>
                </Info>
              </InfoWrapper>
            </Shadow>
          </Wrapper>
          <Title title="History" />
        </Container>
      }
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.75}
      data={data.pages.map((page) => page.data.bluecards).flat()}
      renderItem={({ item }) => (
        <ItemWrapper>
          <BlueCardHistory
            data={item}
            projectLogo={item.project.logoUrl}
            projectTitle={item.project.title}
            fn={() => {
              navigation.navigate("BluecardDetail", { data: { ...item } });
            }}
            projectFn={() => {
              navigation.navigate("ProjectDetail", { ...item.project });
            }}
          />
        </ItemWrapper>
      )}
      ItemSeparatorComponent={HSeparator}
    />
  ) : null;
};

export default UserDetail;
