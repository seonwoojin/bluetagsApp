import Carousel, { Pagination } from "react-native-snap-carousel";
import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import { useRef, useState } from "react";
import { BluecardWithProject, User } from "../../libs/schema";
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
                navigation.navigate("BluecardDetail", { data: { ...item } });
              }}
              projectFn={() => {
                navigation.navigate("ProjectDetail", { ...item.project });
              }}
              data={item}
            />
          );
        }}
        itemWidth={345}
        containerCustomStyle={{ marginLeft: 10 }}
        slideStyle={{ marginBottom: 30, marginTop: 10 }}
        sliderWidth={Math.round(Dimension.height)}
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
      <Pagination
        carouselRef={carousel.current}
        tappableDots={true}
        dotsLength={data.length}
        activeDotIndex={activeSlide}
        containerStyle={{ paddingVertical: 10 }}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 5,
          backgroundColor: "rgb(64, 64, 64)",
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={1}
      />
    </SwiperContainer>
  );
};

export default BluecardSlider;
