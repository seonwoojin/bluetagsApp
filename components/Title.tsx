import { Text } from "react-native";
import styled from "styled-components/native";

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  padding-left: 8%;
`;

const TitleContainer = styled.View`
  width: 100%;
  height: 30px;
`;

const SubTitle = styled.View`
  width: 100%;
`;

const TitleText = styled.Text`
  font-size: 20px;
  color: #1c1b1b;
  font-weight: 500;
`;

const SubTitleText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: rgba(28, 27, 27, 0.5);
`;

interface TitleProps {
  subTitle?: string;
  title: string;
}

const Title = ({ subTitle, title }: TitleProps) => {
  return (
    <Wrapper>
      <TitleContainer>
        <TitleText>{title}</TitleText>
      </TitleContainer>
      <SubTitle>
        <SubTitleText>{subTitle ? subTitle : null}</SubTitleText>
      </SubTitle>
    </Wrapper>
  );
};

export default Title;
