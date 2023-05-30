import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ParamListBase } from "@react-navigation/native";
import { TextInput, TouchableWithoutFeedback, View } from "react-native";
import styled from "styled-components/native";
import { Circle, Path, Svg } from "react-native-svg";
import Logo from "./Logo";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUser } from "../libs/context";
import { useRef, useState } from "react";
import Dimension from "../libs/useDimension";
import onNext from "../libs/nextRef";

const Wrapper = styled.View`
  position: relative;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding-left: 5%;
  padding-right: 5%;
  background-color: white;
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

const SearchForm = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${Dimension.width * 0.9 - 150}px;
  height: 40px;
  border-radius: 4px;
  border: 2px solid #2e57ff;
  background-color: rgba(255, 255, 255, 0.1);
  position: relative;
`;

const SearchInput = styled.TextInput`
  width: 100%;
  height: 100%;
  margin-right: 20px;
  padding: 0 10px;
  font-size: 12px;
  color: #2e57ff;
  font-weight: 700;
`;

interface Props {
  navigation:
    | BottomTabNavigationProp<ParamListBase>
    | NativeStackNavigationProp<ParamListBase>;
  detail: boolean;
  setDetail: React.Dispatch<React.SetStateAction<boolean>>;
  notice: boolean;
  setNotice: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({
  navigation,
  detail,
  setDetail,
  notice,
  setNotice,
}: Props) => {
  const { user, setUser } = useUser();
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<TextInput>(null);

  return (
    <Wrapper>
      <View
        style={{
          display: search ? "flex" : "none",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setSearch((prev) => !prev);
            searchRef.current?.blur();
          }}
        >
          <Svg
            width={20}
            height={20}
            fill={"#0075ff"}
            style={{ opacity: 0.8, marginRight: 10 }}
            viewBox="0 0 448 512"
          >
            <Path d="M448 256C448 264.8 440.6 272 431.4 272H54.11l140.7 149.3c6.157 6.531 5.655 16.66-1.118 22.59C190.5 446.6 186.5 448 182.5 448c-4.505 0-9.009-1.75-12.28-5.25l-165.9-176c-5.752-6.094-5.752-15.41 0-21.5l165.9-176c6.19-6.562 16.69-7 23.45-1.094c6.773 5.938 7.275 16.06 1.118 22.59L54.11 240h377.3C440.6 240 448 247.2 448 256z" />
          </Svg>
        </TouchableWithoutFeedback>
        <SearchForm>
          <SearchInput
            ref={searchRef}
            autoCapitalize="none"
            onChangeText={(text) => setQuery(text)}
            onSubmitEditing={() => {
              if (query !== "") navigation.navigate("Search", { query });
            }}
            value={query}
            placeholder="Search..."
          />
        </SearchForm>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate("Home", { screen: "Main" });
        }}
      >
        <View style={{ display: search ? "none" : "flex" }}>
          <Logo />
        </View>
      </TouchableWithoutFeedback>
      <UserContainer>
        <TouchableWithoutFeedback
          onPress={() => {
            if (!search) {
              setSearch((prev) => !prev);
              onNext(searchRef);
            } else {
              if (query !== "") navigation.navigate("Search", { query });
            }
          }}
        >
          <SearchButton>
            <Svg width="19" height="19" viewBox="0 0 19 19">
              <Path
                d="M13.5 12H12.71L12.43 11.73C13.0549 11.0039 13.5117 10.1487 13.7675 9.22559C14.0234 8.30243 14.072 7.33413 13.91 6.38998C13.44 3.60998 11.12 1.38997 8.31997 1.04997C7.33559 0.925441 6.33576 1.02775 5.397 1.34906C4.45824 1.67038 3.60542 2.20219 2.90381 2.90381C2.20219 3.60542 1.67038 4.45824 1.34906 5.397C1.02775 6.33576 0.925441 7.33559 1.04997 8.31997C1.38997 11.12 3.60998 13.44 6.38998 13.91C7.33413 14.072 8.30243 14.0234 9.22559 13.7675C10.1487 13.5117 11.0039 13.0549 11.73 12.43L12 12.71V13.5L16.25 17.75C16.66 18.16 17.33 18.16 17.74 17.75C18.15 17.34 18.15 16.67 17.74 16.26L13.5 12ZM7.49997 12C5.00997 12 2.99997 9.98997 2.99997 7.49997C2.99997 5.00997 5.00997 2.99997 7.49997 2.99997C9.98997 2.99997 12 5.00997 12 7.49997C12 9.98997 9.98997 12 7.49997 12Z"
                fill="#0075ff"
              />
            </Svg>
          </SearchButton>
        </TouchableWithoutFeedback>
        {user ? (
          <>
            <User>
              <TouchableWithoutFeedback
                onPress={() => {
                  setNotice((prev) => !prev);
                  setDetail(false);
                }}
              >
                <Svg
                  style={{ marginRight: 20 }}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <Path
                    d="M12.0199 20.5319C9.68987 20.5319 7.35987 20.1619 5.14987 19.4219C4.30987 19.1319 3.66987 18.5419 3.38987 17.7719C3.09987 17.0019 3.19987 16.1519 3.65987 15.3919L4.80987 13.4819C5.04987 13.0819 5.26987 12.2819 5.26987 11.8119V8.92188C5.26987 5.20187 8.29987 2.17188 12.0199 2.17188C15.7399 2.17188 18.7699 5.20187 18.7699 8.92188V11.8119C18.7699 12.2719 18.9899 13.0819 19.2299 13.4919L20.3699 15.3919C20.7999 16.1119 20.8799 16.9819 20.5899 17.7719C20.2999 18.5619 19.6699 19.1619 18.8799 19.4219C16.6799 20.1619 14.3499 20.5319 12.0199 20.5319ZM12.0199 3.67188C9.12987 3.67188 6.76987 6.02187 6.76987 8.92188V11.8119C6.76987 12.5419 6.46987 13.6219 6.09987 14.2519L4.94987 16.1619C4.72987 16.5319 4.66987 16.9219 4.79987 17.2519C4.91987 17.5919 5.21987 17.8519 5.62987 17.9919C9.80987 19.3919 14.2399 19.3919 18.4199 17.9919C18.7799 17.8719 19.0599 17.6019 19.1899 17.2419C19.3199 16.8819 19.2899 16.4919 19.0899 16.1619L17.9399 14.2519C17.5599 13.6019 17.2699 12.5319 17.2699 11.8019V8.92188C17.2699 6.02187 14.9199 3.67188 12.0199 3.67188Z"
                    fill="#0075ff"
                  />
                  <Path
                    d="M13.8806 3.93969C13.8106 3.93969 13.7406 3.92969 13.6706 3.90969C13.3806 3.82969 13.1006 3.76969 12.8306 3.72969C11.9806 3.61969 11.1606 3.67969 10.3906 3.90969C10.1106 3.99969 9.8106 3.90969 9.6206 3.69969C9.4306 3.48969 9.3706 3.18969 9.4806 2.91969C9.8906 1.86969 10.8906 1.17969 12.0306 1.17969C13.1706 1.17969 14.1706 1.85969 14.5806 2.91969C14.6806 3.18969 14.6306 3.48969 14.4406 3.69969C14.2906 3.85969 14.0806 3.93969 13.8806 3.93969Z"
                    fill="#0075ff"
                  />
                  <Path
                    d="M12.0195 22.8086C11.0295 22.8086 10.0695 22.4086 9.36953 21.7086C8.66953 21.0086 8.26953 20.0486 8.26953 19.0586H9.76953C9.76953 19.6486 10.0095 20.2286 10.4295 20.6486C10.8495 21.0686 11.4295 21.3086 12.0195 21.3086C13.2595 21.3086 14.2695 20.2986 14.2695 19.0586H15.7695C15.7695 21.1286 14.0895 22.8086 12.0195 22.8086Z"
                    fill="#0075ff"
                  />
                  <Circle
                    cx="18.5"
                    cy="4.5"
                    r="4"
                    fill="#F3802D"
                    stroke="white"
                  />
                </Svg>
              </TouchableWithoutFeedback>
            </User>
            <User>
              <TouchableWithoutFeedback
                onPress={() => {
                  setDetail((prev) => !prev);
                  setNotice(false);
                }}
              >
                <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15 8C15 9.06087 14.5786 10.0783 13.8284 10.8284C13.0783 11.5786 12.0609 12 11 12C9.93913 12 8.92172 11.5786 8.17157 10.8284C7.42143 10.0783 7 9.06087 7 8C7 6.93913 7.42143 5.92172 8.17157 5.17157C8.92172 4.42143 9.93913 4 11 4C12.0609 4 13.0783 4.42143 13.8284 5.17157C14.5786 5.92172 15 6.93913 15 8ZM13 8C13 8.53043 12.7893 9.03914 12.4142 9.41421C12.0391 9.78929 11.5304 10 11 10C10.4696 10 9.96086 9.78929 9.58579 9.41421C9.21071 9.03914 9 8.53043 9 8C9 7.46957 9.21071 6.96086 9.58579 6.58579C9.96086 6.21071 10.4696 6 11 6C11.5304 6 12.0391 6.21071 12.4142 6.58579C12.7893 6.96086 13 7.46957 13 8Z"
                    fill="#0075ff"
                  />
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0ZM2 11C2 13.09 2.713 15.014 3.908 16.542C4.74723 15.4399 5.8299 14.5467 7.07143 13.9323C8.31297 13.3179 9.67974 12.9988 11.065 13C12.4323 12.9987 13.7819 13.3095 15.0109 13.9088C16.2399 14.508 17.316 15.3799 18.157 16.458C19.0234 15.3216 19.6068 13.9952 19.8589 12.5886C20.111 11.182 20.0244 9.73553 19.6065 8.36898C19.1886 7.00243 18.4512 5.75505 17.4555 4.73004C16.4598 3.70503 15.2343 2.93186 13.8804 2.47451C12.5265 2.01716 11.0832 1.88877 9.66986 2.09997C8.25652 2.31117 6.91379 2.85589 5.75277 3.68905C4.59175 4.52222 3.64581 5.61987 2.99323 6.8912C2.34065 8.16252 2.00018 9.57097 2 11ZM11 20C8.93395 20.0031 6.93027 19.2923 5.328 17.988C5.97293 17.0647 6.83134 16.3109 7.83019 15.7907C8.82905 15.2705 9.93879 14.9992 11.065 15C12.1772 14.9991 13.2735 15.2636 14.2629 15.7714C15.2524 16.2793 16.1064 17.0159 16.754 17.92C15.1393 19.2667 13.1026 20.0029 11 20Z"
                    fill="#0075ff"
                  />
                </Svg>
              </TouchableWithoutFeedback>
            </User>
          </>
        ) : (
          <>
            <User>
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate("SignIn");
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
          </>
        )}
      </UserContainer>
    </Wrapper>
  );
};

export default Header;
