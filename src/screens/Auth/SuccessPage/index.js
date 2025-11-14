import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";
import CustomText from "../../../components/CustomText";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import CustomButton from "../../../components/CustomButton";

const SuccessPage = ({ navigation, route }) => {
  const isAccountCreated = route?.params?.isAccountCreated;

  return (
    <ScreenWrapper
      footerUnScrollable={() => (
        <View style={{ paddingHorizontal: 20 }}>
          <CustomButton
            title="Explore"
            marginTop={40}
            marginBottom={20}
            color={COLORS.black}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Login",
                  },
                ],
              })
            }
          />
        </View>
      )}
    >
      <View style={{ marginTop: 250 }}>
        <ImageFast
          source={image.success}
          style={{ width: 160, height: 160, alignSelf: "center" }}
        />
        <CustomText
          label="Congratulations,"
          fontFamily={fonts.bold}
          fontSize={24}
          color={COLORS.primaryColor}
          alignSelf={"center"}
          marginTop={40}
        />
        <CustomText
          label={`Your account is successfully ${isAccountCreated? "Updated": "Created"}. You can now login to the app.`}
          color={COLORS.gray}
          fontSize={16}
          textAlign={"center"}
          fontFamily={fonts.medium}
          marginBottom={50}
        />
      </View>
    </ScreenWrapper>
  );
};

export default SuccessPage;

const styles = StyleSheet.create({});
