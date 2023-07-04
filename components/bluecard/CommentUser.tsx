import { Path, Rect, Svg } from "react-native-svg";
import styled from "styled-components/native";
import { ScrollView, TouchableWithoutFeedback } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { CommentWithUser } from "../../libs/schema";
import { useUser } from "../../libs/context";
import axios from "axios";
import { Shadow } from "react-native-shadow-2";

const UserCommentWrapper = styled.View`
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 10px;
`;

const CommentTextInputScroll = styled.ScrollView`
  width: 100%;
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  margin-bottom: 20px;
`;

const CommentTextInput = styled.TextInput`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  color: #212434;
`;

const UserCommentTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-bottom: 10px;
  z-index: 99;
`;

const UserProfile = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const UserImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 12px;
`;

const UserName = styled.View`
  flex-direction: row;
  align-items: center;
  width: auto;
  height: 100%;
`;

const UserNameText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #2d3748;
`;

const CreatedAt = styled.View`
  flex-direction: row;
  align-items: center;
  width: auto;
  height: 100%;
`;

const CreatedAtText = styled.Text`
  font-weight: 400;
  font-size: 14px;
  color: #aaaaaa;
`;

const InfoContainer = styled.View`
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
`;

const InfoDetail = styled.View`
  position: absolute;
  top: 30px;
  right: 0px;
  width: 100px;
  height: 60px;
  background-color: #ffffff;
`;

const InfoDetailH1 = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 5px;
`;

const InfoDetailH1Text = styled.Text`
  font-size: 12px;
`;

const CommentText = styled.View`
  display: flex;
  justify-content: center;
  width: 100%;
  height: auto;
  z-index: 10;
`;

const CommentTextText = styled.Text`
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  color: #212434;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: auto;
  gap: 10px;
`;

const EditButton = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 48%;
  height: 30px;
  margin-top: 10px;
  background: #191f28;
  border-radius: 5px;
`;

const EditButtonText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

const Reply = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
`;

const ReplyText = styled.Text`
  font-weight: 300;
  font-size: 14px;
  color: #aaaaaa;
`;

const Optionwrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-top: 30px;
`;

interface Props {
  comment: CommentWithUser;
  setCommentDetail?: Dispatch<SetStateAction<string>>;
  setCommentEditText?: Dispatch<SetStateAction<string>>;
  setCommentEdit?: Dispatch<SetStateAction<string>>;
  commentDetail?: string;
  commentEdit?: string;
  commentEditText?: string;
  mutate?: any;
}

export default function CommentUser({
  comment,
  commentDetail,
  commentEditText,
  commentEdit,
  setCommentDetail,
  setCommentEdit,
  setCommentEditText,
  mutate,
}: Props) {
  const user = useUser();

  const onEdit = async (id: string) => {
    if (setCommentDetail && setCommentEdit && setCommentEditText) {
      if (commentEditText?.replaceAll(" ", "") === "") {
        return;
      }
      await axios
        .post("https://www.bluetags.app/api/comments/edit", {
          id,
          text: commentEditText,
        })
        .then(() => {
          setCommentDetail("");
          setCommentEdit("");
          mutate();
        })
        .catch((error) => {});
    }
  };

  const onclick = async (id: string) => {
    await axios
      .post("https://www.bluetags.app/api/comments/delete", { id })
      .then(() => {
        mutate();
      })
      .catch((error) => {});
  };

  return (
    <UserCommentWrapper
      style={{ borderTopColor: "#e2e8f0", borderTopWidth: 1 }}
    >
      <UserCommentTitle>
        <UserProfile>
          {comment.user.profile === "" ? (
            <Svg width="60" height="60" viewBox="0 0 40 40" fill="none">
              <Rect width="40" height="40" rx="20" fill="#DDDDDD" />
            </Svg>
          ) : comment.user.profile.includes("googleusercontent") ? (
            <UserImage source={{ uri: comment.user.profile }} />
          ) : (
            <UserImage
              source={{
                uri: `https://imagedelivery.net/o9OxHWpSBsqZquvzmxx1bQ/${comment.user.profile}/avatar`,
              }}
            />
          )}
          <UserName>
            <UserNameText>{comment.user.name}</UserNameText>
          </UserName>
          <CreatedAt>
            <CreatedAtText>
              {new Date(comment.createdAt).toDateString()}
            </CreatedAtText>
          </CreatedAt>
        </UserProfile>
        {user.user?.id === comment.userId &&
        setCommentDetail &&
        setCommentEdit &&
        setCommentEditText ? (
          <TouchableWithoutFeedback
            onPress={() => {
              if (commentDetail === comment.id) setCommentDetail("");
              else setCommentDetail(comment.id);
            }}
          >
            <InfoContainer>
              <Svg width="7" height="20" viewBox="0 0 7 28" fill="none">
                <Path
                  d="M3.88492 21.2692C3.05866 21.2692 2.26625 21.5975 1.68201 22.1817C1.09776 22.766 0.769531 23.5584 0.769531 24.3846C0.769531 25.2109 1.09776 26.0033 1.68201 26.5875C2.26625 27.1718 3.05866 27.5 3.88492 27.5C4.71117 27.5 5.50358 27.1718 6.08783 26.5875C6.67207 26.0033 7.0003 25.2109 7.0003 24.3846C7.0003 23.5584 6.67207 22.766 6.08783 22.1817C5.50358 21.5975 4.71117 21.2692 3.88492 21.2692ZM3.88492 10.8846C3.05866 10.8846 2.26625 11.2128 1.68201 11.7971C1.09776 12.3813 0.769531 13.1737 0.769531 14C0.769531 14.8263 1.09776 15.6187 1.68201 16.2029C2.26625 16.7872 3.05866 17.1154 3.88492 17.1154C4.71117 17.1154 5.50358 16.7872 6.08783 16.2029C6.67207 15.6187 7.0003 14.8263 7.0003 14C7.0003 13.1737 6.67207 12.3813 6.08783 11.7971C5.50358 11.2128 4.71117 10.8846 3.88492 10.8846ZM7.0003 3.61538C7.0003 3.20627 6.91972 2.80115 6.76316 2.42318C6.60659 2.0452 6.37712 1.70177 6.08783 1.41247C5.79854 1.12318 5.4551 0.893707 5.07712 0.737145C4.69915 0.580582 4.29403 0.5 3.88492 0.5C3.4758 0.5 3.07069 0.580582 2.69271 0.737145C2.31473 0.893707 1.9713 1.12318 1.68201 1.41247C1.39272 1.70177 1.16324 2.0452 1.00668 2.42318C0.850113 2.80115 0.769531 3.20627 0.769531 3.61538C0.769531 4.0245 0.850113 4.42961 1.00668 4.80759C1.16324 5.18557 1.39272 5.529 1.68201 5.81829C1.9713 6.10758 2.31473 6.33706 2.69271 6.49363C3.07069 6.65019 3.4758 6.73077 3.88492 6.73077C4.29403 6.73077 4.69915 6.65019 5.07712 6.49363C5.4551 6.33706 5.79854 6.10758 6.08783 5.81829C6.37712 5.529 6.60659 5.18557 6.76316 4.80759C6.91972 4.42961 7.0003 4.0245 7.0003 3.61538Z"
                  fill="#212434"
                />
              </Svg>
              {commentDetail === comment.id ? (
                <InfoDetail>
                  <Shadow
                    style={{
                      width: 100,
                      height: 60,
                      paddingHorizontal: 20,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                    }}
                    distance={4}
                    startColor="rgba(99, 99, 99, 0.05)"
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setCommentEdit(comment.id);
                        setCommentEditText(comment.text);
                        setCommentDetail("");
                      }}
                    >
                      <InfoDetailH1>
                        <Svg
                          width="9"
                          height="10"
                          viewBox="0 0 9 10"
                          fill="none"
                        >
                          <Path
                            d="M0 7.72978V9.24978C0 9.38978 0.11 9.49978 0.25 9.49978H1.77C1.835 9.49978 1.9 9.47478 1.945 9.42478L7.405 3.96978L5.53 2.09479L0.075 7.54978C0.025 7.59978 0 7.65978 0 7.72978ZM8.855 2.51978C9.05 2.32478 9.05 2.00979 8.855 1.81479L7.685 0.644785C7.49 0.449785 7.175 0.449785 6.98 0.644785L6.065 1.55979L7.94 3.43478L8.855 2.51978V2.51978Z"
                            fill="#2D3748"
                          />
                        </Svg>
                        <InfoDetailH1Text>Edit</InfoDetailH1Text>
                      </InfoDetailH1>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                      onPress={() => onclick(comment.id)}
                    >
                      <InfoDetailH1>
                        <Svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                        >
                          <Path
                            d="M0.75 10.875C0.75 11.5625 1.3125 12.125 2 12.125H7C7.6875 12.125 8.25 11.5625 8.25 10.875V4.625C8.25 3.9375 7.6875 3.375 7 3.375H2C1.3125 3.375 0.75 3.9375 0.75 4.625V10.875ZM8.25 1.5H6.6875L6.24375 1.05625C6.13125 0.94375 5.96875 0.875 5.80625 0.875H3.19375C3.03125 0.875 2.86875 0.94375 2.75625 1.05625L2.3125 1.5H0.75C0.40625 1.5 0.125 1.78125 0.125 2.125C0.125 2.46875 0.40625 2.75 0.75 2.75H8.25C8.59375 2.75 8.875 2.46875 8.875 2.125C8.875 1.78125 8.59375 1.5 8.25 1.5Z"
                            fill="#E53E3E"
                          />
                        </Svg>
                        <InfoDetailH1Text style={{ color: "red" }}>
                          Delete
                        </InfoDetailH1Text>
                      </InfoDetailH1>
                    </TouchableWithoutFeedback>
                  </Shadow>
                </InfoDetail>
              ) : null}
            </InfoContainer>
          </TouchableWithoutFeedback>
        ) : null}
      </UserCommentTitle>
      {commentEdit === comment.id && setCommentEditText && setCommentEdit ? (
        <>
          <CommentTextInputScroll>
            <CommentTextInput
              editable
              multiline
              numberOfLines={6}
              onChangeText={(text) => setCommentEditText(text)}
              value={commentEditText}
              placeholder="Your comment"
              placeholderTextColor={"rgba(0, 0, 0, 0.4)"}
              textAlignVertical="top"
            />
          </CommentTextInputScroll>
          <ButtonWrapper>
            <TouchableWithoutFeedback onPress={() => setCommentEdit("")}>
              <EditButton>
                <EditButtonText>Cancel</EditButtonText>
              </EditButton>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => onEdit(comment.id)}>
              <EditButton>
                <EditButtonText>Edit</EditButtonText>
              </EditButton>
            </TouchableWithoutFeedback>
          </ButtonWrapper>
        </>
      ) : (
        <CommentText>
          <CommentTextText>{comment.text}</CommentTextText>
        </CommentText>
      )}
      <Optionwrapper>
        <Reply>
          <ReplyText>Reply</ReplyText>
        </Reply>
        {/* <Like
          type="comments"
          id={comment.id}
          likeNum={comment.like}
          unlikeNum={0}
        /> */}
      </Optionwrapper>
    </UserCommentWrapper>
  );
}
