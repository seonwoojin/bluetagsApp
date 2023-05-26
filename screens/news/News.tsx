import { Image, View, Text, StyleSheet } from "react-native";
const News = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "teal",
      }}
    >
      <Text>12312</Text>
      <Image
        style={StyleSheet.absoluteFill}
        source={{
          uri: "https://imagedelivery.net/o9OxHWpSBsqZquvzmxx1bQ/043306e6-d158-4a24-d4b4-6b13da85ce00/thumbnail",
        }}
      />
    </View>
  );
};

export default News;
