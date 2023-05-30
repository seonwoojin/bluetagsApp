import Carousel, { Pagination } from "react-native-snap-carousel";
import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import { useRef, useState } from "react";
import { Project, SocialUser, User } from "../../libs/schema";
import ProjectCardList from "../project/ProjectCardList";

const SwiperContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-bottom: 100px;
`;

interface Props {
  data: Project[][];
  user: User | SocialUser | null;
  setUser: any;
}

const ProjectCardSlider = ({ data, user, setUser }: Props) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carousel = useRef<any>(null);
  return (
    <SwiperContainer>
      <Carousel
        ref={carousel}
        data={data}
        renderItem={({ item, index }) => {
          return <ProjectCardList data={item} user={user} setUser={setUser} />;
        }}
        itemWidth={Math.round(Dimension.width)}
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

export default ProjectCardSlider;
