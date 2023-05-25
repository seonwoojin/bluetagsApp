import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text } from "react-native";
import styled from "styled-components/native";
import Dimension from "../libs/useDimension";

const BannerWrapper = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 80px;
`;

const BannerImage = styled.Image`
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
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
  url: any;
}

export default function Banner({ text, isHome = false, url }: Props) {
  return (
    <BannerWrapper>
      <BannerImage source={url} />
      <BannerText>{text}</BannerText>
      <BannerText>{isHome ? "Bluetags_" : null}</BannerText>
    </BannerWrapper>
  );
}
