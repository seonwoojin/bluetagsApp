import styled from "styled-components/native";
import { NewsCard } from "../../libs/schema";
import { Shadow } from "react-native-shadow-2";

const NewsWrapper = styled.View`
  width: 100%;
  height: auto;
  margin-bottom: 50px;
  padding: 0 0% 0 0%;
`;

const NewsHead = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 25px;
  padding: 0px 15px 0px 15px;
  border-radius: 3px;
`;

const NewsHeadText = styled.Text`
  color: rgba(0, 0, 0, 1);
  font-weight: 600;
`;

const NewsTitle = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
  z-index: 2;
`;

const NewsTitleView = styled.View`
  width: 90%;
  height: auto;
`;

const NewsTitleText = styled.Text`
  font-size: 14px;
  font-weight: 600;
`;

const NewsTime = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  width: auto;
  height: 20px;
  background-color: #f2f2f2;
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
  padding-left: 6%;
`;

const NewsDescriptionText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
`;

const TagWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: auto;
  padding-left: 6%;
  margin-bottom: 20px;
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
  height: 20px;
  padding: 0px 10px 0px 10px;
  background-color: rgba(0, 0, 0, 0.04);
`;

const TagText = styled.Text`
  font-size: 12px;
`;

interface Props {
  newscard: NewsCard;
}

export default function Newscard({ newscard }: Props) {
  return (
    <NewsWrapper>
      <NewsTitle>
        <Shadow
          startColor="rgba(0, 0, 0, 0.16)"
          distance={1}
          containerStyle={{ marginRight: 20 }}
        >
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
        <NewsTitleView>
          <NewsTitleText>{newscard.title}</NewsTitleText>
        </NewsTitleView>
      </NewsTitle>
      <NewsDescription>
        <NewsDescriptionText>{newscard.description}</NewsDescriptionText>
      </NewsDescription>
      <TagWrapper>
        <Container>
          <Shadow startColor="rgba(0, 0, 0, 0.16)" distance={1}>
            <NewsHead>
              <NewsHeadText>{newscard.subject}</NewsHeadText>
            </NewsHead>
          </Shadow>
          {newscard.tags.map((tag, index) => (
            <Shadow key={index} startColor="rgba(0, 0, 0, 0.15)" distance={1}>
              <Tag>
                <TagText>{tag}</TagText>
              </Tag>
            </Shadow>
          ))}
        </Container>
      </TagWrapper>
    </NewsWrapper>
  );
}
