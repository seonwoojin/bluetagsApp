import styled from "styled-components/native";
import Dimension from "../libs/useDimension";
import { Shadow } from "react-native-shadow-2";

const ToastWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${Dimension.width * 0.8}px;
  height: 50px;
  padding: 5px 50px;
  border-radius: 3px;
  background-color: white;
  z-index: 99;
`;

const ToastText = styled.Text`
  color: #3733ff;
  font-size: 12px;
  line-height: 15px;
`;

export default function ToastSuccess({ text1 }: { text1: string }) {
  return (
    <Shadow startColor="rgba(0, 0, 0, 0.05)" distance={4}>
      <ToastWrapper>
        <ToastText>{text1}</ToastText>
      </ToastWrapper>
    </Shadow>
  );
}
