import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import { ClipPath, Defs, G, Line, Path, Rect, Svg } from "react-native-svg";
import { BluecardWithProject } from "../../libs/schema";
import { useEffect, useState } from "react";
import { useUser } from "../../libs/context";
import useMutation from "../../libs/useMutation";
import { Shadow } from "react-native-shadow-2";
import { HomeStackNavParamList } from "../../navigation/Root";
import { TouchableWithoutFeedback } from "react-native";

const BlueCardContainer = styled.View`
  align-items: center;
  padding: 30px 20px 0px;
  gap: 20px;
  max-width: 590px;
  min-width: 300px;
  width: ${Dimension.width * 0.9}px;
  height: 270px;
  background: #ffffff;
  border: 1px solid rgba(25, 31, 40, 0.1);
  border-radius: 10px;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  gap: 40px;
  width: 100%;
  height: 80px;
`;

const TitleContent = styled.View`
  align-items: flex-start;
  padding: 0px;
  gap: 20px;
  width: 100%;
  height: auto;
  border-radius: 20px;
`;

const TitleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  line-height: 18px;
`;

const ProjectTitle = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: auto;
  height: 17px;
`;

const ProjectTitleText = styled.Text`
  font-style: normal;
  line-height: 17px;
  letter-spacing: -1px;
  color: #191f28;
  font-weight: 700;
  font-size: 12px;
`;

const CreatedAtText = styled.Text`
  font-style: normal;
  line-height: 17px;
  letter-spacing: -1px;
  color: #191f28;
  font-weight: 500;
  font-size: 12px;
`;

const ProjectLogo = styled.View`
  width: ${Dimension.width * 0.123}px;
  height: ${Dimension.width * 0.123}px;
  border-radius: 10px;
  overflow: hidden;
`;

const ProjectLogoImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const Description = styled.View`
  overflow: hidden;
  width: 94%;
  height: 50px;
`;

const DescriptionText = styled.Text`
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 17px;
  color: rgba(35, 35, 35, 0.8);
`;

const Button = styled.View<{ isCalendar: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 85%;
  height: 40px;
  background: #191f28;
  border-radius: 5px;
  opacity: ${(props) => (!props.isCalendar ? 0.3 : 1)};
`;

const ButtonText = styled.Text`
  font-weight: 700;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

interface Props {
  data: BluecardWithProject;
  projectTitle: string;
  projectLogo: string;
  fn: () => void;
  projectFn: () => void;
}

export default function BlueCardHistory({
  data,
  projectTitle,
  projectLogo,
  fn,
  projectFn,
}: Props) {
  const user = useUser();
  const [isInclude, setIsInclude] = useState<boolean>(false);
  const [calendar, { loading, status }] = useMutation(
    "/api/bluecards/add-calendar"
  );

  useEffect(() => {
    if (user.user) {
      setIsInclude(user.user.calendar.includes(data.id));
    }
  }, [user]);

  return (
    <Shadow
      startColor="rgba(0, 0, 0, 0.04)"
      offset={[0, 4]}
      distance={3}
      style={{ borderRadius: 15, height: 270 }}
    >
      <TouchableWithoutFeedback onPress={fn}>
        <BlueCardContainer>
          <TitleWrapper>
            <TitleContent>
              <TitleText numberOfLines={2}>{data.title}</TitleText>
              <ProjectTitle>
                <TouchableWithoutFeedback onPress={projectFn}>
                  <ProjectTitleText>{projectTitle}</ProjectTitleText>
                </TouchableWithoutFeedback>
                <Svg width="2" height="11" viewBox="0 0 2 11" fill="none">
                  <Line
                    opacity="0.5"
                    x1="1.43164"
                    y1="2.18557e-08"
                    x2="1.43164"
                    y2="11"
                    stroke="#191F28"
                  />
                </Svg>
                <CreatedAtText>
                  {new Date(data.createdAt).toDateString()}
                </CreatedAtText>
              </ProjectTitle>
            </TitleContent>
            <ProjectLogo>
              <ProjectLogoImage source={{ uri: projectLogo }} />
            </ProjectLogo>
          </TitleWrapper>
          <Description>
            <DescriptionText>
              {data.summary.replace(/<[^>]*>?/g, "")}
            </DescriptionText>
          </Description>
          <Button isCalendar={data.deadLineStart ? true : false}>
            <ButtonText>
              {isInclude ? "Remove from calendar" : "Add to calendar"}
            </ButtonText>
            <Svg
              style={{ marginLeft: 10 }}
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <G clipPath="url(#clip0_963_9135)">
                <Path
                  d="M2.71517 7.96087L3.96962 9.15654L7.93487 12.7981L9.63487 11.1753C9.70768 11.0719 9.744 10.9472 9.7381 10.8209C9.7322 10.6945 9.68442 10.5738 9.60229 10.4776L8.04112 9.13033L8.04821 9.12679L6.36875 7.52171C6.27352 7.41633 6.22205 7.27862 6.22482 7.13662C6.22758 6.99462 6.28437 6.85901 6.38362 6.75742L10.9099 2.45358L8.85996 0.5L2.718 6.33525C2.60667 6.43935 2.51791 6.56521 2.45723 6.70503C2.39655 6.84485 2.36523 6.99564 2.36523 7.14806C2.36523 7.30048 2.39655 7.45127 2.45723 7.59109C2.51791 7.73091 2.60667 7.85677 2.718 7.96087H2.71517ZM16.2132 10.0413L14.9594 8.84346L10.9963 5.20121L9.2885 6.824C9.21174 6.92581 9.17293 7.05122 9.17875 7.1786C9.18457 7.30597 9.23465 7.42732 9.32037 7.52171L10.8822 8.86117H10.878L12.556 10.4655C12.6503 10.5696 12.7008 10.7061 12.697 10.8465C12.6931 10.9869 12.6353 11.1204 12.5355 11.2192L8.00854 15.5223L10.0705 17.5L16.2117 11.6648C16.3232 11.5607 16.412 11.4349 16.4728 11.295C16.5335 11.1552 16.5648 11.0044 16.5648 10.8519C16.5648 10.6995 16.5335 10.5487 16.4728 10.4088C16.412 10.269 16.3232 10.1432 16.2117 10.0391L16.2132 10.0413Z"
                  fill="white"
                />
              </G>
              <Defs>
                <ClipPath id="clip0_963_9135">
                  <Rect
                    width="17"
                    height="17"
                    fill="white"
                    transform="translate(0.964844 0.5)"
                  />
                </ClipPath>
              </Defs>
            </Svg>
          </Button>
        </BlueCardContainer>
      </TouchableWithoutFeedback>
    </Shadow>
  );
}
