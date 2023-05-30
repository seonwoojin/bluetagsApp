import styled from "styled-components/native";
import Title from "../components/Title";
import BannerSlider from "../components/slider/BannerSlider";
import { useQuery, useQueryClient } from "react-query";
import { allProjects, homeBluecards } from "../libs/api";
import { BluecardWithProject, Project } from "../libs/schema";
import BluecardSlider from "../components/slider/BluecardSlider";
import { useMemo, useState } from "react";
import ProjectCardSlider from "../components/slider/ProjectCardSlider";
import { useUser } from "../libs/context";
import { RefreshControl } from "react-native";
import { HomeStackNavParamList } from "../navigation/Root";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Wrapper = styled.ScrollView``;

interface Response {
  data: {
    bluecards: BluecardWithProject[];
  };
}

interface ProjectsResponse {
  data: {
    projects: Project[];
  };
}

const Home: React.FC<NativeStackScreenProps<HomeStackNavParamList, "Main">> = ({
  navigation,
}) => {
  const { user, setUser } = useUser();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<Response>(
    ["homequery", "home"],
    homeBluecards
  );
  const { data: projectData, isLoading: projectLoading } =
    useQuery<ProjectsResponse>(["homequery", "projects"], allProjects);
  const sortProjects = (projects: Project[]) => {
    const groupedData = [];
    const chunkSize = 4;
    while (projects.length) {
      groupedData.push(projects.splice(0, chunkSize));
    }

    return groupedData;
  };
  const sortedProjects = useMemo(() => {
    if (projectData && !projectLoading) {
      return sortProjects(projectData!.data.projects);
    } else {
      return [];
    }
  }, [projectData]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["homequery"]);
    setRefreshing(false);
  };

  return (
    <Wrapper
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <BannerSlider />
      <Title subTitle="New" title="BlueCard" />
      {!isLoading && data ? (
        <BluecardSlider data={data?.data.bluecards} />
      ) : null}
      <Title title="Project" />
      {sortedProjects.length > 0 ? (
        <ProjectCardSlider
          data={sortedProjects}
          user={user}
          setUser={setUser}
        />
      ) : null}
    </Wrapper>
  );
};

export default Home;
