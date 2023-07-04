import { useQuery } from "react-query";
import { Project } from "../../libs/schema";
import { allProjects } from "../../libs/api";
import ProjectItem from "./../../components/project/ProjectItem";
import styled from "styled-components/native";
import {
  FlatList,
  RefreshControl,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState } from "react";
import { useUser } from "../../libs/context";
import Spinner from "../../components/Spinner";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabNavParamList } from "../../navigation/Root";
import ProjectCard from "../../components/project/ProjectCard";
import MostReadNews from "../../components/MostReadNews";
import { Path, Svg } from "react-native-svg";
import { Shadow } from "react-native-shadow-2";

const Wrapper = styled.ScrollView``;

interface ProjectsResponse {
  data: {
    projects: Project[];
  };
}

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

const Container = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding-bottom: 50px;
`;

const LeftSide = styled.View`
  width: 100%;
  height: auto;
  z-index: 99;
`;

const ProjectList = styled.View`
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  height: auto;
  background-color: #ffffff;
`;

const ProjectListTitle = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 50px;
  margin-bottom: 10px;
  padding: 0px 30px;
`;

const ProjectListTitleView = styled.View`
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const ProjectListTitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d3748;
`;

const FilterWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 60px;
  padding: 30px;
  gap: 10px;
  z-index: 99;
`;

const Filter = styled.View<{ isSelected: boolean }>`
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 115px;
  height: 36px;
  gap: 10px;
  background: ${(props) => (props.isSelected ? "#257CFF" : "#89b8ff")};
  border-radius: 8px;
`;

const FiterText = styled.Text`
  font-size: 12px;
  color: #ffffff;
`;

const FilterDetail = styled.View`
  position: absolute;
  top: 45px;
  left: 0px;
  width: 300px;
  height: auto;
  background-color: #ffffff;
  border-radius: 8px;
  gap: 10px;
  z-index: 99;
`;

const FilterDetailH1 = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: auto;
  height: 35px;
  padding: 3px 10px;
  white-space: nowrap;
  border-radius: 4px;
`;

const FilterDetailH1Text = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: #2d3748;
`;

const FilterDetailTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 8px 12px;
`;

const FilterDetailTitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  color: #2d3748;
`;

const FilterDetailTitleH2 = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #257cff;
`;

const FilterSearchForm = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 30px;
  padding-left: 10px;
  background: #f1f7ff;
  border: 0.5px solid #e2e8f0;
  border-radius: 4px;
`;

const FilterSearch = styled.TextInput`
  flex: 1;
  flex-direction: row;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #2d3748;
  padding-left: 10px;
  padding-right: 10px;
`;

const ProjectScreeen: React.FC<
  BottomTabScreenProps<TabNavParamList, "Project">
> = ({ navigation }) => {
  const { user, setUser } = useUser();
  const { data, isLoading, refetch } = useQuery<ProjectsResponse>(
    "projects",
    allProjects
  );
  const [filter, setFilter] = useState<string[]>([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [detail, setDetail] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (data?.data.projects) setProjects(data?.data.projects);
  }, [data]);

  useEffect(() => {
    if (filter.length === 0) {
      setProjects(data!.data.projects);
    } else {
      const array = data!.data.projects.filter((item) =>
        filter.includes(item.category)
      );
      setProjects(array);
    }
  }, [filter]);

  return isLoading ? (
    <Spinner />
  ) : (
    <Wrapper
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Title>
        <TitleText>Trending Projects</TitleText>
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
        data={data?.data.projects}
        renderItem={({ item }) => <ProjectCard data={item} />}
      />
      <Container>
        <LeftSide>
          <ProjectList>
            <ProjectListTitle
              style={{
                paddingHorizontal: 30,
              }}
            >
              <ProjectListTitleView
                style={{
                  borderBottomColor: "#e0e1e2",
                  borderBottomWidth: 1,
                }}
              >
                <ProjectListTitleText>Project List</ProjectListTitleText>
              </ProjectListTitleView>
            </ProjectListTitle>
            <TouchableWithoutFeedback
              onPress={() => {
                if (detail === 0) setDetail(1);
                else setDetail(0);
              }}
            >
              <FilterWrapper>
                <Filter isSelected={filter.length > 0}>
                  <FiterText>Category</FiterText>
                  {detail === 1 ? (
                    <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <Path
                        d="M5.39485 0.82551C5.72955 0.4908 6.27312 0.4908 6.60783 0.82551L11.749 5.96665C12.0837 6.30135 12.0837 6.84492 11.749 7.17963C11.4143 7.51434 10.8707 7.51434 10.536 7.17963L6 2.64365L1.46402 7.17695C1.12931 7.51166 0.585741 7.51166 0.251032 7.17695C-0.0836773 6.84225 -0.0836773 6.29868 0.251032 5.96397L5.39217 0.822832L5.39485 0.82551Z"
                        fill="#ffffff"
                      />
                    </Svg>
                  ) : (
                    <Svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <Path
                        d="M6.60515 7.17937C6.27045 7.51408 5.72688 7.51408 5.39217 7.17937L0.251032 2.03824C-0.0836773 1.70353 -0.0836773 1.15996 0.251032 0.825251C0.585741 0.490541 1.12931 0.490541 1.46402 0.825251L6 5.36123L10.536 0.827928C10.8707 0.493219 11.4143 0.493219 11.749 0.827928C12.0837 1.16264 12.0837 1.70621 11.749 2.04091L6.60783 7.18205L6.60515 7.17937Z"
                        fill="#ffffff"
                      />
                    </Svg>
                  )}
                  {detail === 1 ? (
                    <FilterDetail>
                      <Shadow
                        style={{
                          width: 300,
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                          borderRadius: 8,
                        }}
                        startColor="rgba(0, 0, 0, 0.07)"
                        distance={2}
                      >
                        <FilterDetailTitle>
                          <FilterDetailTitleText>
                            Category
                          </FilterDetailTitleText>
                          <TouchableWithoutFeedback
                            onPress={() => setFilter([])}
                          >
                            <FilterDetailTitleH2>Clear</FilterDetailTitleH2>
                          </TouchableWithoutFeedback>
                        </FilterDetailTitle>
                        <FilterSearchForm>
                          <Svg
                            width="13"
                            height="13"
                            viewBox="0 0 9 9"
                            fill="#2D3748"
                          >
                            <Path
                              d="M8.4196 7.73076L6.58191 5.89306C7.02434 5.30407 7.26318 4.58714 7.26237 3.85049C7.26237 1.96885 5.73152 0.437988 3.84988 0.437988C1.96824 0.437988 0.437378 1.96885 0.437378 3.85049C0.437378 5.73213 1.96824 7.26299 3.84988 7.26299C4.58653 7.26379 5.30346 7.02495 5.89245 6.58252L7.73015 8.42021C7.82317 8.50337 7.9445 8.54775 8.06922 8.54426C8.19395 8.54077 8.3126 8.48967 8.40083 8.40144C8.48906 8.31321 8.54016 8.19456 8.54365 8.06983C8.54714 7.94511 8.50276 7.82378 8.4196 7.73076V7.73076ZM1.41238 3.85049C1.41238 3.36839 1.55533 2.89713 1.82317 2.49628C2.09101 2.09544 2.47169 1.78302 2.91709 1.59853C3.36248 1.41404 3.85258 1.36577 4.32541 1.45982C4.79824 1.55388 5.23256 1.78602 5.57345 2.12691C5.91434 2.4678 6.14649 2.90213 6.24054 3.37495C6.33459 3.84778 6.28632 4.33788 6.10183 4.78328C5.91734 5.22867 5.60492 5.60936 5.20408 5.87719C4.80323 6.14503 4.33197 6.28799 3.84988 6.28799C3.20365 6.28721 2.58411 6.03015 2.12716 5.5732C1.67021 5.11625 1.41315 4.49671 1.41238 3.85049V3.85049Z"
                              fill="#2D3748"
                            />
                          </Svg>
                          <FilterSearch
                            editable
                            value={filterSearch}
                            onChangeText={(text) => setFilterSearch(text)}
                            placeholder="Search tags"
                            placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
                          />
                        </FilterSearchForm>
                        {[
                          ...new Set(
                            data!.data.projects.map((item) => item.category)
                          ),
                        ]
                          .filter((category) => {
                            if (filterSearch !== "") {
                              return category
                                .toLowerCase()
                                .replaceAll(" ", "")
                                .includes(
                                  filterSearch.toLowerCase().replaceAll(" ", "")
                                );
                            } else {
                              return true;
                            }
                          })
                          .map((category, index) => (
                            <TouchableHighlight
                              underlayColor={"#e6f0ff"}
                              style={{ borderRadius: 4 }}
                              key={index}
                              onPress={() => {
                                if (filter.includes(category)) {
                                  const newArray = filter.filter(
                                    (item) => item !== category
                                  );
                                  setFilter(newArray);
                                } else {
                                  setFilter((prev) => [...prev, category]);
                                }
                              }}
                            >
                              <FilterDetailH1>
                                <FilterDetailH1Text>
                                  {category}
                                </FilterDetailH1Text>
                                {filter.includes(category) ? (
                                  <Svg
                                    width="12"
                                    height="8"
                                    viewBox="0 0 12 8"
                                    fill="none"
                                  >
                                    <Path
                                      d="M11.7657 0.234338C12.0781 0.54679 12.0781 1.05421 11.7657 1.36666L5.36667 7.76566C5.05422 8.07811 4.5468 8.07811 4.23434 7.76566L1.03484 4.56616C0.722394 4.25371 0.722394 3.74629 1.03484 3.43384C1.3473 3.12139 1.85472 3.12139 2.16717 3.43384L4.80176 6.06593L10.6358 0.234338C10.9483 -0.0781128 11.4557 -0.0781128 11.7682 0.234338H11.7657Z"
                                      fill="#257CFF"
                                    />
                                  </Svg>
                                ) : null}
                              </FilterDetailH1>
                            </TouchableHighlight>
                          ))}
                      </Shadow>
                    </FilterDetail>
                  ) : null}
                </Filter>
              </FilterWrapper>
            </TouchableWithoutFeedback>
            <ProjectItem head={true} />
            <FlatList
              data={projects}
              renderItem={({ item, index }) => (
                <ProjectItem
                  user={user}
                  setUser={setUser}
                  project={item}
                  index={index + 1}
                />
              )}
            />
          </ProjectList>
        </LeftSide>
        <MostReadNews />
      </Container>
    </Wrapper>
  );
};

export default ProjectScreeen;
