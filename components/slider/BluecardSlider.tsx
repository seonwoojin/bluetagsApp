import Carousel from "react-native-snap-carousel";
import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import { useRef, useState } from "react";
import { BluecardWithProject } from "../../libs/schema";
import BlueCardMedium from "../bluecard/BlueCardMedium";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HomeStackNavParamList } from "../../navigation/Root";

const SwiperContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-bottom: 15px;
`;

const IndexWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
`;

const Index = styled.Text`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
`;

interface Props {
  data: BluecardWithProject[];
}

const BluecardSlider = ({ data }: Props) => {
  const navigation = useNavigation<NavigationProp<HomeStackNavParamList>>();
  const [activeSlide, setActiveSlide] = useState(0);
  const carousel = useRef<any>(null);
  return (
    <SwiperContainer>
      <Carousel
        ref={carousel}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <BlueCardMedium
              fn={() => {
                navigation.navigate("BluecardDetail", { ...item });
              }}
              projectFn={() => {
                navigation.navigate("ProjectDetail", { ...item.project });
              }}
              data={item}
            />
          );
        }}
        itemWidth={345}
        sliderWidth={Math.round(Dimension.width)}
        horizontal
        loop
        loopClonesPerSide={data.length}
        firstItem={data.length}
        autoplay
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        onSnapToItem={(index) => setActiveSlide(index)}
        enableMomentum={true}
        shouldOptimizeUpdates={false}
      />
      <IndexWrapper>
        <Index>{`${activeSlide + 1} / ${data.length}`}</Index>
      </IndexWrapper>
    </SwiperContainer>
  );
};

export default BluecardSlider;
