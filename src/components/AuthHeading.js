import { StyleSheet, View } from "react-native";
import React from "react";

import CustomText from "./CustomText";

import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";

const AuthHeading = ({ title, desc }) => {
  return (
    <View style={styles.container}>
      <CustomText
        label={title}
        fontFamily={fonts.bold}
        fontSize={24}
        color={COLORS.black}
        marginBottom={5}
      />
      <CustomText
        label={desc}
        fontSize={13}
        lineHeight={18}
        marginBottom={50}
      />
    </View>
  );
};

export default AuthHeading;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // alignItems: "center",
    marginTop: 20,
  },
});
