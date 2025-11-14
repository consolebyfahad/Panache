import { StyleSheet, View } from "react-native";
import React from "react";

import CustomButton from "./CustomButton";
import CustomModal from "./CustomModal";
import CustomText from "./CustomText";
import ImageFast from "./ImageFast";

import { Images } from "../assets/images";
import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";
import { useTheme } from "../context/ThemeContext";

const Falsemodal = ({
  isVisible,
  onDisable,
  onPress,
  title,
  desc,
  buttonTitle,
  isPostCreated,
}) => {
  const { colors, toggleTheme, isDarkMode } = useTheme();

  return (
    <CustomModal
      isVisible={isVisible}
      // onDisable={onDisable}
      backdropOpacity={0.6}
    >
      <View style={[styles.mainContainer, { backgroundColor: colors.bg }]}>
        <ImageFast
          source={Images?.inValid}
          style={styles.img}
          resizeMode="contain"
        />
        <CustomText
          label={"Alert!"}
          fontFamily={fonts.bold}
          fontSize={24}
          color={colors.red}
          marginBottom={5}
          textAlign="center"
        />
        <CustomText
          label={"Ticket Already Scanned"}
          color={colors.black}
          textAlign="center"
          marginBottom={20}
          lineHeight={22}
        />
        <CustomButton title={buttonTitle} onPress={onPress} />
      </View>
    </CustomModal>
  );
};

export default Falsemodal;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
  },
  img: {
    width: 90,
    height: 90,
    marginBottom: 30,
  },
});
