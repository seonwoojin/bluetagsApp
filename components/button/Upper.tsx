import { Path, Svg } from "react-native-svg";
import styled from "styled-components/native";

const UpperWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: white;
`;

export default function Upper() {
  return (
    <UpperWrapper>
      <Svg width={15} height={15} viewBox="0 0 384 512">
        <Path d="M209.5 39.6C204.9 34.7 198.6 32 192 32s-12.9 2.7-17.5 7.6l-128 136c-9.1 9.7-8.6 24.8 1 33.9s24.8 8.6 33.9-1L168 116.5V200 328c0 13.3 10.7 24 24 24s24-10.7 24-24V200 116.5l86.5 91.9c9.1 9.7 24.3 10.1 33.9 1s10.1-24.3 1-33.9l-128-136zM24 432c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H24z" />
      </Svg>
    </UpperWrapper>
  );
}
