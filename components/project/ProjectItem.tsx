import { Path, Svg } from "react-native-svg";
import styled from "styled-components/native";
import { Project, User } from "../../libs/schema";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import subscribeProject from "../../libs/subscribeProject";
import useMutation from "../../libs/useMutation";
import { RootNavParamList, TabNavParamList } from "../../navigation/Root";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Dimension from "../../libs/useDimension";

const ProjectContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${Dimension.width}px;
  height: 60px;
  padding: 0px 15px;
  background: #ffffff;
`;

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  height: 100%;
`;

const Collection = styled.View`
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: center;
  padding-left: 10px;
`;

const CollectionH2 = styled.Text`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #aaaaaa;
`;

const CollectionText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  color: #2d3748;
`;

const ContextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 7;
  height: auto;
`;

const Index = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 100%;
`;

const IndexText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #2d3748;
`;

const Logo = styled.Image`
  width: 40px;
  height: 40px;
  margin-left: 10px;
  border-radius: 6px;
`;

const FakeLogo = styled.View`
  width: 40px;
  height: 40px;
  margin-left: 10px;
  border-radius: 6px;
`;

const SubscribeButton = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 50px;
  height: 100%;
  align-items: center;
`;

interface Props {
  project?: Project;
  user?: User | null;
  setUser?: any;
  head?: boolean;
  index?: number;
}

type NavigationProps = CompositeNavigationProp<
  BottomTabNavigationProp<TabNavParamList, "Project">,
  NativeStackNavigationProp<RootNavParamList>
>;

export default function ProjectItem({
  project,
  user,
  setUser,
  head,
  index,
}: Props) {
  const navigation = useNavigation<NavigationProps>();
  const [subscribe, setSubscribe] = useState<string[]>(
    user ? user.subscribe : []
  );
  const mutation = useMutation("https://www.bluetags.app/api/users/subscribe");

  return head ? (
    <ProjectContainer>
      <ContextWrapper>
        <Index></Index>
        <FakeLogo />
        <Collection>
          <CollectionH2>#Collection</CollectionH2>
        </Collection>
      </ContextWrapper>
      <Wrapper>
        <SubscribeButton>
          <Svg width="11" height="15" viewBox="0 0 11 15" fill="none">
            <Path
              d="M3.20368 4.99972H8.7918L5.99774 2.20566L3.20368 4.99972ZM6.70407 0.793001L10.7045 4.79345C10.992 5.08098 11.0764 5.50915 10.9202 5.88419C10.7639 6.25924 10.4014 6.50301 9.99506 6.50301H1.99729C1.59412 6.50301 1.22846 6.25924 1.07219 5.88419C0.915923 5.50915 1.00343 5.08098 1.28784 4.79345L5.28829 0.793001C5.67895 0.402333 6.3134 0.402333 6.70407 0.793001ZM3.20368 10.0003L5.99774 12.7943L8.7918 10.0003H3.20368ZM6.70407 14.207C6.3134 14.5977 5.67895 14.5977 5.28829 14.207L1.28784 10.2066C1.00031 9.91902 0.915923 9.49085 1.07219 9.11581C1.22846 8.74076 1.591 8.49699 1.99729 8.49699H9.99819C10.4014 8.49699 10.767 8.74076 10.9233 9.11581C11.0796 9.49085 10.992 9.91902 10.7076 10.2066L6.70719 14.207H6.70407Z"
              fill="#AAAAAA"
            />
          </Svg>
        </SubscribeButton>
      </Wrapper>
    </ProjectContainer>
  ) : (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("Project", {
          screen: "ProjectDetail",
          params: { ...project! },
        });
      }}
    >
      <ProjectContainer>
        <ContextWrapper>
          <Index>
            <IndexText>{index}</IndexText>
          </Index>
          <Logo source={{ uri: project!.logoImage }} />
          <Collection>
            <CollectionText>{project!.title}</CollectionText>
          </Collection>
        </ContextWrapper>
        <Wrapper>
          <TouchableWithoutFeedback
            onPress={() => {
              if (!user) {
                navigation.navigate("SignIn");
              } else
                subscribeProject({
                  subscribeList: subscribe,
                  setSubscribeList: setSubscribe,
                  project: project!,
                  user,
                  setUser,
                  mutation,
                });
            }}
          >
            <SubscribeButton>
              {subscribe.includes(project!.key) ? (
                <Svg width={15} height={15} viewBox="0 0 15 15" fill="#101010">
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
            </SubscribeButton>
          </TouchableWithoutFeedback>
        </Wrapper>
      </ProjectContainer>
    </TouchableWithoutFeedback>
  );
}
