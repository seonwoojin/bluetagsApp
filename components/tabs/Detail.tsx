import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import Constants from "expo-constants";
import {
  TouchableWithoutFeedback,
  Animated,
  Easing,
  TouchableHighlight,
} from "react-native";
import { Path, Rect, Svg } from "react-native-svg";
import { useUser } from "../../libs/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HomeStackNavParamList } from "../../navigation/Root";

const Overlay = styled.View`
  position: absolute;
  width: ${Dimension.width}px;
  height: ${Dimension.height * 1.2}px;
  top: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.3);
`;

const UserTextDetail = styled.View`
  position: absolute;
  top: ${Constants.statusBarHeight}px;
  right: 0;
  width: ${Dimension.width * 0.8}px;
  height: ${Dimension.height}px;
  padding-top: 20px;
  overflow: hidden;
  border-radius: 10px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  background-color: #ffffff;
  z-index: 60;
`;

const Exit = styled.View`
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 40px;
  padding-right: 20px;
`;

const UserProfileWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100px;
  padding-left: 10px;
`;

const UserProfile = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  overflow: hidden;
`;

const UserProfileImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const UserProfileText = styled.Text`
  color: #191f28;
  font-weight: 400;
  font-size: 20px;
  font-weight: 500;
  margin-left: 15px;
`;

const UserDetail = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 60px;
  padding-left: 20px;
`;

const UserDetailText = styled.Text`
  color: #191f28;
  font-weight: 400;
  font-size: 14px;
`;

const AnimatedUserTextDetail = Animated.createAnimatedComponent(UserTextDetail);

interface Props {
  detail: boolean;
  setDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Detail({ detail, setDetail }: Props) {
  const { user, setUser, setToken } = useUser();
  const navigation = useNavigation<NavigationProp<HomeStackNavParamList>>();
  const X = new Animated.Value(Dimension.width * 0.8);

  const opacity = X.interpolate({
    inputRange: [0, Dimension.width * 0.8],
    outputRange: [1, 0],
  });

  const moveLeft = () => {
    Animated.timing(X, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };
  const moveRight = () => {
    Animated.timing(X, {
      toValue: Dimension.width * 0.8,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    moveLeft();
  }, []);

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          moveRight();
          setTimeout(() => setDetail((prev) => !prev), 300);
        }}
      >
        <Overlay />
      </TouchableWithoutFeedback>
      <AnimatedUserTextDetail
        style={{ transform: [{ translateX: X }], opacity }}
      >
        <Exit>
          <TouchableWithoutFeedback
            onPress={() => {
              moveRight();
              setTimeout(() => setDetail((prev) => !prev), 300);
            }}
          >
            <Svg fill={"black"} width={25} height={25} viewBox="0 0 384 512">
              <Path d="M378.4 440.6c8.531 10.16 7.203 25.28-2.938 33.81C370.9 478.2 365.5 480 360 480c-6.844 0-13.64-2.906-18.39-8.562L192 293.3l-149.6 178.1C37.63 477.1 30.83 480 23.98 480c-5.453 0-10.92-1.844-15.42-5.625c-10.14-8.531-11.47-23.66-2.938-33.81L160.7 256L5.625 71.44C-2.906 61.28-1.578 46.16 8.563 37.63C18.69 29.08 33.84 30.39 42.38 40.56L192 218.7l149.6-178.1c8.547-10.17 23.67-11.47 33.81-2.938s11.47 23.66 2.938 33.81L223.3 256L378.4 440.6z" />
            </Svg>
          </TouchableWithoutFeedback>
        </Exit>
        <TouchableHighlight
          underlayColor={"rgba(121, 183, 255, 0.3)"}
          onPress={() => {
            navigation.navigate("UserDetail");
            setDetail(false);
          }}
        >
          <UserProfileWrapper>
            <UserProfile>
              {user!.profile === "" ? (
                <Svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <Rect width="40" height="40" rx="20" fill="#DDDDDD" />
                </Svg>
              ) : (
                <UserProfileImage
                  source={{
                    uri: user!.profile.includes("googleusercontent")
                      ? user!.profile
                      : `https://imagedelivery.net/o9OxHWpSBsqZquvzmxx1bQ/${
                          user!.profile
                        }/avatar`,
                  }}
                />
              )}
            </UserProfile>
            <UserProfileText>{user!.name}</UserProfileText>
          </UserProfileWrapper>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={"rgba(121, 183, 255, 0.3)"}
          onPress={() => {}}
        >
          <UserDetail>
            <Svg
              width={20}
              height={20}
              fill={"black"}
              style={{ marginRight: 15 }}
              viewBox="0 0 512 512"
            >
              <Path d="M160 256C160 202.1 202.1 160 256 160C309 160 352 202.1 352 256C352 309 309 352 256 352C202.1 352 160 309 160 256zM256 208C229.5 208 208 229.5 208 256C208 282.5 229.5 304 256 304C282.5 304 304 282.5 304 256C304 229.5 282.5 208 256 208zM293.1 .0003C315.3 .0003 334.6 15.19 339.8 36.74L347.6 69.21C356.1 73.36 364.2 78.07 371.9 83.28L404 73.83C425.3 67.56 448.1 76.67 459.2 95.87L496.3 160.1C507.3 179.3 503.8 203.6 487.8 218.9L463.5 241.1C463.8 246.6 464 251.3 464 256C464 260.7 463.8 265.4 463.5 270L487.8 293.1C503.8 308.4 507.3 332.7 496.3 351.9L459.2 416.1C448.1 435.3 425.3 444.4 404 438.2L371.9 428.7C364.2 433.9 356.1 438.6 347.6 442.8L339.8 475.3C334.6 496.8 315.3 512 293.1 512H218.9C196.7 512 177.4 496.8 172.2 475.3L164.4 442.8C155.9 438.6 147.8 433.9 140.1 428.7L107.1 438.2C86.73 444.4 63.94 435.3 52.85 416.1L15.75 351.9C4.66 332.7 8.168 308.4 24.23 293.1L48.47 270C48.16 265.4 48 260.7 48 255.1C48 251.3 48.16 246.6 48.47 241.1L24.23 218.9C8.167 203.6 4.66 179.3 15.75 160.1L52.85 95.87C63.94 76.67 86.73 67.56 107.1 73.83L140.1 83.28C147.8 78.07 155.9 73.36 164.4 69.21L172.2 36.74C177.4 15.18 196.7 0 218.9 0L293.1 .0003zM205.5 103.6L194.3 108.3C181.6 113.6 169.8 120.5 159.1 128.7L149.4 136.1L94.42 119.9L57.31 184.1L98.81 223.6L97.28 235.6C96.44 242.3 96 249.1 96 256C96 262.9 96.44 269.7 97.28 276.4L98.81 288.4L57.32 327.9L94.42 392.1L149.4 375.9L159.1 383.3C169.8 391.5 181.6 398.4 194.3 403.7L205.5 408.4L218.9 464H293.1L306.5 408.4L317.7 403.7C330.4 398.4 342.2 391.5 352.9 383.3L362.6 375.9L417.6 392.1L454.7 327.9L413.2 288.4L414.7 276.4C415.6 269.7 416 262.9 416 256C416 249.1 415.6 242.3 414.7 235.6L413.2 223.6L454.7 184.1L417.6 119.9L362.6 136.1L352.9 128.7C342.2 120.5 330.4 113.6 317.7 108.3L306.5 103.6L293.1 48H218.9L205.5 103.6z" />
            </Svg>
            <UserDetailText>Settings</UserDetailText>
          </UserDetail>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={"rgba(121, 183, 255, 0.3)"}
          onPress={() => {}}
        >
          <UserDetail>
            <Svg
              width={20}
              height={20}
              fill={"black"}
              style={{ marginRight: 15 }}
              viewBox="0 0 512 512"
            >
              <Path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM296 336h-16V248C280 234.8 269.3 224 256 224H224C210.8 224 200 234.8 200 248S210.8 272 224 272h8v64h-16C202.8 336 192 346.8 192 360S202.8 384 216 384h80c13.25 0 24-10.75 24-24S309.3 336 296 336zM256 192c17.67 0 32-14.33 32-32c0-17.67-14.33-32-32-32S224 142.3 224 160C224 177.7 238.3 192 256 192z" />
            </Svg>
            <UserDetailText>About</UserDetailText>
          </UserDetail>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={"rgba(121, 183, 255, 0.3)"}
          onPress={async () => {
            setDetail(false);
            setUser(null);
            setToken(null);
            await AsyncStorage.removeItem("token");
          }}
        >
          <UserDetail>
            <Svg
              width={20}
              height={20}
              fill={"black"}
              style={{ marginRight: 15 }}
              viewBox="0 0 512 512"
            >
              <Path d="M534.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L434.7 224 224 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM192 96c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-53 0-96 43-96 96l0 256c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z" />
            </Svg>
            <UserDetailText>Sign Out</UserDetailText>
          </UserDetail>
        </TouchableHighlight>
      </AnimatedUserTextDetail>
    </>
  );
}
