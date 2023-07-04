import { ScrollView } from "react-native";
import { Shadow } from "react-native-shadow-2";
import Svg, { Path } from "react-native-svg";
import styled from "styled-components/native";

const Index = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 230px;
  height: 80px;
  padding: 15px 20px;
  border-radius: 15px;
  background-color: #ffffff;
`;

const IndexTitleContainer = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  width: auto;
  height: 100%;
`;

const IndexTitle = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IndexTitleText = styled.Text`
  font-size: 14px;
  color: #a0aec0;
`;

const IndexNumber = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const IndexNumberTextFirst = styled.Text`
  font-size: 18px;
  color: #2d3748;
  margin-right: 10px;
  text-align: center;
`;

const IndexNumberTextSecond = styled.Text<{ num: number }>`
  font-size: 14px;
  color: ${(props) => (props.num >= 0 ? "#48bb78" : "#E53E3E")};
  text-align: center;
`;

const IconContainer = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  background: #257cff;
  box-shadow: 0px 3.5px 5.5px rgba(0, 0, 0, 0.02);
  border-radius: 12px;
`;

interface Props {
  info: {
    totalBluecards: number;
    totalEvents: number;
    updatedBluecards: number;
    updatedEvents: number;
    btcPrice: {
      percent_change_24h: number;
      price: number;
    };
    ethPrice: {
      percent_change_24h: number;
      price: number;
    };
  };
}

export default function IndexInfo({ info }: Props) {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 10,
        marginBottom: 10,
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    >
      <Shadow
        startColor="rgba(0, 0, 0, 0.16)"
        distance={2.2}
        offset={[0, 0.7]}
        style={{
          borderRadius: 15,
        }}
      >
        <Index>
          <IndexTitleContainer>
            <IndexTitle>
              <IndexTitleText>Total Bluecards</IndexTitleText>
            </IndexTitle>
            <IndexNumber>
              <IndexNumberTextFirst>
                {info.totalBluecards.toLocaleString()}
              </IndexNumberTextFirst>
              <IndexNumberTextSecond num={info.updatedBluecards}>
                {info.updatedBluecards >= 0
                  ? `+${info.updatedBluecards.toLocaleString()}`
                  : `-${info.updatedBluecards.toLocaleString()}`}
              </IndexNumberTextSecond>
            </IndexNumber>
          </IndexTitleContainer>
          <IconContainer>
            <Svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <Path
                d="M1.1941 5.10379C0.0512732 5.76543 -0.339695 7.22619 0.321944 8.37332L7.49686 20.8027C8.1585 21.9455 9.61927 22.3408 10.7664 21.6791L19.0498 16.893C20.1926 16.2314 20.5879 14.7706 19.9262 13.6235L12.7513 1.1941C12.0897 0.0512732 10.6246 -0.339695 9.48178 0.321944L1.1941 5.10379ZM19.7372 18.0831L13.9242 21.4386C14.341 21.7866 14.878 21.9971 15.4666 21.9971H25.0905C26.418 21.9971 27.4964 20.9187 27.4964 19.5911V5.15535C27.4964 3.82777 26.418 2.74939 25.0905 2.74939H15.4666C15.3893 2.74939 15.3162 2.75368 15.2389 2.75798L21.1163 12.9361C22.156 14.7362 21.5374 17.0434 19.7372 18.0831Z"
                fill="white"
              />
            </Svg>
          </IconContainer>
        </Index>
      </Shadow>
      <Shadow
        startColor="rgba(0, 0, 0, 0.16)"
        distance={2.2}
        offset={[0, 0.7]}
        style={{
          borderRadius: 15,
        }}
      >
        <Index>
          <IndexTitleContainer>
            <IndexTitle>
              <IndexTitleText>Total Events</IndexTitleText>
            </IndexTitle>
            <IndexNumber>
              <IndexNumberTextFirst>
                {info.totalEvents.toLocaleString()}
              </IndexNumberTextFirst>
              <IndexNumberTextSecond num={info.updatedEvents}>
                {info.updatedEvents >= 0
                  ? `+${info.updatedEvents.toLocaleString()}`
                  : `-${info.updatedEvents.toLocaleString()}`}
              </IndexNumberTextSecond>
            </IndexNumber>
          </IndexTitleContainer>
          <IconContainer>
            <Svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <Path
                d="M1.1941 5.10379C0.0512732 5.76543 -0.339695 7.22619 0.321944 8.37332L7.49686 20.8027C8.1585 21.9455 9.61927 22.3408 10.7664 21.6791L19.0498 16.893C20.1926 16.2314 20.5879 14.7706 19.9262 13.6235L12.7513 1.1941C12.0897 0.0512732 10.6246 -0.339695 9.48178 0.321944L1.1941 5.10379ZM19.7372 18.0831L13.9242 21.4386C14.341 21.7866 14.878 21.9971 15.4666 21.9971H25.0905C26.418 21.9971 27.4964 20.9187 27.4964 19.5911V5.15535C27.4964 3.82777 26.418 2.74939 25.0905 2.74939H15.4666C15.3893 2.74939 15.3162 2.75368 15.2389 2.75798L21.1163 12.9361C22.156 14.7362 21.5374 17.0434 19.7372 18.0831Z"
                fill="white"
              />
            </Svg>
          </IconContainer>
        </Index>
      </Shadow>
      <Shadow
        startColor="rgba(0, 0, 0, 0.16)"
        distance={2.2}
        offset={[0, 0.7]}
        style={{
          borderRadius: 15,
        }}
      >
        <Index>
          <IndexTitleContainer>
            <IndexTitle>
              <IndexTitleText>BTC Price</IndexTitleText>
            </IndexTitle>
            <IndexNumber>
              <IndexNumberTextFirst>{`$${info.btcPrice.price
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</IndexNumberTextFirst>
              <IndexNumberTextSecond num={info.btcPrice.percent_change_24h}>
                {info.btcPrice.percent_change_24h > 0
                  ? `+${info.btcPrice.percent_change_24h}%`
                  : `${info.btcPrice.percent_change_24h}%`}
              </IndexNumberTextSecond>
            </IndexNumber>
          </IndexTitleContainer>
          <IconContainer>
            <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <Path
                d="M22 11C22 17.0751 17.0751 22 11 22C4.92485 22 0 17.0751 0 11C0 4.92485 4.92485 0 11 0C17.0751 0 22 4.92485 22 11ZM15.7171 9.43294C15.9361 7.96928 14.8215 7.18242 13.2975 6.65753L13.7919 4.67478L12.5849 4.37401L12.1036 6.30451C11.7863 6.22542 11.4604 6.15086 11.1365 6.07697L11.6213 4.13378L10.4149 3.83301L9.92023 5.81505C9.65756 5.75522 9.39972 5.69609 9.14947 5.63391L9.15085 5.6277L7.48621 5.21209L7.16512 6.50113C7.16512 6.50113 8.06069 6.70636 8.0418 6.71905C8.53068 6.84107 8.61903 7.16455 8.60422 7.42096L8.04109 9.67973C8.0748 9.68834 8.11844 9.70071 8.16657 9.71996C8.12634 9.70998 8.08336 9.69898 8.039 9.68834L7.24967 12.8525C7.18983 13.001 7.03823 13.2238 6.69652 13.1392C6.70854 13.1568 5.81918 12.9203 5.81918 12.9203L5.21994 14.3018L6.79073 14.6933C7.08294 14.7665 7.36933 14.8432 7.65121 14.9153L7.15169 16.9207L8.35734 17.2215L8.85203 15.2374C9.17176 15.324 9.49242 15.4072 9.81395 15.487L9.32095 17.4618L10.528 17.7626L11.0275 15.7609C13.0857 16.1504 14.6335 15.9933 15.2849 14.1319C15.8099 12.6331 15.2588 11.7686 14.1759 11.2049C14.9645 11.0231 15.5586 10.5044 15.7171 9.43294ZM12.9592 13.2998C12.5862 14.7985 10.0625 13.9883 9.2443 13.7851L9.90714 11.1283C10.7253 11.3325 13.3491 11.7367 12.9592 13.2998ZM13.3326 9.4113C12.9922 10.7746 10.8917 10.0819 10.2103 9.91215L10.8112 7.50249C11.4926 7.67228 13.687 7.98919 13.3326 9.4113Z"
                fill="white"
              />
            </Svg>
          </IconContainer>
        </Index>
      </Shadow>
      <Shadow
        startColor="rgba(0, 0, 0, 0.16)"
        distance={2.2}
        offset={[0, 0.7]}
        style={{
          borderRadius: 15,
        }}
      >
        <Index>
          <IndexTitleContainer>
            <IndexTitle>
              <IndexTitleText>ETH Price</IndexTitleText>
            </IndexTitle>
            <IndexNumber>
              <IndexNumberTextFirst>{`$${info.ethPrice.price
                .toFixed(0)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</IndexNumberTextFirst>
              <IndexNumberTextSecond num={info.ethPrice.percent_change_24h}>
                {info.ethPrice.percent_change_24h > 0
                  ? `+${info.ethPrice.percent_change_24h}%`
                  : `${info.ethPrice.percent_change_24h}%`}
              </IndexNumberTextSecond>
            </IndexNumber>
          </IndexTitleContainer>
          <IconContainer>
            <Svg width="14" height="22" viewBox="0 0 14 22" fill="none">
              <Path
                d="M13.0582 11.2062L6.53125 15.1938L0 11.2062L6.53125 0L13.0582 11.2062ZM6.53125 16.4742L0 12.4867L6.53125 22L13.0625 12.4867L6.53125 16.4742Z"
                fill="white"
              />
            </Svg>
          </IconContainer>
        </Index>
      </Shadow>
    </ScrollView>
  );
}
