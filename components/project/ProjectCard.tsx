import styled from "styled-components/native";
import { Project } from "../../libs/schema";
import { Line, Path, Svg } from "react-native-svg";
import { Shadow } from "react-native-shadow-2";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { RootNavParamList, TabNavParamList } from "../../navigation/Root";
import { Animated, TouchableWithoutFeedback } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

const ProjectWrapper = styled.View`
  width: 150px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  z-index: 0;
  background-color: #ffffff;
`;

const Logo = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const HoverView = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Title = styled.Text`
  margin-bottom: 5px;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
`;
const Category = styled.Text`
  margin-bottom: 20px;
  font-weight: 400;
  font-size: 12px;
  color: #ffffff;
`;

const SeeMore = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 5px;
`;

const SeeMoreText = styled.Text`
  font-weight: 700;
  font-size: 14px;
  color: #ffffff;
`;

const AnimatedHoverView = Animated.createAnimatedComponent(HoverView);

interface Props {
  data: Project;
}

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavParamList, "Home">,
  NativeStackNavigationProp<RootNavParamList>
>;

export default function ProjectCard({ data }: Props) {
  const navigation = useNavigation<NavigationProps>();
  const backgroundColor = new Animated.Value(0);

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

  const onPress = () => {
    navigation.navigate("Home", {
      screen: "ProjectDetail",
      params: { ...data },
    });
  };
  return (
    <Shadow
      startColor="rgba(0, 0, 0, 0.15)"
      distance={6}
      offset={[0, 3]}
      style={{ borderRadius: 12 }}
    >
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <ProjectWrapper>
          <Logo source={{ uri: data.logoImage }} />
          <AnimatedHoverView style={{ opacity: backgroundColor }}>
            <LinearGradient
              start={{ x: 0, y: 1 }} // 그라데이션 시작 지점
              end={{ x: 0, y: 0 }} // 그라데이션 끝 지점
              colors={["rgba(21, 25, 40, 0.88)", "rgba(49, 56, 96, 0.16)"]} // 그라데이션 색상 배열
              style={{
                left: 0,
                right: 0,
                top: 0,
                height: 150,
                width: 150,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Title>{data.title}</Title>
              <Category>{data.category}</Category>
              <SeeMore>
                <SeeMoreText>See more</SeeMoreText>
                <Svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                  <Path
                    d="M7.83008 2.625L11.7889 6L7.83008 9.375"
                    stroke="white"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M11.2385 6H3.21094"
                    stroke="white"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </SeeMore>
            </LinearGradient>
          </AnimatedHoverView>
        </ProjectWrapper>
      </TouchableWithoutFeedback>
    </Shadow>
  );
}
