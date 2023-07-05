import styled from "styled-components/native";
import { useQuery, useQueryClient } from "react-query";
import { allProjects, homeBluecards, homeInfo } from "../libs/api";
import { BluecardWithProject, Project } from "../libs/schema";
import BluecardSlider from "../components/slider/BluecardSlider";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { HomeStackNavParamList, TabNavParamList } from "../navigation/Root";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spinner from "../components/Spinner";
import IndexInfo from "../components/home/IndexInfo";
import ProjectCard from "../components/project/ProjectCard";
import MostReadNews from "../components/MostReadNews";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

const Wrapper = styled.ScrollView``;

const Title = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 20px;
`;

const TitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d3748;
`;

const SubSelect = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 25px;
  width: 70px;
  border: 1px solid #257cff;
  border-radius: 12px;
`;

const SubSelectText = styled.Text`
  font-weight: 700;
  font-size: 10px;
  color: #257cff;
`;

const SelectWrapper = styled.View`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: auto;
  margin-bottom: 10px;
`;

const SelectContainer = styled.View`
  display: flex;
  flex-direction: row;
  width: auto;
  height: auto;
  padding-left: 10px;
  gap: 10px;
`;

const Select = styled.View`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 40px;
  padding: 10px;
`;

const SelectText = styled.Text<{ isSelected: boolean }>`
  font-weight: 600;
  font-size: 18px;
  font-size: 14px;
  color: ${(props) => (props.isSelected ? "#212434" : "#93989A")};
`;

const SelectBar = styled.View`
  position: absolute;
  bottom: 0px;
  width: 120%;
  height: 5px;
  background: #257cff;
  border-radius: 10px;
`;

interface Response {
  data: {
    latest: BluecardWithProject[];
    mostRead: BluecardWithProject[];
  };
}

interface InfoResponse {
  data: {
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

interface ProjectsResponse {
  data: {
    projects: Project[];
  };
}

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackNavParamList, "Main">,
  BottomTabScreenProps<TabNavParamList, "Home">
>;

const Home: React.FC<HomeScreenProps> = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<Response>(
    ["homequery", "home"],
    homeBluecards
  );
  const { data: info, isLoading: isLoadingInfo } = useQuery<InfoResponse>(
    ["homequery", "info"],
    homeInfo
  );
  const { data: projectData, isLoading: projectLoading } =
    useQuery<ProjectsResponse>(["homequery", "projects"], allProjects);

  const [select, setSelect] = useState(0);
  const [cards, setCards] = useState<BluecardWithProject[]>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries(["homequery"]);
    setRefreshing(false);
  };

  useEffect(() => {
    if (!isLoading || !refreshing) setCards(data?.data.latest);
  }, [isLoading, refreshing]);

  const loading = isLoading || projectLoading || isLoadingInfo || !cards;

  return loading ? (
    <Spinner />
  ) : (
    <Wrapper
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <IndexInfo info={info!.data} />
      <Title>
        <TitleText>Trending Projects</TitleText>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Project", { screen: "Main" })}
        >
          <SubSelect>
            <SubSelectText>VIEW ALL</SubSelectText>
          </SubSelect>
        </TouchableWithoutFeedback>
      </Title>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          gap: 10,
          marginBottom: 30,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={projectData?.data.projects}
        renderItem={({ item }) => <ProjectCard data={item} />}
      />
      <SelectWrapper>
        <Title>
          <TitleText>Hot Bluecards</TitleText>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("WatchList", { screen: "Main" })}
          >
            <SubSelect>
              <SubSelectText>VIEW ALL</SubSelectText>
            </SubSelect>
          </TouchableWithoutFeedback>
        </Title>
        <SelectContainer>
          <TouchableWithoutFeedback
            onPress={() => {
              setSelect(0);
              setCards(data?.data.latest);
            }}
          >
            <Select>
              <SelectText isSelected={select === 0}>LATEST</SelectText>
              {select === 0 ? <SelectBar /> : null}
            </Select>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              setSelect(1);
              setCards(data?.data.mostRead);
            }}
          >
            <Select>
              <SelectText isSelected={select === 1}>MOST READ</SelectText>
              {select === 1 ? <SelectBar /> : null}
            </Select>
          </TouchableWithoutFeedback>
        </SelectContainer>
      </SelectWrapper>
      <BluecardSlider data={cards!} />
      <MostReadNews />
      <View style={{ marginBottom: 30 }} />
    </Wrapper>
  );
};

export default Home;
