import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavParamList } from "../navigation/Root";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { searchBluecards, searchProjects } from "../libs/api";
import { BluecardWithProject, ProjectWithBlueCard } from "../libs/schema";
import { useState } from "react";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import Title from "../components/Title";
import styled from "styled-components/native";
import Dimension from "../libs/useDimension";
import BlueCardMedium from "../components/bluecard/BlueCardMedium";
import ProjectItem from "../components/project/ProjectItem";
import ProjectCard from "../components/project/ProjectCard";
import { useUser } from "../libs/context";

const Container = styled.View`
  align-items: center;
  width: 100%;
  height: auto;
  margin-top: 20px;
  margin-bottom: 30px;
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

const NoResult = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 50px;
  padding-left: 0px;
  font-size: 30px;
  color: black;
  width: 100%;
  height: ${Dimension.height - 70}px;
  gap: 10px;
`;

const NoResultFirstTextView = styled.View`
  width: 90%;
  height: auto;
  margin-bottom: 6px;
`;

const NoResultFirstText = styled.Text`
  font-weight: 600;
  font-size: 20px;
  color: black;
  letter-spacing: -1.4px;
  text-align: center;
`;
const NoResultSecondTextView = styled.View`
  width: 90%;
  height: auto;
  margin-bottom: 10px;
`;

const NoResultSecondText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
`;

const Return = styled.View`
  width: auto;
  height: auto;
`;

const ReturnText = styled.Text`
  font-weight: 600;
  font-size: 14px;
  color: rgba(45, 103, 246, 1);
`;

type SearchScreenProps = NativeStackScreenProps<
  HomeStackNavParamList,
  "Search"
>;

interface Response {
  data: {
    projects: ProjectWithBlueCard[];
  };
}

interface ResponseBluecards {
  data: {
    bluecards: BluecardWithProject[];
  };
}

const Search = ({ route: { params }, navigation }: SearchScreenProps) => {
  const { user, setUser } = useUser();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<Response>(
    [`${params.query}`, "projects"],
    () => searchProjects(params.query)
  );
  const {
    data: blueCardsData,
    isLoading: blueCardsLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ResponseBluecards>(
    [`${params.query}`, "bluecards"],
    ({ pageParam = "undefined" }) => searchBluecards(params.query, pageParam),
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
    await queryClient.refetchQueries([`${params.query}`]);
    setRefreshing(false);
  };

  return data?.data.projects &&
    blueCardsData &&
    !blueCardsLoading &&
    !isLoading ? (
    data.data.projects.length > 0 ||
    blueCardsData.pages[0].data.bluecards.length > 0 ? (
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <Container>
            {data.data.projects.length > 0 ? (
              <>
                <Title title="Projects" />
                {data.data.projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    data={project}
                    user={user}
                    setUser={setUser}
                  />
                ))}
              </>
            ) : null}
            {blueCardsData.pages[0].data.bluecards.length > 0 ? (
              <>
                <View style={{ marginBottom: 40 }} />
                <Title title="Bluecards" />
              </>
            ) : null}
          </Container>
        }
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.75}
        data={blueCardsData.pages.map((page) => page.data.bluecards).flat()}
        renderItem={({ item }) => (
          <ItemWrapper>
            <BlueCardMedium
              data={item}
              fn={() => {
                navigation.navigate("BluecardDetail", { ...item });
              }}
              projectFn={() => {
                navigation.navigate("ProjectDetail", { ...item.project });
              }}
            />
          </ItemWrapper>
        )}
        ItemSeparatorComponent={HSeparator}
      />
    ) : (
      <NoResult>
        <NoResultFirstTextView>
          <NoResultFirstText>
            We&apos;re sorry, but we couldn&apos;t find any results for your
            search keyword
          </NoResultFirstText>
        </NoResultFirstTextView>
        <NoResultSecondTextView>
          <NoResultSecondText>
            Please try again with different keywords or check your spelling. If
            you need further assistance, feel free to contact our support team.
          </NoResultSecondText>
        </NoResultSecondTextView>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Main")}>
          <Return>
            <ReturnText>{`Return home >`}</ReturnText>
          </Return>
        </TouchableWithoutFeedback>
      </NoResult>
    )
  ) : null;
};

export default Search;
