import styled from "styled-components/native";
import { BluecardWithProject } from "../../libs/schema";
import { Shadow } from "react-native-shadow-2";
import { Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Path, Svg } from "react-native-svg";
import BlueTag from "../Bluetag";
import {
  NavigationProp,
  NavigatorScreenParams,
  useNavigation,
} from "@react-navigation/native";
import { HomeStackNavParamList } from "../../navigation/Root";

const BlueCardContainer = styled.View`
  position: relative;
  align-items: center;
  width: 335px;
  height: 480px;
  border-radius: 8px;
  overflow: hidden;
  color: black;
  background-color: white;
`;

const BlueCardBackGround = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 180px;
  overflow: hidden;
`;

const BackGroundImage = styled.Image`
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const BlueCardText = styled.View`
  width: 300px;
  height: auto;
  padding-top: 20px;
  padding-left: 10px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 45px;
  margin-bottom: 10px;
`;

const ProjectLogo = styled.View`
  width: 45px;
  height: 45px;
  border-radius: 5px;
  margin-right: 10px;
`;

const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const PostTitle = styled.View`
  height: 35px;
  width: 230px;
`;

const PostTitleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  line-height: 18px;
`;

const PostDate = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 280px;
  height: auto;
  opacity: 0.6;
`;

const PostContext = styled.View`
  width: 280px;
  height: auto;
  max-height: 110px;
  margin-top: 5px;
  margin-bottom: 10px;
  padding-top: 10px;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const PostText = styled.Text`
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
`;

const PostBlueTags = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 280px;
  height: auto;
`;

interface Props {
  data: BluecardWithProject;
}

const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const BlueCardMedium = ({ data }: Props) => {
  const navigation = useNavigation<NavigationProp<HomeStackNavParamList>>();
  const onPress = () => {
    navigation.navigate("BluecardDetail", { ...data });
  };
  return (
    <Shadow
      startColor="rgba(0, 0, 0, 0.1)"
      offset={[0, 4]}
      style={{ borderRadius: 8, marginBottom: 15 }}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <BlueCardContainer>
          <BlueCardBackGround>
            <BackGroundImage
              resizeMode="cover"
              source={{
                uri:
                  data.thumbnail === ""
                    ? data.project.backGround
                    : data.thumbnail,
              }}
            />
          </BlueCardBackGround>
          <BlueCardText>
            <TitleContainer>
              <ProjectLogo>
                <Shadow
                  startColor="rgba(0, 0, 0, 0.15)"
                  offset={[0, 2]}
                  distance={4}
                  style={{
                    borderRadius: 4,
                    width: 45,
                    height: 45,
                  }}
                >
                  <LogoImage source={{ uri: data.project.logoUrl }} />
                </Shadow>
              </ProjectLogo>
              <PostTitle>
                <PostTitleText numberOfLines={2}>{data.title}</PostTitleText>
              </PostTitle>
            </TitleContainer>
          </BlueCardText>
          <PostDate>
            <Text style={{ fontSize: 12 }}>
              {`${new Date(data.createdAt).getFullYear() - 2000}.${
                new Date(data.createdAt).getMonth() + 1
              }.${new Date(data.createdAt).getDate()} (${
                week[new Date(data.createdAt).getDay()]
              })`}
            </Text>
            {data.sns === "twitter" ? (
              <Svg
                width={25}
                height={25}
                fill={"#1D9BF0"}
                style={{ marginLeft: 10 }}
                viewBox="0 0 512 512"
              >
                <Path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
              </Svg>
            ) : (
              <Svg
                width={25}
                height={25}
                fill={"#6E85D3"}
                style={{ marginLeft: 10 }}
                viewBox="0 0 640 512"
              >
                <Path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
              </Svg>
            )}
          </PostDate>
          <PostContext>
            <PostText numberOfLines={5}>
              {data.summary.replace(/<[^>]*>?/g, "")}
            </PostText>
          </PostContext>
          <PostBlueTags>
            {data.bluetags.map((tag, index) =>
              tag !== "Etc" ? (
                <BlueTag
                  key={index}
                  color="#3733FF"
                  isWhite="false"
                  text={`#${tag}`}
                />
              ) : null
            )}
          </PostBlueTags>
        </BlueCardContainer>
      </TouchableWithoutFeedback>
    </Shadow>
  );
};

export default BlueCardMedium;
