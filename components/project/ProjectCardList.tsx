import styled from "styled-components/native";
import { Project } from "../../libs/schema";
import ProjectCard from "./ProjectCard";

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

interface Props {
  data: Project[];
}

export default function ProjectCardList({ data }: Props) {
  return (
    <Wrapper>
      {data.map((project, index) => (
        <ProjectCard data={project} key={index} />
      ))}
    </Wrapper>
  );
}
