import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavParamList } from "../../navigation/Root";
import { getProject, projectBluecards } from "../../libs/api";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { BluecardWithProject, ProjectWithBlueCard } from "../../libs/schema";
import Banner from "../../components/Banner";
import styled from "styled-components/native";
import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import BlueCardHistory from "../../components/bluecard/BlueCardHistory";
import Dimension from "../../libs/useDimension";
import { Shadow } from "react-native-shadow-2";
import Spinner from "../../components/Spinner";

const Container = styled.View`
  align-items: center;
  width: 100%;
  height: 300px;
  margin-top: 20px;
  margin-bottom: 30px;
`;

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin-top: 60px;
  margin-bottom: 30px;
`;

const InfoWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 30px 20px;
  width: 80%;
  height: 80px;
  background: #f3f4f4;
  border: 1px solid rgba(25, 31, 40, 0.1);
  border-radius: 4px;
`;

const Info = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 5px;
  width: 64px;
  height: 60px;
`;

const InfoCount = styled.Text`
  color: #434447;
  font-weight: 700;
  font-size: 12px;
  line-height: 22px;
`;

const InfoTitle = styled.Text`
  color: #434447;
  font-weight: 400;
  font-size: 11px;
`;

const LogoWrapper = styled.View`
  position: absolute;
  bottom: -50px;
  right: 10px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  width: 100%;
  height: auto;
  gap: 10px;
  z-index: 0;
`;

const LogoImage = styled.Image`
  width: 30px;
  height: 30px;
`;

const ItemWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: ${Dimension.width}px;
  height: auto;
`;

const HSeparator = styled.View`
  height: 15px;
`;

type ProjectDetailScreenProps = NativeStackScreenProps<
  HomeStackNavParamList,
  "ProjectDetail"
>;

interface Response {
  data: {
    project: ProjectWithBlueCard;
  };
}

interface ResponseBluecards {
  data: {
    bluecards: BluecardWithProject[];
  };
}

const ProjectDetail: React.FC<ProjectDetailScreenProps> = ({
  route: { params },
  navigation,
}) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<Response>(
    [`${params.key}`, "projects"],
    () => getProject(params.key)
  );
  const {
    data: blueCardsData,
    isLoading: blueCardsLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ResponseBluecards>(
    [`${params.key}`, "bluecards"],
    ({ pageParam = "undefined" }) => projectBluecards(params.key, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.bluecards.length === 0) {
          return undefined;
        }
        return lastPage.data.bluecards[lastPage.data.bluecards.length - 1].id;
      },
    }
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries([`${params.key}`]);
    setRefreshing(false);
  };

  const loading = isLoading || blueCardsLoading;

  return loading ? (
    <Spinner />
  ) : data && blueCardsData ? (
    <FlatList
      contentContainerStyle={{ paddingBottom: 30 }}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListHeaderComponent={
        <Container>
          <Banner
            url={data.data.project.backGround}
            text={data.data.project ? `${data.data.project.title}` : "Project"}
          >
            <LogoWrapper>
              {data.data.project.twitterUrl ? (
                <LogoImage
                  source={require("../../assets/logo/twitter.png")}
                ></LogoImage>
              ) : null}
              {data.data.project.discordUrl ? (
                <LogoImage
                  source={require("../../assets/logo/discord.png")}
                ></LogoImage>
              ) : null}
              {data.data.project.openseaUrl ? (
                <LogoImage
                  source={require("../../assets/logo/opensea.png")}
                ></LogoImage>
              ) : null}
              {data.data.project.homepageUrl ? (
                <LogoImage
                  source={require("../../assets/logo/home.png")}
                ></LogoImage>
              ) : null}
            </LogoWrapper>
          </Banner>
          <Wrapper>
            <Shadow
              startColor="rgba(0, 0, 0, 0.03)"
              offset={[0, 3]}
              distance={8}
              style={{
                borderRadius: 10,
                height: 80,
              }}
            >
              <InfoWrapper>
                <Info>
                  <InfoCount>{data?.data.project._count.BlueCards}</InfoCount>
                  <InfoTitle>Bluecards</InfoTitle>
                </Info>
                <Info>
                  <InfoCount>{data?.data.project._count.BlueCards}</InfoCount>
                  <InfoTitle>Subscribe</InfoTitle>
                </Info>
              </InfoWrapper>
            </Shadow>
          </Wrapper>
          <Title subTitle="Large" title="History" />
        </Container>
      }
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.75}
      data={blueCardsData.pages.map((page) => page.data.bluecards).flat()}
      renderItem={({ item }) => (
        <ItemWrapper>
          <BlueCardHistory
            data={item}
            projectLogo={data.data.project.logoUrl}
            projectTitle={data.data.project.title}
            fn={() => {
              navigation.navigate("BluecardDetail", { data: { ...item } });
            }}
            projectFn={() => {
              navigation.navigate("ProjectDetail", { ...item.project });
            }}
          />
        </ItemWrapper>
      )}
      ItemSeparatorComponent={HSeparator}
    />
  ) : null;
};

export default ProjectDetail;
