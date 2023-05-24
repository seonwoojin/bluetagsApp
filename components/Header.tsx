import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ParamListBase } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { Path, Rect, Svg, WithLocalSvg } from "react-native-svg";

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding-left: 8%;
  padding-right: 8%;
`;

const UserContainer = styled.View`
  flex-direction: row;
`;

const SearchButton = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const User = styled.View`
  justify-content: center;
  align-items: center;
`;

interface Props {
  navigation: BottomTabNavigationProp<ParamListBase>;
}

const Header = ({ navigation }: Props) => {
  return (
    <Wrapper>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("Tabs", {
            screen: "Home",
          });
        }}
      >
        <WithLocalSvg
          width={104}
          fill={"#000000"}
          asset={require("../assets/logo.svg")}
        />
      </TouchableWithoutFeedback>
      <UserContainer>
        <SearchButton>
          <Svg width="19" height="19" viewBox="0 0 19 19">
            <Path
              d="M13.5 12H12.71L12.43 11.73C13.0549 11.0039 13.5117 10.1487 13.7675 9.22559C14.0234 8.30243 14.072 7.33413 13.91 6.38998C13.44 3.60998 11.12 1.38997 8.31997 1.04997C7.33559 0.925441 6.33576 1.02775 5.397 1.34906C4.45824 1.67038 3.60542 2.20219 2.90381 2.90381C2.20219 3.60542 1.67038 4.45824 1.34906 5.397C1.02775 6.33576 0.925441 7.33559 1.04997 8.31997C1.38997 11.12 3.60998 13.44 6.38998 13.91C7.33413 14.072 8.30243 14.0234 9.22559 13.7675C10.1487 13.5117 11.0039 13.0549 11.73 12.43L12 12.71V13.5L16.25 17.75C16.66 18.16 17.33 18.16 17.74 17.75C18.15 17.34 18.15 16.67 17.74 16.26L13.5 12ZM7.49997 12C5.00997 12 2.99997 9.98997 2.99997 7.49997C2.99997 5.00997 5.00997 2.99997 7.49997 2.99997C9.98997 2.99997 12 5.00997 12 7.49997C12 9.98997 9.98997 12 7.49997 12Z"
              fill="#0075ff"
            />
          </Svg>
        </SearchButton>
        <User>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.navigate("Stack", {
                screen: "SignIn",
              });
            }}
          >
            <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15 8C15 9.06087 14.5786 10.0783 13.8284 10.8284C13.0783 11.5786 12.0609 12 11 12C9.93913 12 8.92172 11.5786 8.17157 10.8284C7.42143 10.0783 7 9.06087 7 8C7 6.93913 7.42143 5.92172 8.17157 5.17157C8.92172 4.42143 9.93913 4 11 4C12.0609 4 13.0783 4.42143 13.8284 5.17157C14.5786 5.92172 15 6.93913 15 8ZM13 8C13 8.53043 12.7893 9.03914 12.4142 9.41421C12.0391 9.78929 11.5304 10 11 10C10.4696 10 9.96086 9.78929 9.58579 9.41421C9.21071 9.03914 9 8.53043 9 8C9 7.46957 9.21071 6.96086 9.58579 6.58579C9.96086 6.21071 10.4696 6 11 6C11.5304 6 12.0391 6.21071 12.4142 6.58579C12.7893 6.96086 13 7.46957 13 8Z"
                fill="#BABCBF"
              />
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM2 11C2 13.09 2.713 15.014 3.908 16.542C4.74723 15.4399 5.8299 14.5467 7.07143 13.9323C8.31297 13.3179 9.67974 12.9988 11.065 13C12.4323 12.9987 13.7819 13.3095 15.0109 13.9088C16.2399 14.508 17.316 15.3799 18.157 16.458C19.0234 15.3216 19.6068 13.9952 19.8589 12.5886C20.111 11.182 20.0244 9.73553 19.6065 8.36898C19.1886 7.00243 18.4512 5.75505 17.4555 4.73004C16.4598 3.70503 15.2343 2.93186 13.8804 2.47451C12.5265 2.01716 11.0832 1.88877 9.66986 2.09997C8.25652 2.31117 6.91379 2.85589 5.75277 3.68905C4.59175 4.52222 3.64581 5.61987 2.99323 6.8912C2.34065 8.16252 2.00018 9.57097 2 11ZM11 20C8.93395 20.0031 6.93027 19.2923 5.328 17.988C5.97293 17.0647 6.83134 16.3109 7.83019 15.7907C8.82905 15.2705 9.93879 14.9992 11.065 15C12.1772 14.9991 13.2735 15.2636 14.2629 15.7714C15.2524 16.2793 16.1064 17.0159 16.754 17.92C15.1393 19.2667 13.1026 20.0029 11 20Z"
                fill="#BABCBF"
              />
            </Svg>
          </TouchableWithoutFeedback>
        </User>
      </UserContainer>
    </Wrapper>
  );
};

export default Header;
