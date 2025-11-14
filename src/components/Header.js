import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";

import CustomText from "./CustomText";
import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";
import ImageFast from "./ImageFast";
import { image } from "../assets/images";

const Header = ({
  title,
  hideBackArrow,
  onBackPress,
  titleColor,
  isEdit,
  containerWidth,
  isScan,
  editPress,
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.mainContainer, { width: containerWidth || "100%" }]}>
      <View>
        {hideBackArrow ? null : (
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.backIcon]}
            onPress={
              onBackPress
                ? onBackPress
                : () => {
                    if (navigation.canGoBack()) navigation.goBack();
                  }
            }
          >
            <ImageFast
              source={isScan ? image.cross : image.backPrimary}
              style={{ width: 35, height: 35 }}
            />
          </TouchableOpacity>
        )}
      </View>
      <CustomText
        textTransform={"uppercase"}
        label={title}
        color={titleColor || COLORS.primaryColor}
        fontFamily={fonts.medium}
        fontSize={20}
      />
      {isEdit ? (
        <ImageFast
          onPress={editPress}
          source={image.edit}
          style={{ width: 28, height: 28 }}
        />
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginTop: 10,
  },
  backIcon: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});
