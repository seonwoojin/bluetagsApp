import { Path, Svg } from "react-native-svg";
import styled from "styled-components/native";
import { Project } from "../../libs/schema";
import { Text, View } from "react-native";

const ProjectContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 60px;
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  color: #1f1f1f;
`;

const Container = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 85%;
  height: 100%;
`;

const LogoImage = styled.Image`
  width: 40px;
  height: 40px;
  margin-left: 10px;
  border-radius: 6px;
`;

const NoLogoImage = styled.View`
  width: 40px;
  height: 40px;
`;

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Collection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 50%;
  align-items: center;
  padding-left: 10px;
`;

const CollectionText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 19px;
  letter-spacing: -0.5px;
`;

const InfoWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50%;
`;

const InfoSpan = styled.Text`
  color: rgba(0, 0, 0, 0.6);
  margin-right: 5px;
  font-size: 10px;
`;

const FloorPrice = styled.View`
  flex-direction: row;
  justify-content: center;
  width: auto;
  height: 100%;
  align-items: center;
  padding-left: 10px;
`;

const PriceText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 19px;
  letter-spacing: -0.5px;
`;

const Volume = styled.View`
  flex-direction: row;
  justify-content: center;
  width: auto;
  height: 100%;
  align-items: center;
  padding-left: 10px;
`;

const SubscribeButton = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 15%;
  height: 100%;
  align-items: center;
`;

interface Props {
  project?: Project;
  subscribeList?: string[];
}

export default function ProjectItem({ project, subscribeList }: Props) {
  return !project ? (
    <ProjectContainer>
      <Wrapper>
        <Collection>
          <CollectionText>Collection</CollectionText>
        </Collection>
      </Wrapper>
    </ProjectContainer>
  ) : (
    <ProjectContainer>
      <Container>
        <LogoImage source={{ uri: project.logoUrl }} />
        <Wrapper>
          <Collection>
            <CollectionText>{project.title}</CollectionText>
          </Collection>
          <InfoWrapper>
            <FloorPrice>
              <InfoSpan>Floor :</InfoSpan>
              <PriceText>2.50 ETH</PriceText>
            </FloorPrice>
            <Volume>
              <InfoSpan>Volume :</InfoSpan>
              <PriceText>1,123 ETH</PriceText>
            </Volume>
          </InfoWrapper>
        </Wrapper>
      </Container>
      <SubscribeButton>
        {/* {subscribeList!.includes(project!.key) ? (
          <Svg width={15} fill={"#000000"} viewBox="0 0 576 512">
            <Path d="M288.1 0l86.5 164 182.7 31.6L428 328.5 454.4 512 288.1 430.2 121.7 512l26.4-183.5L18.9 195.6 201.5 164 288.1 0z" />
          </Svg>
        ) : (
          <Svg width={15} viewBox="0 0 576 512">
            <Path d="M287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9zM226.5 168.8C221.9 178.3 212.9 184.9 202.4 186.5L64.99 206.8L164.8 305.6C172.1 312.9 175.5 323.4 173.8 333.7L150.2 473.2L272.8 407.7C282.3 402.6 293.6 402.6 303 407.7L425.6 473.2L402.1 333.7C400.3 323.4 403.7 312.9 411.1 305.6L510.9 206.8L373.4 186.5C362.1 184.9 353.1 178.3 349.3 168.8L287.9 42.32L226.5 168.8z" />
          </Svg>
        )} */}
        <Svg fill={"#000000"} width={15} height={15} viewBox="0 0 576 512">
          <Path d="M287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9zM226.5 168.8C221.9 178.3 212.9 184.9 202.4 186.5L64.99 206.8L164.8 305.6C172.1 312.9 175.5 323.4 173.8 333.7L150.2 473.2L272.8 407.7C282.3 402.6 293.6 402.6 303 407.7L425.6 473.2L402.1 333.7C400.3 323.4 403.7 312.9 411.1 305.6L510.9 206.8L373.4 186.5C362.1 184.9 353.1 178.3 349.3 168.8L287.9 42.32L226.5 168.8z" />
        </Svg>
      </SubscribeButton>
    </ProjectContainer>
  );
}