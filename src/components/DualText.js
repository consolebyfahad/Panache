import { StyleSheet } from "react-native";
import React from "react";

import CustomText from "./CustomText";

import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";

const DualText = ({ title, secondTitle, marginBottom, marginTop, onPress }) => {
  return (
    <CustomText
      fontSize={14}
      fontFamily={fonts.bold}
      alignSelf="center"
      color={COLORS.gray1}
      marginTop={marginTop}
      marginBottom={marginBottom}
      label={title}
    >
      <CustomText
        label={secondTitle}
        fontSize={14}
        onPress={onPress}
        fontFamily={fonts.bold}
        color={COLORS.primaryColor}
      />
    </CustomText>
  );
};

export default DualText;

const styles = StyleSheet.create({});
