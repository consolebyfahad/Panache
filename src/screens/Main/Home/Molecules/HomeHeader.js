import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ImageFast from "../../../../components/ImageFast";
import { image } from "../../../../assets/images";
import { useNavigation } from "@react-navigation/native";

const HomeHeader = () => {
  const navigation = useNavigation();
 

  return (
    <View
      style={{
        marginTop: 35,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <ImageFast
        source={image.menu}
        resizeMode={"contain"}
        style={{ height: 29, width: 29 }}
      />
      <ImageFast
        source={image?.appIcon}
        resizeMode={"contain"}
        style={{ height: 40, width: 40 }}
      />
      <ImageFast
       onPress={ () => navigation.navigate("Notifications")}
        source={image.noti}
        resizeMode={"contain"}
        style={{ height: 29, width: 29 }}
      />
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({});
