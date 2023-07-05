import { useInfiniteQuery } from "react-query";
import { CommentWithUser } from "../../libs/schema";
import { useUser } from "../../libs/context";
import { allUserComment } from "../../libs/api";
import Spinner from "../../components/Spinner";
import { FlatList } from "react-native";
import { useState } from "react";
import styled from "styled-components/native";
import CommentUser from "../../components/bluecard/CommentUser";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootNavParamList } from "../../navigation/Root";

const BluecardWrapperTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 0px 30px;
`;

const BluecardWrapperTitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #010101;
`;

const CommentContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding-left: 5%;
  padding-right: 5%;
  z-index: 0;
`;

const HSeparator = styled.View`
  height: 15px;
`;

interface ResponseBluecards {
  data: {
    comments: CommentWithUser[];
  };
  status: number;
}

type UserCommentScreenProps = NativeStackScreenProps<
  RootNavParamList,
  "UserComment"
>;

const UserComment = ({ navigation }: UserCommentScreenProps) => {
  const { user } = useUser();
  const { data, isLoading, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery<ResponseBluecards>(
      `${user?.id}Comment`,
      ({ pageParam = "undefined" }) => allUserComment(user!.id, pageParam),
      {
        enabled: user ? true : false,
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.data.comments.length === 0) {
            return undefined;
          }
          return lastPage.data.comments[lastPage.data.comments.length - 1].id;
        },
      }
    );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <FlatList
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={() => {
        if (hasNextPage) fetchNextPage();
      }}
      ListHeaderComponent={
        <BluecardWrapperTitle>
          <BluecardWrapperTitleText>Comments</BluecardWrapperTitleText>
        </BluecardWrapperTitle>
      }
      contentContainerStyle={{ paddingBottom: 30 }}
      onEndReachedThreshold={0.75}
      data={data?.pages.map((page) => page.data.comments).flat()}
      renderItem={({ item }) => (
        <CommentContainer>
          <CommentUser
            touch={() =>
              navigation.navigate("BluecardDetail", {
                bluecardId: item.blueCardId,
              })
            }
            comment={item}
          />
        </CommentContainer>
      )}
      ItemSeparatorComponent={HSeparator}
    />
  );
};

export default UserComment;
