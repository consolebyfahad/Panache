import { Dimensions, Image, StyleSheet, View } from "react-native";
import React from "react";


import { Images } from "../assets/images";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";
import CustomText from "./CustomText";

const NoDataFound = ({ title, marginTop, source, desc }) => {
  const { colors, toggleTheme, isDarkMode } = useTheme();

  return (
    <View style={styles.mainContainer}>
      {/* <Image
        style={[styles.image, { marginTop: marginTop || 80 }]}
        source={source || Images.noShowImage}
      /> */}
      <CustomText
        label={title || "noDataFound"}
        fontFamily={fonts.bold}
        fontSize={18}
        textAlign="center"
        color={COLORS.primaryColor}
        marginTop={15}
      />
      <CustomText
        label={desc}
        fontFamily={fonts.medium}
        fontSize={16}
        textAlign="center"
        color={COLORS.primaryColor}
        marginTop={10}
        lineHeight={25}
      />
    </View>
  );
};

export default NoDataFound;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: 450,
    width: Dimensions.get("window").width - 40,
    paddingHorizontal: 35,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
