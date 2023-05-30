import { useQuery } from "react-query";
import { Project } from "../../libs/schema";
import { allProjects } from "../../libs/api";
import ProjectItem from "./../../components/project/ProjectItem";
import Dimension from "../../libs/useDimension";
import styled from "styled-components/native";
import { FlatList } from "react-native";
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
  const { user, setUser } = useUser();
  const { data, isLoading, refetch } = useQuery<ProjectsResponse>(
    "projects",
    allProjects
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
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
            <ProjectItem user={user} setUser={setUser} />
          </ProjectList>
        ) : (
          <ProjectList>
            <ProjectItem
              user={user}
              setUser={setUser}
              project={item as Project}
            />
          </ProjectList>
        )
      }
    />
  ) : null;
};

export default ProjectScreeen;
