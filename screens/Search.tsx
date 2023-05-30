import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackNavParamList } from "../navigation/Root";

type SearchScreenProps = NativeStackScreenProps<
  HomeStackNavParamList,
  "Search"
>;

const Search = ({ route: { params }, navigation }: SearchScreenProps) => {
  console.log(params.query);
  return null;
};

export default Search;
