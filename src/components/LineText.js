import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

import CustomText from "./CustomText";
import Icons from "./Icons";

import fonts from "../assets/fonts";

const LineText = ({ marginTop, marginBottom, title, onSeeAllPress }) => {
  return (
    <View style={[styles.mainContainer, { marginBottom, marginTop }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.empty} />
        <CustomText
          label={title}
          color="#1A1D1F"
          fontFamily={fonts.semiBold}
          fontSize={18}
          marginLeft={10}
        />
      </View>
      {onSeeAllPress ? (
        <TouchableOpacity
          onPress={onSeeAllPress}
          activeOpacity={0.6}
          style={styles.seeAll}
        >
          <CustomText
            label="See All"
            fontSize={12}
            fontFamily={fonts.semiBold}
            color="#6F767E"
            marginRight={2}
          />
          <Icons
            color="#6F767E"
            family="Entypo"
            name="chevron-right"
            size={16}
            style={{ marginBottom: -2 }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default LineText;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  empty: {
    width: 4,
    height: 20,
    borderRadius: 100,
    backgroundColor: "#CABDFF",
  },
  seeAll: {
    height: 35,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
