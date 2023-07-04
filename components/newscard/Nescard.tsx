import styled from "styled-components/native";
import { NewsCard } from "../../libs/schema";
import { Shadow } from "react-native-shadow-2";

const NewsWrapper = styled.View`
  justify-content: center;
  width: 100%;
  height: auto;
  margin-top: 20px;
  margin-bottom: 15px;
  padding: 0px 10px;
`;

const NewsHead = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: 5px 15px 5px 15px;
  background: #89b8ff;
  border-radius: 3px;
`;

const NewsHeadText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: #ffffff;
`;

const NewsTitle = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  z-index: 2;
  background-color: white;
`;

const NewsContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  margin-top: 10px;
  padding: 10px;
  background: rgba(37, 124, 255, 0.02);
  border: 1px solid rgba(37, 124, 255, 0.05);
  border-radius: 15px;
`;

const NewsTitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
`;

const NewsTime = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 45px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.05);
`;

const NewsTimeText = styled.Text`
  font-size: 10px;
  font-weight: 400;
  letter-spacing: -1px;
`;

const NewsDescription = styled.View`
  width: 100%;
  height: auto;
  margin-bottom: 30px;
`;

const NewsDescriptionText = styled.Text`
  font-size: 12px;
  font-weight: 400;
`;

const TagWrapper = styled.View`
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: auto;
`;

const Container = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;

const Tag = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  padding: 5px 10px 5px 10px;
  background: #ffffff;
  border-radius: 4px;
  white-space: nowrap;
`;

const TagText = styled.Text`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: #2d3748;
`;

interface Props {
  newscard: NewsCard;
}

export default function Newscard({ newscard }: Props) {
  return (
    <NewsWrapper>
      <Shadow startColor="rgba(0, 0, 0, 0.1)" distance={2}>
        <NewsTime>
          <NewsTimeText>
            {`${
              new Date(newscard.createdAt).getHours() >= 10
                ? new Date(newscard.createdAt).getHours()
                : "0" + new Date(newscard.createdAt).getHours()
            } : ${
              new Date(newscard.createdAt).getMinutes() >= 10
                ? new Date(newscard.createdAt).getMinutes()
                : "0" + new Date(newscard.createdAt).getMinutes()
            }`}
          </NewsTimeText>
        </NewsTime>
      </Shadow>
      <NewsContainer>
        <NewsTitle>
          <NewsTitleText>{newscard.title}</NewsTitleText>
        </NewsTitle>
        <NewsDescription>
          <NewsDescriptionText>{newscard.description}</NewsDescriptionText>
        </NewsDescription>
        <TagWrapper>
          <Container>
            <Shadow
              style={{ marginRight: 10, borderRadius: 3 }}
              startColor="rgba(0, 0, 0, 0.16)"
              distance={2}
            >
              <NewsHead>
                <NewsHeadText>{newscard.subject}</NewsHeadText>
              </NewsHead>
            </Shadow>
            {newscard.tags.map((tag, index) => (
              <Shadow key={index} startColor="rgba(0, 0, 0, 0.04)" distance={3}>
                <Tag>
                  <TagText>{tag}</TagText>
                </Tag>
              </Shadow>
            ))}
          </Container>
          {/* <KakaoWrapper>
          <Like
            type="newscards"
            likeNum={newscard.like}
            unlikeNum={newscard.unlike}
            id={newscard.id}
          />
          <KakaoShare
            title={newscard.title}
            description={newscard.description}
            url={`https://www.bluetags.app/news/${newscard.id}`}
          />
        </KakaoWrapper> */}
        </TagWrapper>
      </NewsContainer>
    </NewsWrapper>
  );
}
