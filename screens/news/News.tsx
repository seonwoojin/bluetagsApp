import styled from "styled-components/native";
import Banner from "../../components/Banner";
import { useInfiniteQuery } from "react-query";
import { allNewscards } from "../../libs/api";
import { NewsCard } from "../../libs/schema";
import { useEffect, useState } from "react";
import Dimension from "../../libs/useDimension";
import { Shadow } from "react-native-shadow-2";
import Newscard from "../../components/newscard/Nescard";
import { FlatList } from "react-native";
import Spinner from "../../components/Spinner";
import MostReadNews from "./../../components/MostReadNews";

const Wrapper = styled.View`
  align-items: center;
  width: 100%;
`;

const ContextWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  background-color: #ffffff;
  z-index: 1;
`;

const NewsHead = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 25px;
  padding: 0px 10px;
  z-index: 3;
`;

const NewsHeadText = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 30px;
`;

const Text = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d3748;
`;

const ItemWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: ${Dimension.width}px;
  height: auto;
`;

interface ResponseNewsCards {
  data: {
    newscards: NewsCard[];
  };
}

interface NewsData {
  date: string;
  data: NewsCard[];
}

const News = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery<ResponseNewsCards>(
      "news",
      ({ pageParam = "undefined" }) => allNewscards(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.data.newscards.length === 0) {
            return undefined;
          }
          return lastPage.data.newscards[lastPage.data.newscards.length - 1].id;
        },
      }
    );
  const [fullData, setFullData] = useState<NewsData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
  };

  useEffect(() => {
    if (data && data?.pages.length > 0) {
      const object = fullData;
      if (data.pages[data.pages.length - 1].data.newscards.length > 0) {
        data.pages[data.pages.length - 1].data.newscards.map((newscard) => {
          const index = fullData.findIndex(
            (data) =>
              data["date"] === newscard.createdAt.toString().slice(0, 10)
          );
          if (index !== -1) {
            object[index].data.push(newscard);
          } else {
            object.push({
              date: newscard.createdAt.toString().slice(0, 10),
              data: [newscard],
            });
          }
        });
      }
      setFullData(object);
    }
  }, [data?.pages.length]);

  useEffect(() => {
    if (refreshing) {
      const object: NewsData[] = [];
      data?.pages.map((page) => {
        if (page.data.newscards.length > 0) {
          page.data.newscards.map((newscard) => {
            const index = object.findIndex(
              (data) =>
                data["date"] === newscard.createdAt.toString().slice(0, 10)
            );
            if (index !== -1) {
              object[index].data.push(newscard);
            } else {
              object.push({
                date: newscard.createdAt.toString().slice(0, 10),
                data: [newscard],
              });
            }
          });
        }
      });
      setFullData(object);
      setRefreshing(false);
    }
  }, [refreshing]);

  return isLoading && fullData.length === 0 ? (
    <Spinner />
  ) : (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      ListHeaderComponent={
        <Wrapper>
          <MostReadNews />
        </Wrapper>
      }
      contentContainerStyle={{ paddingBottom: 30 }}
      onEndReachedThreshold={0.75}
      data={fullData}
      renderItem={({ item }) => (
        <ItemWrapper style={{ marginTop: 30 }}>
          <ContextWrapper>
            <NewsHead>
              <NewsHeadText>
                <Text>{item.date}</Text>
              </NewsHeadText>
            </NewsHead>
            {item.data.map((newscard, index) => (
              <Newscard newscard={newscard} key={index} />
            ))}
          </ContextWrapper>
        </ItemWrapper>
      )}
    />
  );
};

export default News;
