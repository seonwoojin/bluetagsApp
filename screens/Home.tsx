import styled from "styled-components/native";
import Title from "../components/Title";
import BannerSlider from "../components/slider/BannerSlider";
import { useQuery, useQueryClient } from "react-query";
import { allProjects, homeBluecards } from "../libs/api";
import { BluecardWithProject, Project } from "../libs/schema";
import BluecardSlider from "../components/slider/BluecardSlider";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProjectCardSlider from "../components/slider/ProjectCardSlider";
import { useUser } from "../libs/context";
import { useFocusEffect } from "@react-navigation/native";
import { RefreshControl } from "react-native";

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

const Home = () => {
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
        <ProjectCardSlider data={sortedProjects} />
      ) : null}
    </Wrapper>
  );
};

export default Home;
