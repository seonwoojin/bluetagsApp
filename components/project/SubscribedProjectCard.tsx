import styled from "styled-components/native";
import { Project } from "../../libs/schema";
import { Animated, TouchableWithoutFeedback } from "react-native";
import { Shadow } from "react-native-shadow-2";
import { LinearGradient } from "expo-linear-gradient";

const ProjectWrapper = styled.View`
  position: relative;
  justify-content: center;
  align-items: center;
  min-width: 60px;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  z-index: 0;
`;

const ProjectImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Title = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TitleText = styled.Text`
  font-weight: 700;
  font-size: 8px;
  color: #ffffff;
  text-align: center;
`;

const HoverView = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const AnimatedHoverView = Animated.createAnimatedComponent(HoverView);

interface SliderProps {
  data: Project;
  selected: boolean;
  fn: () => void;
}

export default function SubscribedProjectCard({
  data,
  fn,
  selected,
}: SliderProps) {
  const backgroundColor = new Animated.Value(selected ? 1 : 0);

  const handlePressIn = () => {
    Animated.timing(backgroundColor, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(backgroundColor, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  return (
    <Shadow
      startColor="rgba(0, 0, 0, 0.1)"
      style={{ borderRadius: 12 }}
      distance={4}
      offset={[0, 3]}
    >
      <TouchableWithoutFeedback
        onPress={fn}
        onPressIn={selected ? () => {} : handlePressIn}
        onPressOut={selected ? () => {} : handlePressOut}
      >
        <ProjectWrapper>
          <ProjectImage source={{ uri: data.logoImage }} />
          <AnimatedHoverView style={{ opacity: backgroundColor }}>
            <LinearGradient
              start={{ x: 0, y: 1 }} // 그라데이션 시작 지점
              end={{ x: 0, y: 0 }} // 그라데이션 끝 지점
              colors={["rgba(21, 25, 40, 0.88)", "rgba(49, 56, 96, 0.16)"]} // 그라데이션 색상 배열
              style={{
                left: 0,
                right: 0,
                top: 0,
                height: 60,
                width: 60,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Title>
                <TitleText>{data.title}</TitleText>
              </Title>
            </LinearGradient>
          </AnimatedHoverView>
        </ProjectWrapper>
      </TouchableWithoutFeedback>
    </Shadow>
  );
}
