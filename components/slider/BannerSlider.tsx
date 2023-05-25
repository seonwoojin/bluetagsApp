import Carousel, { Pagination } from "react-native-snap-carousel";
import styled from "styled-components/native";
import Banner from "../Banner";
import Dimension from "../../libs/useDimension";
import { useRef, useState } from "react";
import { FlatListProps } from "react-native";

const SwiperContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-bottom: 15px;
`;

const data = [
  require(`./../../assets/banner/Banner1.png`),
  require(`./../../assets/banner/Banner2.png`),
  require(`./../../assets/banner/Banner3.png`),
  require(`./../../assets/banner/Banner4.png`),
];

const BannerSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carousel = useRef<any>(null);
  return (
    <SwiperContainer>
      <Carousel
        ref={carousel}
        useScrollView={true}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <Banner
              isHome={true}
              text={"Inspiring NFT experience"}
              url={item}
            />
          );
        }}
        itemWidth={Math.round(Dimension.width * 0.9)}
        sliderWidth={Math.round(Dimension.width)}
        horizontal
        loop
        loopClonesPerSide={data.length}
        firstItem={data.length}
        autoplay
        inactiveSlideOpacity={0}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          paddingTop: 15,
          paddingBottom: 15,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
        }}
        tappableDots={carousel.current ? true : false}
        inactiveDotColor={"rgba(0, 0, 0, 1)"}
        dotColor={"rgba(0, 0, 0, 1)"}
        activeOpacity={1}
        inactiveDotOpacity={0.3}
        inactiveDotScale={1}
        carouselRef={carousel.current ? carousel.current : null}
      />
    </SwiperContainer>
  );
};

export default BannerSlider;
