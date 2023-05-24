import Swiper from "react-native-swiper";
import Banner from "../components/Banner";
import Dimension from "../libs/useDimension";
import styled from "styled-components/native";

const Wrapper = styled.ScrollView``;
const Home = () => {
  return (
    <Wrapper>
      <Swiper
        horizontal
        loop
        autoplay
        autoplayTimeout={3.5}
        showsButtons={false}
        showsPagination={false}
        containerStyle={{
          marginBottom: 40,
          width: "100%",
          height: 80,
        }}
      >
        <Banner isHome={true} text="Inspiring NFT experience" />
        <Banner isHome={true} text="Inspiring NFT experience" />
        <Banner isHome={true} text="Inspiring NFT experience" />
        <Banner isHome={true} text="Inspiring NFT experience" />
      </Swiper>
    </Wrapper>
  );
};

export default Home;
