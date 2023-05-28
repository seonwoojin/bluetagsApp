import styled from "styled-components/native";
import Banner from "../../components/Banner";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { allNewscards } from "../../libs/api";
import { NewsCard } from "../../libs/schema";
import { useCallback, useEffect, useState } from "react";
import Dimension from "../../libs/useDimension";
import { Shadow } from "react-native-shadow-2";
import Newscard from "../../components/newscard/Nescard";
import { FlatList } from "react-native";

const Wrapper = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const ContextWrapper = styled.View`
  position: relative;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: ${Dimension.width * 0.9}px;
  max-width: 1200px;
  height: auto;
  padding: 25px 30px 0px 30px;
  overflow: hidden;
`;

const VerticalBar = styled.View`
  position: absolute;
  width: 1px;
  height: 105%;
  background-color: rgba(0, 0, 0, 0.1);
  left: 40px;
  top: 45px;
  z-index: -1;
`;

const NewsHead = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-bottom: 20px;
  z-index: 2;
`;

const NewsHeadText = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 30px;
  padding: 5px 30px 5px 30px;
  border-radius: 3px;
  background-color: white;
`;

const Text = styled.Text`
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  font-size: 14px;
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
  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, fetchNextPage } =
    useInfiniteQuery<ResponseNewsCards>(
      ["news", "newsdetail"],
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
    await queryClient.refetchQueries(["news"]);
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

  return data ? (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      ListHeaderComponent={
        <Wrapper>
          <Banner text="News" />
        </Wrapper>
      }
      contentContainerStyle={{ paddingBottom: 30 }}
      onEndReachedThreshold={0.75}
      data={fullData}
      renderItem={({ item }) => (
        <ItemWrapper style={{ marginTop: 30 }}>
          <Shadow startColor="rgba(50, 50, 93, 0.25)" distance={2}>
            <ContextWrapper>
              <VerticalBar />
              <NewsHead>
                <Shadow
                  startColor="rgba(0, 0, 0, 0.03)"
                  distance={4}
                  style={{
                    borderRadius: 3,
                  }}
                >
                  <NewsHeadText>
                    <Text>{item.date}</Text>
                  </NewsHeadText>
                </Shadow>
              </NewsHead>
              {item.data.map((newscard, index) => (
                <Newscard newscard={newscard} key={index} />
              ))}
            </ContextWrapper>
          </Shadow>
        </ItemWrapper>
      )}
    />
  ) : null;
};

export default News;
