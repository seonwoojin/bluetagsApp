import { useInfiniteQuery } from "react-query";
import { BluecardWithProject } from "../../libs/schema";
import { useUser } from "../../libs/context";
import { allUserHistory } from "../../libs/api";
import Spinner from "../../components/Spinner";
import { FlatList } from "react-native";
import { useState } from "react";
import BlueCardMedium from "../../components/bluecard/BlueCardMedium";
import styled from "styled-components/native";

const BluecardWrapperTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0px 30px;
`;

const BluecardWrapperTitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #010101;
`;

const BluecardContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  z-index: 0;
`;

const HSeparator = styled.View`
  height: 15px;
`;

interface ResponseBluecards {
  data: {
    bluecards: BluecardWithProject[];
  };
  status: number;
}

const UserHistroy = () => {
  const { user } = useUser();
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery<ResponseBluecards>(
      `${user?.id}History`,
      ({ pageParam = "undefined" }) => allUserHistory(user!.id, pageParam),
      {
        enabled: user ? true : false,
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
  ) : (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      ListHeaderComponent={
        <BluecardWrapperTitle>
          <BluecardWrapperTitleText>Bluecard History</BluecardWrapperTitleText>
        </BluecardWrapperTitle>
      }
      contentContainerStyle={{ paddingBottom: 30 }}
      onEndReachedThreshold={0.75}
      data={data?.pages.map((page) => page.data.bluecards).flat()}
      renderItem={({ item }) => (
        <BluecardContainer>
          <BlueCardMedium data={item} />
        </BluecardContainer>
      )}
      ItemSeparatorComponent={HSeparator}
    />
  );
};

export default UserHistroy;
