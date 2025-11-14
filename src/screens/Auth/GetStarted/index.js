import { useDispatch } from "react-redux";
import { ImageBackground, StyleSheet, View } from "react-native";
import React from "react";

import ScreenWrapper from "../../../components/ScreenWrapper";
import CustomButton from "../../../components/CustomButton";
import CustomText from "../../../components/CustomText";

import { setCustomer } from "../../../store/reducer/usersSlice";
import { image } from "../../../assets/images";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import ImageFast from "../../../components/ImageFast";
import { useNavigation } from "@react-navigation/native";

const GetStarted = () => {
  const navigation = useNavigation();
  return (
    <ScreenWrapper
      statusBarColor={"transparent"}
      translucent
      paddingHorizontal={0.1}
    >
      <ImageBackground source={image.startImage} style={styles.image}>
        <ImageFast
          source={image?.appIcon}
          resizeMode={"contain"}
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            marginBottom: 100,
          }}
        />
        {/* <CustomText
          label={"PANACHE"}
          fontFamily={fonts.bold}
          fontSize={28}
          color={COLORS.primaryColor}
          marginTop={20}
          marginBottom={0}
        />
        <CustomText
          label={"Book your date with Destinaay"}
          fontFamily={fonts.regular}
          fontSize={18}
          color={COLORS.white}
          marginBottom={20}
        /> */}

        <CustomButton
          title={"Sign in"}
          backgroundColor={"transparent"}
          borderWidth={1}
          borderColor={COLORS.primaryColor}
          color={COLORS.primaryColor}
          fontFamily={fonts.bold}
          fontSize={16}
          width={"90%"}
          onPress={() => navigation.navigate("Login")}
        />
        <CustomButton
          title={"Sign Up"}
          backgroundColor={COLORS.primaryColor}
          borderWidth={1}
          borderColor={COLORS.primaryColor}
          color={COLORS.black}
          fontFamily={fonts.bold}
          fontSize={16}
          width={"90%"}
          marginTop={20}
          onPress={() => navigation.navigate("Signup")}
        />
      </ImageBackground>
    </ScreenWrapper>
  );
};

export default GetStarted;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 30,
  },
});
