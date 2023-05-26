import styled from "styled-components/native";
import Title from "../components/Title";
import BannerSlider from "../components/slider/BannerSlider";
import { useQuery } from "react-query";
import { allProjects, homeBluecards } from "../libs/api";
import { BluecardWithProject, Project } from "../libs/schema";
import BluecardSlider from "../components/slider/BluecardSlider";
import { useEffect, useMemo, useState } from "react";
import ProjectCardList from "../components/project/ProjectCardList";
import ProjectCardSlider from "../components/slider/ProjectCardSlider";
import BlueCardMedium from "../components/bluecard/BlueCardMedium";

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
  const { data, isLoading } = useQuery<Response>("home", homeBluecards);
  const { data: projectData, isLoading: projectLoading } =
    useQuery<ProjectsResponse>("projects", allProjects);

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

  return (
    <Wrapper>
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
