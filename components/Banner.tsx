import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text } from "react-native";
import styled from "styled-components/native";
import Dimension from "../libs/useDimension";

const BannerWrapper = styled.View`
  align-items: flex-start;
  justify-content: center;
  width: ${Math.round(Dimension.width * 0.9)}px;
  height: 80px;
`;

const BannerImage = styled.Image`
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
`;

const BannerText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: 400;
  padding-left: 20px;
`;

interface Props {
  text: string;
  isHome?: boolean;
  url?: any;
  children?: React.ReactNode;
}

const data = [
  require(`../assets/banner/Banner1.png`),
  require(`../assets/banner/Banner2.png`),
  require(`../assets/banner/Banner3.png`),
  require(`../assets/banner/Banner4.png`),
];

export default function Banner({ text, isHome = false, url, children }: Props) {
  const [banner, setBanner] = useState(1);
  useEffect(() => {
    const number = Math.ceil(Math.random() * 4);
    setBanner(number);
  }, []);
  return (
    <BannerWrapper>
      <BannerImage
        source={
          url
            ? typeof url === "string"
              ? { uri: url }
              : url
            : require(`../assets/banner/Banner1.png`)
        }
      />
      <BannerText>{text}</BannerText>
      {isHome ? <BannerText>Bluetags_</BannerText> : null}
      {children}
    </BannerWrapper>
  );
}
