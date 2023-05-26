import styled from "styled-components/native";

const BlueTags = styled.View<{ color: string; isWhite: string }>`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: auto;
  height: 24px;
  margin-right: 10px;
  margin-bottom: 5px;
  padding: 0px 15px;
  border-top-left-radius: 100px;
  border-top-right-radius: 9px;
  border-bottom-right-radius: 200px;
  border-bottom-left-radius: 100px;
  background-color: ${(props) => props.color};
  border: ${(props) =>
    props.isWhite === "true"
      ? "1px solid #0075ff"
      : `1px solid ${props.color}`};
`;

const BlueTagText = styled.Text<{ isWhite: string }>`
  color: ${(props) => (props.isWhite === "true" ? "#0075FF" : "#fafafa")};
  font-size: 13px;
  font-weight: 600;
`;

interface Props {
  color: string;
  width?: string;
  isWhite: string;
  text: string;
  className?: string;
}

export default function BlueTag({ color, text, isWhite }: Props) {
  return (
    <BlueTags color={color} isWhite={isWhite}>
      <BlueTagText isWhite={isWhite}>{text}</BlueTagText>
    </BlueTags>
  );
}
