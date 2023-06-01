import styled from "styled-components/native";
import Dimension from "../../libs/useDimension";
import { useEffect, useState } from "react";
import { Path, Svg } from "react-native-svg";
import { TouchableWithoutFeedback, View } from "react-native";
import { Shadow } from "react-native-shadow-2";
import axios from "axios";
import { BluecardWithProject, Project } from "../../libs/schema";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { CalendarStackNavParamList } from "../../navigation/Root";

const Scroll = styled.ScrollView``;

const Wrapper = styled.View`
  justify-content: flex-start;
  align-items: center;
  width: ${Dimension.width}px;
  height: ${Dimension.height * 2}px;
  padding-top: 30px;
`;

const NavWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
  height: 60px;
  margin-bottom: 10px;
`;

const DateWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
  gap: 20px;
`;

const MonthText = styled.Text`
  font-size: 20px;
  font-weight: 400;
  color: #1b1b21;
`;

const YearText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #1b1b21;
`;

const ButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
  gap: 20px;
`;

const CalendarWrapper = styled.View`
  width: ${Dimension.width * 0.9}px;
  height: auto;
  min-height: 500px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: #ffffff;
  border: 1px solid #d1d2d4;
  border-radius: 10px;
`;

const DayWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 80px;
`;

const DayView = styled.View`
  justify-content: center;
  align-items: center;
  width: 14.2%;
  height: 100%;
`;

const DayText = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #8c8f94;
`;

const WeekWrapper = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 90px;
  margin-bottom: 10px;
  background-color: beige;
`;

const Tile = styled.View`
  position: relative;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0px;
  width: 14.2%;
  height: 100%;
  border: 1px solid #f0f0f0;
  background-color: #f9f9f9;
  z-index: 10;
`;

const TileText = styled.Text<{ class: string }>`
  font-size: 11px;
  color: ${(props) =>
    props.class === "LAST"
      ? "rgba(0, 0, 0, 0.4)"
      : props.class === "WEEK"
      ? "red"
      : "rgba(0, 0, 0, 1)"};
  margin-left: 5px;
`;

const ContentContainer = styled.View`
  width: 100%;
  height: 10px;
`;

const ContentText = styled.Text`
  color: black;
  font-size: 6px;
`;

const EmptyDiv = styled.View`
  margin-right: 5px;
`;

const TodoStartDiv = styled.View<{
  leftDays: number;
  day: number;
  tag: string;
}>`
  pointer-events: none;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 12px;
  margin-top: 5px;
  margin-left: 5px;
  border-radius: 5px;
  padding: 0px 5px;
  width: ${(props) =>
    props.leftDays <= props.day
      ? props.leftDays > 1
        ? `${
            Dimension.width * 0.12 * (2 + (props.leftDays - 1)) +
            2 * (props.leftDays - 1) -
            10
          }px`
        : props.leftDays === 1
        ? `${Dimension.width * 0.12 * 2 - 8}px`
        : `${Dimension.width * 0.12 - 10}px`
      : `${
          Dimension.width * 0.12 * (2 + (props.day - 1)) +
          2 * (props.day + 1) -
          12
        }px`};
  background-color: ${(props) =>
    props.tag === "event"
      ? "#64b5ff"
      : props.tag === "minting"
      ? "#9dce99"
      : props.tag === "voting"
      ? "#ffa0d3"
      : "#fcc53a"};
`;

const DotContainer = styled.View`
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  height: 17px;
  padding-right: 5px;
`;

const DotContainerText = styled.Text`
  color: black;
  font-size: 12px;
`;

const TodoText = styled.Text`
  color: white;
  font-size: 8px;
`;

const BetweenDiv = styled.View`
  width: 100%;
  height: 12px;
  margin-bottom: 5px;
  z-index: 20;
`;

const monthArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface TileType {
  day: Date;
  class: "LAST" | "THIS" | "WEEK";
  content: string[];
  lastTiles: string[];
}

function getRemainWeeks(date: Date, calendarDatas: BluecardWithProject[]) {
  const array: TileType[][] = [];
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const totalDays = lastDay.getDate();
  const startOffset = firstDay.getDay(); // 일요일(0)부터 토요일(6)까지의 숫자 반환
  const remainingDays = totalDays - (7 - startOffset);
  const weekCount = Math.ceil(remainingDays / 7);
  const lastDayOfLastMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  const lastMonthStartDay = lastDayOfLastMonth - startOffset + 1;
  for (let i = 0; i < weekCount + 1; i++) {
    const week: TileType[] = [];
    let next = 1;
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startOffset) {
        week.push({
          day: new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            lastMonthStartDay + j
          ),
          class: "LAST",
          content: ["possible"],
          lastTiles: [],
        });
      } else if (i === weekCount) {
        if (7 * i + j - startOffset + 1 <= lastDay.getDate()) {
          if (j === 0 || j === 6) {
            week.push({
              day: new Date(
                date.getFullYear(),
                date.getMonth(),
                7 * i + j - startOffset + 1
              ),
              class: "WEEK",
              content: ["possible"],
              lastTiles: [],
            });
          } else {
            week.push({
              day: new Date(
                date.getFullYear(),
                date.getMonth(),
                7 * i + j - startOffset + 1
              ),
              class: "THIS",
              content: ["possible"],
              lastTiles: [],
            });
          }
        } else {
          week.push({
            day: new Date(date.getFullYear(), date.getMonth() + 1, next),
            class: "LAST",
            content: ["possible"],
            lastTiles: [],
          });
          next = next + 1;
        }
      } else {
        if (j === 0 || j === 6) {
          week.push({
            day: new Date(
              date.getFullYear(),
              date.getMonth(),
              7 * i + j - startOffset + 1
            ),
            class: "WEEK",
            content: ["possible"],
            lastTiles: [],
          });
        } else {
          week.push({
            day: new Date(
              date.getFullYear(),
              date.getMonth(),
              7 * i + j - startOffset + 1
            ),
            class: "THIS",
            content: ["possible"],
            lastTiles: [],
          });
        }
      }
    }
    array.push(week);
  }

  for (let t = 0; t < array.length; t++) {
    for (let i = 0; i < array[t].length; i++) {
      if (i === 0) {
        const sundayToDos = calendarDatas
          .filter(
            (data, index) =>
              new Date(
                new Date(new Date(data.deadLineStart!).setHours(0)).setMinutes(
                  0
                )
              ) <= array[t][0].day &&
              new Date(data.deadLineEnd!) >= array[t][0].day
          )
          .sort((toDoA, toDoB) => {
            if (
              new Date(toDoA.deadLineEnd!).getTime() -
                new Date(toDoA.deadLineStart!).getTime() >
              new Date(toDoB.deadLineEnd!).getTime() -
                new Date(toDoB.deadLineStart!).getTime()
            ) {
              return -1;
            }
            return 0;
          });
        for (let j = 0; j < sundayToDos.length; j++) {
          let lastDays = Math.ceil(
            (new Date(sundayToDos[j].deadLineEnd!).getTime() -
              array[t][0].day.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (lastDays > 7) lastDays = 7;
          const indexOfPossible = array[t][i].content.findIndex(
            (element) => element === "possible"
          );
          if (indexOfPossible >= 0) {
            array[t][i].content[indexOfPossible] = sundayToDos[j].id;
            array[t][i].content.push("possible");
            for (let k = 0; k < lastDays - 1; k++) {
              if (i + 1 + k < 7) {
                array[t][i + 1 + k].content[
                  indexOfPossible
                ] = `empty/${sundayToDos[j].id}`;
                array[t][i + 1 + k].content.push("possible");
              }
            }
            if (i + lastDays < 7) {
              array[t][i + lastDays].content[indexOfPossible] = "possible";
            }
          }
        }
      } else {
        const toDos = calendarDatas
          .filter(
            (data, index) =>
              new Date(new Date(data.deadLineStart!)).toDateString() ===
              array[t][i].day.toDateString()
          )
          .sort((toDoA, toDoB) => {
            if (
              new Date(toDoA.deadLineEnd!).getTime() -
                new Date(toDoA.deadLineStart!).getTime() >
              new Date(toDoB.deadLineEnd!).getTime() -
                new Date(toDoB.deadLineStart!).getTime()
            ) {
              return -1;
            }
            return 0;
          });
        for (let j = 0; j < toDos.length; j++) {
          let lastDays = Math.ceil(
            (new Date(toDos[j].deadLineEnd!).getTime() -
              array[t][i].day.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          if (lastDays > 7) lastDays = 7;
          const indexOfPossible = array[t][i].content.findIndex(
            (element) => element === "possible"
          );
          if (indexOfPossible >= 0) {
            array[t][i].content[indexOfPossible] = toDos[j].id;
            array[t][i].content.push("possible");
            for (let k = 0; k < lastDays - 1; k++) {
              if (i + 1 + k < 7) {
                array[t][i + 1 + k].content[
                  indexOfPossible
                ] = `empty/${toDos[j].id}`;
                array[t][i + 1 + k].content.push("possible");
              }
            }
            if (i + lastDays < 7) {
              array[t][i + lastDays].content[indexOfPossible] = "possible";
            }
          }
        }
      }
      let count = 0;
      for (let q = 0; q < array[t][i].content.length; q++) {
        if (array[t][i].content[q] !== "possible") {
          count++;
        }
        if (count > 3) {
          for (let w = 3; w < array[t][i].content.length; w++) {
            if (!array[t][i].content[w].includes("possible")) {
              array[t][i].lastTiles.push(array[t][i].content[w]);
            }
          }
          array[t][i].content = array[t][i].content.slice(0, 3);
        }
      }
    }
  }

  return array;
}

interface ResponseData {
  bluecards: BluecardWithProject[];
}

interface Props {
  setCalendarDetail: React.Dispatch<React.SetStateAction<string>>;
  setToDos: React.Dispatch<React.SetStateAction<BluecardWithProject[]>>;
  setTodayDate: React.Dispatch<React.SetStateAction<Date>>;
}

const Calendar = ({ setCalendarDetail, setToDos, setTodayDate }: Props) => {
  const navigation = useNavigation<NavigationProp<CalendarStackNavParamList>>();
  const [date, setDate] = useState(new Date());
  const [weeks, setWeeks] = useState(getRemainWeeks(new Date(), []));
  const [yearArray, setYearArray] = useState<number[]>([]);
  const [calendarDatas, setCalendarDatas] = useState<BluecardWithProject[]>([]);
  useEffect(() => {
    setWeeks(getRemainWeeks(date, calendarDatas));
  }, [date.getMonth(), calendarDatas]);

  useEffect(() => {
    if (!yearArray.includes(date.getFullYear())) {
      axios
        .get<ResponseData>(
          `https://www.bluetags.app/api/bluecards?calendar=true&year=${date.getFullYear()}`
        )
        .then((response) => {
          setYearArray((prev) => [...prev, date.getFullYear()]);
          setCalendarDatas((prev) => [...prev, ...response.data.bluecards]);
        })
        .catch((error) => console.log(error));
    }
  }, [date.getFullYear(), yearArray]);

  useEffect(() => {
    setToDos(calendarDatas);
  }, [calendarDatas]);

  return (
    <Scroll>
      {weeks.length > 0 ? (
        <Wrapper>
          <NavWrapper>
            <DateWrapper>
              <MonthText>{monthArray[date.getMonth()]}</MonthText>
              <YearText>{date.getFullYear()}</YearText>
            </DateWrapper>
            <ButtonWrapper>
              <TouchableWithoutFeedback
                onPress={() => {
                  setDate(new Date(date.setMonth(date.getMonth() - 1)));
                }}
              >
                <Svg
                  width={20}
                  height={20}
                  fill={"#1b1b21"}
                  viewBox="0 0 320 512"
                >
                  <Path d="M234.8 36.25c3.438 3.141 5.156 7.438 5.156 11.75c0 3.891-1.406 7.781-4.25 10.86L53.77 256l181.1 197.1c6 6.5 5.625 16.64-.9062 22.61c-6.5 6-16.59 5.594-22.59-.8906l-192-208c-5.688-6.156-5.688-15.56 0-21.72l192-208C218.2 30.66 228.3 30.25 234.8 36.25z" />
                </Svg>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  setDate(new Date(date.setMonth(date.getMonth() + 1)));
                }}
              >
                <Svg
                  width={20}
                  height={20}
                  fill={"#1b1b21"}
                  viewBox="0 0 320 512"
                >
                  <Path d="M85.14 475.8c-3.438-3.141-5.156-7.438-5.156-11.75c0-3.891 1.406-7.781 4.25-10.86l181.1-197.1L84.23 58.86c-6-6.5-5.625-16.64 .9062-22.61c6.5-6 16.59-5.594 22.59 .8906l192 208c5.688 6.156 5.688 15.56 0 21.72l-192 208C101.7 481.3 91.64 481.8 85.14 475.8z" />
                </Svg>
              </TouchableWithoutFeedback>
            </ButtonWrapper>
          </NavWrapper>
          <Shadow
            startColor="rgba(17, 17, 26, 0.1)"
            distance={10}
            style={{ borderRadius: 10 }}
          >
            <CalendarWrapper>
              <DayWrapper>
                <DayView>
                  <DayText>SUN</DayText>
                </DayView>
                <DayView>
                  <DayText>MON</DayText>
                </DayView>
                <DayView>
                  <DayText>TUE</DayText>
                </DayView>
                <DayView>
                  <DayText>WED</DayText>
                </DayView>
                <DayView>
                  <DayText>THU</DayText>
                </DayView>
                <DayView>
                  <DayText>FRI</DayText>
                </DayView>
                <DayView>
                  <DayText>SAT</DayText>
                </DayView>
              </DayWrapper>
              {weeks.map((array, index) => (
                <WeekWrapper key={index}>
                  {array.map((day, index2) => (
                    <TouchableWithoutFeedback
                      key={index2}
                      onPress={() => {
                        if (date.getMonth() === day.day.getMonth()) {
                          setTodayDate(day.day);
                          setCalendarDetail(day.day.toString());
                        }
                        setDate(day.day);
                      }}
                    >
                      <Tile style={{ zIndex: 10 - index2 }}>
                        <TileText class={day.class}>
                          {day.day.getDate()}
                        </TileText>
                        {day.content.map((id, index4) =>
                          !id.includes("empty") && !id.includes("possible") ? (
                            calendarDatas.map((data) =>
                              data.id === id ? (
                                <TodoStartDiv
                                  tag={data.bluetags[0].toLowerCase()}
                                  leftDays={
                                    day.day.getDay() === 0
                                      ? Math.floor(
                                          (new Date(
                                            data.deadLineEnd!
                                          ).getTime() -
                                            day.day.getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        )
                                      : Math.floor(
                                          (new Date(
                                            data.deadLineEnd!
                                          ).getTime() -
                                            day.day.getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        )
                                  }
                                  day={6 - day.day.getDay()}
                                  key={index4}
                                >
                                  <TodoText
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                  >
                                    {data.title}
                                  </TodoText>
                                </TodoStartDiv>
                              ) : null
                            )
                          ) : id.includes("empty") ? (
                            <BetweenDiv key={`empty${index4}`} />
                          ) : id.includes("possible") && index < 4 ? (
                            <BetweenDiv key={`possible${index4}`} />
                          ) : null
                        )}
                        {day.lastTiles.length > 0 ? (
                          <DotContainer>
                            <DotContainerText>{`+${day.lastTiles.length}`}</DotContainerText>
                          </DotContainer>
                        ) : null}
                      </Tile>
                    </TouchableWithoutFeedback>
                  ))}
                </WeekWrapper>
              ))}
            </CalendarWrapper>
          </Shadow>
        </Wrapper>
      ) : null}
    </Scroll>
  );
};

export default Calendar;
