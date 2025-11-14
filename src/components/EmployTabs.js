import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

import CustomText from "./CustomText";

import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";

const EmployTabs = ({ tab, setTab, array }) => {
  return (
    <View style={styles.mainContainer}>
      {array.map((item) => (
        <TouchableOpacity
          onPress={() => setTab(item)}
          key={item}
          style={[
            styles.item,
            {
              width: "32%",
              height: 50,
              backgroundColor:
                tab == item ? COLORS.primaryColor : "transparent",
            },
          ]}
        >
          <CustomText
            label={item}
            color={tab == item ? COLORS.white : COLORS.inputLabel}
            fontFamily={tab == item ? fonts.semiBold : fonts.regular}
            fontSize={12}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default EmployTabs;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: COLORS.inputBg,
    width: "100%",
    height: 52,
    borderRadius: 100,
    marginBottom: 40,
    justifyContent: "start",
  },
  item: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#003F7D14",
  },
});
