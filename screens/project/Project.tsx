import { useQuery, useQueryClient } from "react-query";
import { Project } from "../../libs/schema";
import { allProjects } from "../../libs/api";
import ProjectItem from "./../../components/project/ProjectItem";
import Dimension from "../../libs/useDimension";
import styled from "styled-components/native";
import { FlatList, View } from "react-native";
import Banner from "../../components/Banner";
import { useState } from "react";
import Title from "../../components/Title";
import { useUser } from "../../libs/context";

const Wrapper = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ProjectList = styled.View`
  justify-content: center;
  align-items: center;
  width: ${Dimension.width}px;
`;

const TitleWrapper = styled.View`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-top: 30px;
`;

interface ProjectsResponse {
  data: {
    projects: Project[];
  };
}

const ProjectScreeen = () => {
  const { user } = useUser();
  console.log(user);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<ProjectsResponse>(
    ["projectquery", "projects"],
    allProjects
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["projectquery"]);
    setRefreshing(false);
  };

  return data ? (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        <Wrapper>
          <Banner text="Project" />
          <TitleWrapper>
            <Title title="Subscribe the projects" />
          </TitleWrapper>
        </Wrapper>
      }
      contentContainerStyle={{ paddingBottom: 30 }}
      data={["isFirst", ...data.data.projects]}
      renderItem={({ item, index }) =>
        index === 0 ? (
          <ProjectList>
            <ProjectItem subscribeList={[]} />
          </ProjectList>
        ) : (
          <ProjectList>
            <ProjectItem
              subscribeList={user ? user.subscribe : []}
              project={item as Project}
            />
          </ProjectList>
        )
      }
    />
  ) : null;
};

export default ProjectScreeen;
