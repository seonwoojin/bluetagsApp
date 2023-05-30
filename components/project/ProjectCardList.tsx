import styled from "styled-components/native";
import { Project, SocialUser, User } from "../../libs/schema";
import ProjectCard from "./ProjectCard";

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

interface Props {
  data: Project[];
  user: User | SocialUser | null;
  setUser: any;
}

export default function ProjectCardList({ data, user, setUser }: Props) {
  return (
    <Wrapper>
      {data.map((project, index) => (
        <ProjectCard data={project} user={user} setUser={setUser} key={index} />
      ))}
    </Wrapper>
  );
}
