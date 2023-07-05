import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNavParamList } from "../../navigation/Root";
import { getProject, projectBluecards } from "../../libs/api";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { BluecardWithProject, ProjectWithBlueCard } from "../../libs/schema";
import styled from "styled-components/native";
import React, { useState } from "react";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import Dimension from "../../libs/useDimension";
import { Shadow } from "react-native-shadow-2";
import Spinner from "../../components/Spinner";
import BlueCardMedium from "../../components/bluecard/BlueCardMedium";
import { useUser } from "../../libs/context";
import { Path, Svg } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import subscribeProject from "../../libs/subscribeProject";
import useMutation from "../../libs/useMutation";

const Container = styled.View`
  width: 100%;
  background-color: #f8f9fa;
`;

const Banner = styled.View`
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
`;

const BannerImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ProjectTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 70px;
  padding: 10px;
  /* background: linear-gradient(
    112.83deg,
    rgba(255, 255, 255, 0.62) 0%,
    rgba(255, 255, 255, 0.6) 110.84%
  ); */
  background-color: rgba(255, 255, 255, 0.62);
  border: 1.5px solid #ffffff;
  border-radius: 15px;
`;

const LogoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 20px;
  width: auto;
  height: 100%;
`;

const LogoContainerText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  color: #2d3748;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin-top: 45px;
  margin-bottom: 10px;
  gap: 15px;
`;

const Button = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 35px;
  background: #ffffff;
  border-radius: 12px;
  gap: 5px;
`;

const ButtonText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  color: #2d3748;
`;

const Logo = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
`;

const LogoImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ContextWrapper = styled.View`
  justify-content: center;
  gap: 15px;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 20px 20px;
  background-color: #ffffff;
`;

const InfoWrapper = styled.View`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
`;

const Info = styled.View`
  padding: 30px 50px;
  width: 100%;
  height: auto;
  padding: 30px 20px;
  background: #ffffff;
`;

const InfoDetail = styled.View`
  padding: 30px 20px;
  width: 100%;
  height: auto;
  background: #ffffff;
`;

// const Airdrop = styled.View<{ isSuccess: boolean }>`
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   width: 100%;
//   height: 65px;
//   margin-bottom: 10px;
//   padding: 10px;
//   gap: 20px;
//   background-color: ${(props) =>
//     props.isSuccess ? "rgba(37, 124, 255, 0.2)" : "#ffffff"};
//   border-radius: 15px;
//   box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
//     rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
//   cursor: pointer;
//   span {
//     :first-child {
//       min-width: 40px;
//       font-weight: 700;
//       font-size: 18px;
//       line-height: 140%;
//       color: #2d3748;
//     }
//     :last-child {
//       width: auto;
//       font-style: normal;
//       font-weight: 600;
//       font-size: 16px;
//       line-height: 130%;
//       color: #010101;
//     }
//   }
//   @media ${breakingPoint.device.mobile} {
//     gap: 10px;
//     span {
//       :first-child {
//         width: 40px;
//         font-size: 16px;
//       }
//       :last-child {
//         font-size: 14px;
//       }
//     }
//   }
// `;

const InfoTitle = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 25px;
  margin-bottom: 15px;
`;

const InfoTitleText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  color: #2d3748;
`;

const NoAirDrop = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 30px 0px;
  background: rgba(37, 124, 255, 0.03);
  gap: 15px;
`;

const NoAirDropH1 = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
`;

const NoAirDropH1Text = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #010101;
`;

const InfoDescription = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 15px;
  padding-bottom: 15px;
`;

const InfoDescriptionText = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #a0aec0;
`;

const InfoDetailTitle = styled.View`
  flex-direction: row;
  height: 20px;
  align-items: center;
  margin-bottom: 10px;
  gap: 5px;
`;

const InfoDetailTitleSpanFirst = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #718096;
`;

const InfoDetailTitleSpanSecond = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #a0aec0;
`;

const PageImage = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const ItemWrapper = styled.View`
  justify-content: center;
  align-items: center;
  width: ${Dimension.width}px;
  height: auto;
`;

const HSeparator = styled.View`
  height: 30px;
`;

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

type ProjectDetailScreenProps = NativeStackScreenProps<
  RootNavParamList,
  "ProjectDetail"
>;

const ProjectDetail = ({
  route: { params },
  navigation,
}: ProjectDetailScreenProps) => {
  const { user, setUser } = useUser();
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
  const [subscribe, setSubscribe] = useState<string[]>(
    user ? user.subscribe : []
  );
  const [refreshing, setRefreshing] = useState(false);

  const mutation = useMutation("https://www.bluetags.app/api/users/subscribe");

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
          <Banner>
            <BannerImage source={{ uri: data.data.project.backgroundImage }} />
            <Shadow
              startColor="rgba(0, 0, 0, 0.15)"
              containerStyle={{
                position: "absolute",
                bottom: -35,
              }}
              style={{
                width: Dimension.width * 0.9,
                height: 70,
                borderRadius: 15,
              }}
            >
              <ProjectTitle>
                <LogoContainer>
                  <Logo>
                    <LogoImage source={{ uri: data.data.project.logoImage }} />
                  </Logo>
                  <LogoContainerText>
                    {data.data.project.title}
                  </LogoContainerText>
                </LogoContainer>
              </ProjectTitle>
            </Shadow>
          </Banner>
          <ButtonWrapper>
            <Shadow
              startColor="rgba(50, 50, 93, 0.05)"
              distance={4}
              offset={[0, 2]}
              style={{
                width: 100,
                height: 35,
                borderRadius: 12,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  if (!user) {
                    navigation.navigate("SignIn");
                  } else
                    subscribeProject({
                      subscribeList: subscribe,
                      setSubscribeList: setSubscribe,
                      project: data.data.project!,
                      user,
                      setUser,
                      mutation,
                    });
                }}
              >
                <Button>
                  {subscribe.includes(data.data.project.key) ? (
                    <Svg
                      width={15}
                      height={15}
                      viewBox="0 0 15 15"
                      fill="#101010"
                    >
                      <Path
                        d="M8.58058 2.19365L9.68058 4.39365C9.83058 4.6999 10.2306 4.99365 10.5681 5.0499L12.5618 5.38115C13.8368 5.59365 14.1368 6.51865 13.2181 7.43115L11.6681 8.98115C11.4056 9.24365 11.2618 9.7499 11.3431 10.1124L11.7868 12.0312C12.1368 13.5499 11.3306 14.1374 9.98683 13.3437L8.11808 12.2374C7.78058 12.0374 7.22433 12.0374 6.88058 12.2374L5.01183 13.3437C3.67433 14.1374 2.86183 13.5437 3.21183 12.0312L3.65558 10.1124C3.73683 9.7499 3.59308 9.24365 3.33058 8.98115L1.78058 7.43115C0.868083 6.51865 1.16183 5.59365 2.43683 5.38115L4.43058 5.0499C4.76183 4.99365 5.16183 4.6999 5.31183 4.39365L6.41183 2.19365C7.01183 0.999902 7.98683 0.999902 8.58058 2.19365Z"
                        stroke="#101010"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  ) : (
                    <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
                      <Path
                        d="M8.58058 2.19365L9.68058 4.39365C9.83058 4.6999 10.2306 4.99365 10.5681 5.0499L12.5618 5.38115C13.8368 5.59365 14.1368 6.51865 13.2181 7.43115L11.6681 8.98115C11.4056 9.24365 11.2618 9.7499 11.3431 10.1124L11.7868 12.0312C12.1368 13.5499 11.3306 14.1374 9.98683 13.3437L8.11808 12.2374C7.78058 12.0374 7.22433 12.0374 6.88058 12.2374L5.01183 13.3437C3.67433 14.1374 2.86183 13.5437 3.21183 12.0312L3.65558 10.1124C3.73683 9.7499 3.59308 9.24365 3.33058 8.98115L1.78058 7.43115C0.868083 6.51865 1.16183 5.59365 2.43683 5.38115L4.43058 5.0499C4.76183 4.99365 5.16183 4.6999 5.31183 4.39365L6.41183 2.19365C7.01183 0.999902 7.98683 0.999902 8.58058 2.19365Z"
                        stroke="#101010"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                  <ButtonText>Follow</ButtonText>
                </Button>
              </TouchableWithoutFeedback>
            </Shadow>
          </ButtonWrapper>
          {/* <SelectWrapper>
          <Upper />
        </SelectWrapper> */}
          <InfoWrapper>
            <Info>
              <InfoTitle>
                <InfoTitleText>Project Information</InfoTitleText>
              </InfoTitle>
              <InfoDescription
                style={{ borderBottomColor: "#e0e1e2", borderBottomWidth: 1 }}
              >
                <InfoDescriptionText>
                  {data.data.project.description}
                </InfoDescriptionText>
              </InfoDescription>
              <InfoDetailTitle>
                <InfoDetailTitleSpanFirst>Funding : </InfoDetailTitleSpanFirst>
                <InfoDetailTitleSpanSecond>
                  {data.data.project.fundingScale}
                </InfoDetailTitleSpanSecond>
              </InfoDetailTitle>
              <InfoDetailTitle>
                <InfoDetailTitleSpanFirst>Category : </InfoDetailTitleSpanFirst>
                <InfoDetailTitleSpanSecond>
                  {data.data.project.category}
                </InfoDetailTitleSpanSecond>
              </InfoDetailTitle>
              <InfoDetailTitle>
                <InfoDetailTitleSpanFirst>
                  Social Media :
                </InfoDetailTitleSpanFirst>
                {data.data.project.twitterUrl ? (
                  <PageImage
                    source={require("../../assets/logo/twitter.png")}
                  />
                ) : null}
                {data.data.project.discordUrl ? (
                  <PageImage
                    source={require("../../assets/logo/discord.png")}
                  />
                ) : null}
                {data.data.project.openseaUrl ? (
                  <PageImage
                    source={require("../../assets/logo/opensea.png")}
                  />
                ) : null}
                {data.data.project.mediumUrl ? (
                  <PageImage source={require("../../assets/logo/medium.png")} />
                ) : null}
                {data.data.project.telegramUrl ? (
                  <PageImage
                    source={require("../../assets/logo/telegram.png")}
                  />
                ) : null}
                {data.data.project.homepageUrl ? (
                  <PageImage source={require("../../assets/logo/home.png")} />
                ) : null}
              </InfoDetailTitle>
            </Info>
            <InfoDetail>
              <InfoTitle>
                <InfoTitleText>Participation</InfoTitleText>
              </InfoTitle>
              <NoAirDrop>
                <Svg width="80" height="92" viewBox="0 0 80 92" fill="none">
                  <Path
                    d="M40 5.73394C49.4643 5.73394 57.1429 13.4389 57.1429 22.9358V34.4037H22.8571V22.9358C22.8571 13.4389 30.5357 5.73394 40 5.73394ZM17.1429 22.9358V34.4037H14.2857C6.39286 34.4037 0 40.8185 0 48.7385V77.4083C0 85.3283 6.39286 91.7431 14.2857 91.7431H65.7143C73.6071 91.7431 80 85.3283 80 77.4083V48.7385C80 40.8185 73.6071 34.4037 65.7143 34.4037H62.8571V22.9358C62.8571 10.2673 52.625 0 40 0C27.375 0 17.1429 10.2673 17.1429 22.9358ZM14.2857 40.1376H65.7143C70.4464 40.1376 74.2857 43.9901 74.2857 48.7385V77.4083C74.2857 82.1567 70.4464 86.0092 65.7143 86.0092H14.2857C9.55357 86.0092 5.71429 82.1567 5.71429 77.4083V48.7385C5.71429 43.9901 9.55357 40.1376 14.2857 40.1376ZM42.8571 55.906C42.8571 54.3291 41.5714 53.039 40 53.039C38.4286 53.039 37.1429 54.3291 37.1429 55.906V70.2408C37.1429 71.8177 38.4286 73.1078 40 73.1078C41.5714 73.1078 42.8571 71.8177 42.8571 70.2408V55.906Z"
                    fill="#212434"
                  />
                </Svg>
                <NoAirDropH1>
                  <NoAirDropH1Text>
                    This project doesn’t have airdrop mission
                  </NoAirDropH1Text>
                </NoAirDropH1>
              </NoAirDrop>
            </InfoDetail>
          </InfoWrapper>
          <ContextWrapper>
            <InfoTitle>
              <InfoTitleText>Bluecards</InfoTitleText>
            </InfoTitle>
          </ContextWrapper>
        </Container>
      }
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.75}
      data={blueCardsData.pages.map((page) => page.data.bluecards).flat()}
      renderItem={({ item }) => (
        <ItemWrapper>
          <BlueCardMedium data={item} />
        </ItemWrapper>
      )}
      ItemSeparatorComponent={HSeparator}
    />
  ) : null;
};

export default ProjectDetail;
