import { useInfiniteQuery, useQuery } from "react-query";
import { BluecardWithProject, Project } from "../../libs/schema";
import {
  allProjects,
  greeting,
  watchListBluecards,
  watchListBluecardsSubscribe,
} from "../../libs/api";
import {
  Animated,
  FlatList,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styled from "styled-components/native";
import React, { useEffect, useRef, useState } from "react";
import Banner from "../../components/Banner";
import BlueCardMedium from "../../components/bluecard/BlueCardMedium";
import {
  TabNavParamList,
  WatchListStackNavParamList,
} from "../../navigation/Root";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "../../components/Spinner";
import { useUser } from "../../libs/context";
import Greeting from "../../components/Greeting";
import SubscribedProjectCard from "../../components/project/SubscribedProjectCard";
import { Path, Svg } from "react-native-svg";
import axios from "axios";
import Bluecard from "../../components/bluecard/Bluecard";
import { Shadow } from "react-native-shadow-2";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

const FlatlistContainer = styled.View`
  position: relative;
  flex: 1;
`;

const Wrapper = styled.View`
  align-items: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const SelectWrapper = styled.View`
  position: absolute;
  right: 3%;
  bottom: 5%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  z-index: 70;
`;

const Select = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 130px;
  height: 40px;
  border-radius: 8px;
  background: white;
`;

const SelectText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: #1c1b1b;
`;

const Tag = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
`;

const BluecardContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  z-index: 0;
`;

const InfoTitle = styled.View`
  justify-content: center;
  width: 100%;
  height: auto;
  padding: 20px;
  gap: 15px;
`;

const InfoTitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d3748;
`;

const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const InfoWrapperText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #a0aec0;
`;

const HSeparator = styled.View`
  height: 15px;
`;

const ContainerView = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const AnimatedSelect = Animated.createAnimatedComponent(Select);
const AnimatedSelectText = Animated.createAnimatedComponent(SelectText);
const AnimatedSelectContainerView =
  Animated.createAnimatedComponent(ContainerView);

interface Response {
  data: {
    bluecards: BluecardWithProject[];
  };
}

interface ProjectsResponse {
  data: {
    projects: Project[];
  };
}

interface ResponseInfo {
  data: {
    updatedBluecards: BluecardWithProject[];
    upComingEvents: BluecardWithProject[];
    progressingEvents: BluecardWithProject[];
  };
}

interface AxioseResponse {
  bluecards: BluecardWithProject[];
}

interface ProjectDataResponse {
  [key: string]: {
    bluecards: BluecardWithProject[] | null;
    previousId: string;
    stop: boolean;
  };
}

type WatchListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WatchListStackNavParamList, "Main">,
  BottomTabScreenProps<TabNavParamList, "WatchList">
>;

const WatchList: React.FC<WatchListScreenProps> = ({ navigation }) => {
  const { user } = useUser();
  const { data: projectData, isLoading: projectLoading } =
    useQuery<ProjectsResponse>(["watchlist", "projects"], allProjects);
  const { data: info } = useQuery<ResponseInfo>(
    ["watchlist", "greeting"],
    greeting
  );
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery<Response>(
      ["watchlist", "all"],
      ({ pageParam = "undefined" }) => watchListBluecards(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.data.bluecards.length === 0) {
            return undefined;
          }
          return lastPage.data.bluecards[lastPage.data.bluecards.length - 1].id;
        },
      }
    );
  const {
    data: dataSubscribe,
    isLoading: isLoadingSubscribe,
    hasNextPage: hasNextPageSubscribe,
    fetchNextPage: fetchNextPageSubscribe,
    refetch: refetchSubscribe,
  } = useInfiniteQuery<Response>(
    ["watchlist", "subscribe"],
    ({ pageParam = "undefined" }) =>
      watchListBluecardsSubscribe(pageParam, user!.id),
    {
      enabled: user ? true : false,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.bluecards.length === 0) {
          return undefined;
        }
        return lastPage.data.bluecards[lastPage.data.bluecards.length - 1].id;
      },
    }
  );

  const hover = useRef(new Animated.Value(0));
  const [selectedProject, setSelectedProject] = useState("");
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [datas, setDatas] = useState<BluecardWithProject[]>();
  const [projects, setProjects] = useState<ProjectDataResponse[]>([]);
  const [isValidating, setisValidating] = useState(false);
  const [isLoadedProject, setIsLoadedProject] = useState(false);
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const getProjectData = async () => {
    setisValidating(true);
    const index = projects.findIndex((element) => element[selectedProject]);
    if (index === -1) {
      const response = await axios.get<AxioseResponse>(
        `https://www.bluetags.app/api/bluecards?watchlist=true&project=${selectedProject}&previous=undefined`
      );
      if (response.data.bluecards.length > 0)
        setProjects((prev) => [
          ...prev,
          {
            [selectedProject]: {
              bluecards: response.data.bluecards,
              previousId:
                response.data.bluecards[response.data.bluecards.length - 1].id,
              stop: response.data.bluecards.length !== 10 ? true : false,
            },
          },
        ]);
      else
        setProjects((prev) => [
          ...prev,
          {
            [selectedProject]: {
              bluecards: null,
              previousId: "",
              stop: true,
            },
          },
        ]);
    } else if (projects[index] && !projects[index][selectedProject].stop) {
      const response = await axios.get<AxioseResponse>(
        `https://www.bluetags.app/api/bluecards?watchlist=true&project=${selectedProject}&previous=${projects[index][selectedProject].previousId}`
      );
      if (response.data.bluecards.length > 0) {
        projects[index][selectedProject].bluecards!.push(
          ...response.data.bluecards
        );
        projects[index][selectedProject].stop =
          response.data.bluecards.length !== 10 ? true : false;
        projects[index][selectedProject].previousId =
          response.data.bluecards[response.data.bluecards.length - 1].id;
      }
    }
    setisValidating(false);
  };

  useEffect(() => {
    if (user) setIsSubscribe(true);
  }, []);
  useEffect(() => {
    if (selectedProject === "") {
      if (isSubscribe && user) {
        setDatas(
          dataSubscribe?.pages.map((page) => page.data.bluecards).flat()
        );
      } else {
        setDatas(data?.pages.map((page) => page.data.bluecards).flat());
      }
    }
  }, [data, dataSubscribe, isSubscribe, selectedProject, user]);
  useEffect(() => {
    if (selectedProject !== "" && !isValidating) {
      getProjectData();
    }
  }, [selectedProject, isLoadedProject]);
  useEffect(() => {
    if (selectedProject !== "" && !isLoadedProject && !isValidating) {
      const index = projects.findIndex((element) => element[selectedProject]);
      if (index !== -1 && projects[index][selectedProject].bluecards)
        setDatas(projects[index][selectedProject].bluecards!);
    }
  }, [selectedProject, isLoadedProject, isValidating]);
  useEffect(() => {
    if (!isValidating) {
      setIsLoadedProject(false);
    }
  }, [isValidating]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refetchSubscribe();
    setRefreshing(false);
  };

  const handlePressIn = (num: number) => {
    setIndex(num);
    Animated.timing(hover.current, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(hover.current, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIndex(0));
  };

  const translateY = hover.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const backgroundColor = hover.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["#ffffff", "#5671f1"],
  });

  const fillColor = hover.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["#257cff", "#ffffff"],
  });

  const color = hover.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1c1b1b", "#ffffff"],
  });

  return datas ? (
    <FlatlistContainer>
      <SelectWrapper>
        {user ? (
          <Animated.View
            style={{
              transform: [{ translateY: index === 1 ? translateY : 0 }],
            }}
          >
            <Shadow
              style={{ marginRight: 20, borderRadius: 8 }}
              startColor="rgba(60, 64, 67, 0.1)"
              distance={3}
              offset={[0, 2]}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  setIsSubscribe((prev) => !prev);
                  setSelectedProject("");
                }}
                onPressIn={() => handlePressIn(1)}
                onPressOut={handlePressOut}
              >
                <AnimatedSelect
                  style={{
                    backgroundColor: index === 1 ? backgroundColor : "#ffffff",
                  }}
                >
                  <AnimatedSelectText
                    style={{
                      color: index === 1 ? color : "#1c1b1b",
                    }}
                  >
                    {isSubscribe ? "Subscribed" : "All"}
                  </AnimatedSelectText>
                </AnimatedSelect>
              </TouchableWithoutFeedback>
            </Shadow>
          </Animated.View>
        ) : null}
        <Animated.View
          style={{
            transform: [{ translateY: index === 2 ? translateY : 0 }],
          }}
        >
          <Shadow
            style={{ marginRight: 20, borderRadius: 8 }}
            startColor="rgba(60, 64, 67, 0.1)"
            distance={3}
            offset={[0, 2]}
          >
            <TouchableWithoutFeedback
              onPress={() => {}}
              onPressIn={() => handlePressIn(2)}
              onPressOut={handlePressOut}
            >
              <AnimatedSelectContainerView>
                <Svg
                  fill={"#257cff"}
                  width="25"
                  height="25"
                  viewBox="0 0 1427 1945"
                >
                  <Path d="M1427 1730.2C1140.59 1443.8 1140.59 980.502 1427 694.101L732.032 0L0 732.007L1213.03 1945L1427 1731.04V1730.2Z" />
                </Svg>
              </AnimatedSelectContainerView>
            </TouchableWithoutFeedback>
          </Shadow>
        </Animated.View>
        {/* <Upper /> */}
      </SelectWrapper>
      <FlatList
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={() => {
          if (isSubscribe && selectedProject === "" && hasNextPageSubscribe)
            fetchNextPageSubscribe();
          if (!isSubscribe && hasNextPage) {
            fetchNextPage();
          }
          if (isSubscribe && selectedProject !== "") {
            const index = projects.findIndex(
              (element) => element[selectedProject]
            );
            if (index === -1) setIsLoadedProject(true);
            else if (!projects[index][selectedProject].stop) {
              setIsLoadedProject(true);
            }
          }
        }}
        ListHeaderComponent={
          <Wrapper>
            <Greeting isLogin={user ? true : false} name={user?.name} />
            {user ? (
              <FlatList
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  gap: 10,
                }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={projectData?.data.projects.filter((pro) =>
                  user.subscribe.includes(pro.key)
                )}
                renderItem={({ item }) => (
                  <SubscribedProjectCard
                    data={item}
                    selected={selectedProject === item.key}
                    fn={() => {
                      if (selectedProject !== item.key) {
                        setSelectedProject(item.key);
                        setIsSubscribe(true);
                      } else setSelectedProject("");
                    }}
                  />
                )}
              />
            ) : null}
            {info?.data ? (
              <InfoTitle>
                <InfoTitleText>Bluecards</InfoTitleText>
                {info!.data.updatedBluecards.length > 0 ? (
                  <InfoWrapper>
                    <Svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <Path
                        d="M7.5 1.40625C4.13994 1.40625 1.40625 4.13994 1.40625 7.5C1.40625 10.8601 4.13994 13.5937 7.5 13.5937C10.8601 13.5937 13.5937 10.8601 13.5937 7.5C13.5937 4.13994 10.8601 1.40625 7.5 1.40625ZM10.6714 5.45771L6.73389 10.1452C6.69069 10.1967 6.63695 10.2382 6.57629 10.2671C6.51564 10.2959 6.44949 10.3114 6.38232 10.3125H6.37441C6.30871 10.3125 6.24375 10.2986 6.18374 10.2719C6.12373 10.2451 6.07001 10.2061 6.02607 10.1572L4.33857 8.28223C4.29572 8.23677 4.26238 8.18321 4.24052 8.12468C4.21866 8.06616 4.20872 8.00386 4.21128 7.94144C4.21384 7.87902 4.22886 7.81774 4.25544 7.7612C4.28202 7.70467 4.31964 7.65402 4.36608 7.61223C4.41251 7.57044 4.46684 7.53835 4.52585 7.51786C4.58487 7.49736 4.64738 7.48887 4.70973 7.49288C4.77207 7.49689 4.83298 7.51332 4.88889 7.54121C4.94479 7.5691 4.99455 7.60788 5.03525 7.65527L6.36211 9.12949L9.95361 4.85478C10.0342 4.76164 10.1482 4.70395 10.2709 4.69416C10.3937 4.68438 10.5153 4.7233 10.6096 4.80251C10.7039 4.88172 10.7633 4.99485 10.7748 5.11745C10.7864 5.24006 10.7492 5.36229 10.6714 5.45771Z"
                        fill="#68D391"
                      />
                    </Svg>
                    <InfoWrapperText>new</InfoWrapperText>
                    <InfoWrapperText>
                      {info?.data.updatedBluecards.length}
                    </InfoWrapperText>
                  </InfoWrapper>
                ) : null}
              </InfoTitle>
            ) : null}
          </Wrapper>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        onEndReachedThreshold={0.75}
        data={datas}
        renderItem={({ item }) => (
          <BluecardContainer>
            <Bluecard data={item} />
          </BluecardContainer>
        )}
        ItemSeparatorComponent={HSeparator}
      />
    </FlatlistContainer>
  ) : (
    <Spinner />
  );
};

export default WatchList;
