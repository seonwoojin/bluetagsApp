import { useInfiniteQuery, useQueryClient } from "react-query";
import { BluecardWithProject } from "../../libs/schema";
import { watchListBluecards } from "../../libs/api";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import Banner from "../../components/Banner";
import BlueCardMedium from "../../components/bluecard/BlueCardMedium";
import Upper from "../../components/button/Upper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { WatchListStackNavParamList } from "../../navigation/Root";

const Wrapper = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const BluecardContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

const SelectWrapper = styled.View`
  right: 3%;
  bottom: 10%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  z-index: 70;
`;

const HSeparator = styled.View`
  height: 15px;
`;

interface Response {
  data: {
    bluecards: BluecardWithProject[];
  };
}

const WatchList = () => {
  const navigation =
    useNavigation<NavigationProp<WatchListStackNavParamList>>();
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery<Response>(
      ["watchlist", "bluecards"],
      ({ pageParam = "undefined" }) => watchListBluecards(pageParam),
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
    await queryClient.refetchQueries(["watchlist"]);
  };

  return data ? (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      ListHeaderComponent={
        <Wrapper>
          <Banner text="Watchlist" />
          <SelectWrapper>
            <Upper />
          </SelectWrapper>
        </Wrapper>
      }
      contentContainerStyle={{ paddingBottom: 30 }}
      onEndReachedThreshold={0.75}
      data={data.pages.map((page) => page.data.bluecards).flat()}
      renderItem={({ item }) => (
        <BluecardContainer>
          <BlueCardMedium
            fn={() => {
              navigation.navigate("BluecardDetail", { ...item });
            }}
            data={item}
          />
        </BluecardContainer>
      )}
      ItemSeparatorComponent={HSeparator}
    />
  ) : null;
};

export default WatchList;
