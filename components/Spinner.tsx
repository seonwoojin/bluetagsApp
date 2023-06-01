import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

const SpinnerWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default function Spinner() {
  return (
    <SpinnerWrapper>
      <ActivityIndicator size={"large"} color={"#0075ff"} />
    </SpinnerWrapper>
  );
}
