import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavParamList, RootNavParamList } from "../navigation/Root";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { searchBluecards, searchInfo, searchProjects } from "../libs/api";
import { BluecardWithProject, ProjectWithBlueCard } from "../libs/schema";
import { useState } from "react";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import styled from "styled-components/native";
import Dimension from "../libs/useDimension";
import BlueCardMedium from "../components/bluecard/BlueCardMedium";
import ProjectItem from "../components/project/ProjectItem";
import ProjectCard from "../components/project/ProjectCard";
import { useUser } from "../libs/context";
import Spinner from "../components/Spinner";
import Svg, { Path } from "react-native-svg";
import useMutation from "../libs/useMutation";
import subscribeProject from "../libs/subscribeProject";

const Container = styled.View`
  align-items: center;
  width: 100%;
  height: auto;
  padding-top: 30px;
  background-color: #f8f9fa;
`;

const InfoTitle = styled.View`
  justify-content: center;
  width: 100%;
  max-width: 2000px;
  height: auto;
  margin-bottom: 30px;
  padding-left: 20px;
  gap: 15px;
`;

const InfoTitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.85);
`;

const InfoTitleH1 = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.45);
`;

const InfoTitleView = styled.View`
  flex-direction: row;
  gap: 5px;
`;

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  padding: 10px 30px;
`;

const TitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #010101;
`;

const Wrapper = styled.View`
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 2000px;
  height: auto;
`;

const LeftSide = styled.View`
  width: 100%;
  height: auto;
  margin-right: 25px;
  background-color: #ffffff;
`;

const ProjectWrapper = styled.View`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  background-color: #ffffff;
  gap: 10px;
  padding-bottom: 30px;
`;

const ProjectContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0px 20px;
`;

const ProjectTitle = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
  gap: 10px;
`;

const ProjectLogo = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
`;

const ProjectLogoImage = styled.Image`
  width: 40px;
  height: 40px;
`;

const ProjectTitleContainer = styled.View`
  justify-content: center;
  width: auto;
  height: 100%;
`;

const ProjectTitleContainerH1 = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #010101;
`;

const ProjectTitleContainerH2 = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #93989a;
`;

const ContextWrapperMobile = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding-bottom: 100px;
  background: #ffffff;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 10px;
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

const ItemWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: ${Dimension.width}px;
  height: auto;
`;

const HSeparator = styled.View`
  height: 15px;
`;

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

interface ResponseInfo {
  data: {
    bluecardsCount: number;
    projectsCount: number;
  };
  status: number;
}

type SearchScreenProps = NativeStackScreenProps<RootNavParamList, "Search">;

const Search = ({ route: { params }, navigation }: SearchScreenProps) => {
  const { user, setUser } = useUser();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<Response>(
    [`${params.query}`, "projects"],
    () => searchProjects(params.query)
  );
  const { data: info, isLoading: infoIsLoading } = useQuery<ResponseInfo>(
    [`${params.query}`, "info"],
    () => searchInfo(params.query)
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

  const [subscribe, setSubscribe] = useState<string[]>(
    user ? user.subscribe : []
  );
  const [refreshing, setRefreshing] = useState(false);

  const mutation = useMutation("https://www.bluetags.app/api/users/subscribe");

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries([`${params.query}`]);
    setRefreshing(false);
  };

  return data?.data.projects &&
    blueCardsData &&
    !blueCardsLoading &&
    !isLoading &&
    info ? (
    data.data.projects.length > 0 ||
    blueCardsData.pages[0].data.bluecards.length > 0 ? (
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <Container>
            <InfoTitle>
              <InfoTitleText>
                {`Search results for "${params.query}"`}
              </InfoTitleText>
              <InfoTitleView>
                {info.data.bluecardsCount > 0 ? (
                  <InfoTitleH1>{`${info.data.bluecardsCount} Bluecards`}</InfoTitleH1>
                ) : null}
                {info.data.projectsCount > 0 ? (
                  <InfoTitleH1>{`${info.data.projectsCount} projects`}</InfoTitleH1>
                ) : null}
                {info.data.bluecardsCount > 0 || info.data.projectsCount > 0 ? (
                  <InfoTitleH1>found</InfoTitleH1>
                ) : null}
              </InfoTitleView>
            </InfoTitle>
            <Wrapper>
              <LeftSide>
                {blueCardsData.pages.map((page) => page.data.bluecards).flat()
                  .length > 0 ? (
                  <Title>
                    <TitleText>Bluecards</TitleText>
                  </Title>
                ) : null}
              </LeftSide>
              <ProjectWrapper>
                {data.data.projects.length > 0 ? (
                  <Title>
                    <TitleText>Projects</TitleText>
                  </Title>
                ) : null}
                {data.data.projects.map((project, index) => (
                  <ProjectContainer key={index}>
                    <ProjectTitle>
                      <ProjectLogo>
                        <ProjectLogoImage source={{ uri: project.logoImage }} />
                      </ProjectLogo>
                      <ProjectTitleContainer>
                        <ProjectTitleContainerH1>
                          {project.title}
                        </ProjectTitleContainerH1>
                        <ProjectTitleContainerH2>
                          {project.category}
                        </ProjectTitleContainerH2>
                      </ProjectTitleContainer>
                    </ProjectTitle>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (!user) {
                          navigation.navigate("SignIn");
                        } else
                          subscribeProject({
                            subscribeList: subscribe,
                            setSubscribeList: setSubscribe,
                            project: project,
                            user,
                            setUser,
                            mutation,
                          });
                      }}
                    >
                      {subscribe.includes(project.key) ? (
                        <Svg
                          width={15}
                          height={15}
                          viewBox="0 0 15 15"
                          fill="#101010"
                        >
                          <Path
                            d="M8.58058 2.19365L9.68058 4.39365C9.83058 4.6999 10.2306 4.99365 10.5681 5.0499L12.5618 5.38115C13.8368 5.59365 14.1368 6.51865 13.2181 7.43115L11.6681 8.98115C11.4056 9.24365 11.2618 9.7499 11.3431 10.1124L11.7868 12.0312C12.1368 13.5499 11.3306 14.1374 9.98683 13.3437L8.11808 12.2374C7.78058 12.0374 7.22433 12.0374 6.88058 12.2374L5.01183 13.3437C3.67433 14.1374 2.86183 13.5437 3.21183 12.0312L3.65558 10.1124C3.73683 9.7499 3.59308 9.24365 3.33058 8.98115L1.78058 7.43115C0.868083 6.51865 1.16183 5.59365 2.43683 5.38115L4.43058 5.0499C4.76183 4.99365 5.16183 4.6999 5.31183 4.39365L6.41183 2.19365C7.01183 0.999902 7.98683 0.999902 8.58058 2.19365Z"
                            stroke="#101010"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      ) : (
                        <Svg
                          width={15}
                          height={15}
                          viewBox="0 0 15 15"
                          fill="none"
                        >
                          <Path
                            d="M8.58058 2.19365L9.68058 4.39365C9.83058 4.6999 10.2306 4.99365 10.5681 5.0499L12.5618 5.38115C13.8368 5.59365 14.1368 6.51865 13.2181 7.43115L11.6681 8.98115C11.4056 9.24365 11.2618 9.7499 11.3431 10.1124L11.7868 12.0312C12.1368 13.5499 11.3306 14.1374 9.98683 13.3437L8.11808 12.2374C7.78058 12.0374 7.22433 12.0374 6.88058 12.2374L5.01183 13.3437C3.67433 14.1374 2.86183 13.5437 3.21183 12.0312L3.65558 10.1124C3.73683 9.7499 3.59308 9.24365 3.33058 8.98115L1.78058 7.43115C0.868083 6.51865 1.16183 5.59365 2.43683 5.38115L4.43058 5.0499C4.76183 4.99365 5.16183 4.6999 5.31183 4.39365L6.41183 2.19365C7.01183 0.999902 7.98683 0.999902 8.58058 2.19365Z"
                            stroke="#101010"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      )}
                    </TouchableWithoutFeedback>
                  </ProjectContainer>
                ))}
              </ProjectWrapper>
            </Wrapper>
          </Container>
        }
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.75}
        data={blueCardsData.pages.map((page) => page.data.bluecards).flat()}
        renderItem={({ item }) => (
          <ItemWrapper>
            <BlueCardMedium data={item} />
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
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Return>
            <ReturnText>{`Return back >`}</ReturnText>
          </Return>
        </TouchableWithoutFeedback>
      </NoResult>
    )
  ) : (
    <Spinner />
  );
};

export default Search;
