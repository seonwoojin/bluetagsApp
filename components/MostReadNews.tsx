import { useQuery } from "react-query";
import { NewsCard } from "../libs/schema";
import styled from "styled-components/native";
import Dimension from "../libs/useDimension";
import { mostReadNews } from "../libs/api";

const NewsWrapper = styled.View`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: ${Dimension.width}px;
  height: auto;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 0px;
`;

const NewsTitle = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0px 20px;
`;

const NewsTitleText = styled.Text`
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #010101;
`;

const NewsList = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
  gap: 10px;
`;

const NewsContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  gap: 10px;
`;

const NewsIndex = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
`;

const NewsIndexText = styled.Text`
  font-weight: 600;
  font-size: 26px;
  color: #93989a;
`;

const NewsListTitle = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 85%;
  height: auto;
  overflow: hidden;
`;

const NewsListTitleText = styled.Text`
  font-weight: 400;
  font-size: 12px;
  color: #212434;
`;

interface Props {
  isHome?: boolean;
  classname?: string;
}

interface Response {
  data: {
    newscards: NewsCard[];
  };
}

export default function MostReadNews() {
  const { data, isLoading } = useQuery<Response>("mostReadNews", mostReadNews);

  return (
    <NewsWrapper>
      <NewsTitle>
        <NewsTitleText>TRENDING NEWS</NewsTitleText>
      </NewsTitle>
      <NewsList>
        {data?.data.newscards
          ? data.data.newscards.map((newscard, index) => (
              <NewsContainer key={index}>
                <NewsIndex>
                  <NewsIndexText>{index + 1}</NewsIndexText>
                </NewsIndex>
                <NewsListTitle>
                  <NewsListTitleText numberOfLines={2}>
                    {newscard.title}
                  </NewsListTitleText>
                </NewsListTitle>
              </NewsContainer>
            ))
          : null}
      </NewsList>
    </NewsWrapper>
  );
}
