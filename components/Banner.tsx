import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text } from "react-native";
import styled from "styled-components/native";
import Dimension from "../libs/useDimension";

const BannerWrapper = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
  width: 90%;
  height: 80px;
`;

const BannerImage = styled.Image`
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

interface Props {
  text: string;
  isHome?: boolean;
  url?: string;
}

export default function Banner({ text, isHome = false, url }: Props) {
  const [banner, setBanner] = useState(1);
  useEffect(() => {
    const number = Math.ceil(Math.random() * 6);
    setBanner(number);
  }, []);
  return (
    <BannerWrapper>
      <BannerImage source={require(`../assets/banner/Banner1.png`)} />
      <Text>{text}</Text>
      <Text>{isHome ? "Bluetags_" : null}</Text>
    </BannerWrapper>
  );
}
