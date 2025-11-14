import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

import { Images } from "../../../../assets/images";
import { COLORS } from "../../../../utils/COLORS";
import CustomText from "../../../../components/CustomText";
import fonts from "../../../../assets/fonts";
import { useTheme } from "../../../../context/ThemeContext";

const SocialIcon = ({ googlePress, applePress }) => {
  const { colors, toggleTheme, isDarkMode } = useTheme(); // Access theme and toggleTheme

  const array = [
    // {
    //   id: 1,
    //   img: Images.apple,
    //   title: "Login with Apple",
    //   onPress: applePress,
    // },
    {
      id: 2,
      img: Images.google,
      title: "Login with Google",
      onPress: googlePress,
    },
  ];
  return (
    <View>
      {array.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.item,
            {
              backgroundColor: item.id == 1 ? "#FFFFFF" : "transparent",
              borderColor: item.id == 2 ? COLORS.inputBorder : "transparent",
            },
          ]}
          onPress={item.onPress}
        >
          <Image
            source={item.img}
            style={[styles.icon, { tintColor: item.id == 1 && COLORS.white }]}
          />
          <CustomText
            label={item.title}
            fontSize={16}
            marginLeft={10}
            fontFamily={fonts.medium}
            color={item.id == 1 ? colors.black : colors.black}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SocialIcon;

const styles = StyleSheet.create({
  item: {
    width: "100%",
    height: 58,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
