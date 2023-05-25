import Banner from "../components/Banner";
import Dimension from "../libs/useDimension";
import styled from "styled-components/native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Text, View } from "react-native";
import Title from "../components/Title";
import BannerSlider from "../components/slider/BannerSlider";

const Wrapper = styled.ScrollView``;

const Home = () => {
  return (
    <Wrapper>
      <BannerSlider />
      <Title subTitle="New" title="BlueCard" />
    </Wrapper>
  );
};

export default Home;
