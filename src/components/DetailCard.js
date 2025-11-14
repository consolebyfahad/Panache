import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

import CustomButton from "./CustomButton";
import CustomText from "./CustomText";
import ImageFast from "./ImageFast";

import { Images } from "../assets/images";
import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";
import { useNavigation } from "@react-navigation/native";
import CustomRating from "./CustomRating";
import Icons from "./Icons";

const DetailCard = ({
  status,
  marginBottom,
  marginTop,
  isEmployeDetaal,
  orderbtn,
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.mainContainer, { marginBottom, marginTop }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("ApplicationDetails")}
        style={styles.container}
      >
        <View>
          <ImageFast source={Images.placeholderImage} style={styles.profile1} />
          <ImageFast source={Images.placeholderImage} style={styles.profile} />

          <View style={styles.statusContainer1}>
            <CustomText
              label={"Completed"}
              color={"#009005"}
              fontFamily={fonts.medium}
              fontSize={12}
              textTransform="capitalize"
            />
          </View>
        </View>

        <View style={{ width: "63%" }}>
          <CustomText
            label="House Cleaning Service"
            fontFamily={fonts.semiBold}
            marginTop={8}
            marginBottom={5}
          />
          <View
            style={[
              styles.row,
              {
                borderBottomColor: COLORS.border,
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 8,
              },
            ]}
          >
            <Image source={Images.location} style={styles.icn} />
            <CustomText
              label="San Francisco, CA"
              color={COLORS.inputLabel}
              fontSize={12}
              marginLeft={5}
            />
          </View>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <CustomText
              label="Category"
              color={COLORS.subtxt}
              fontSize={12}
              fontFamily={fonts.semiBold}
            />
            <View style={styles.statusContainer}>
              <CustomText
                label={"Cleaning"}
                color={"#FF8E00"}
                fontFamily={fonts.medium}
                fontSize={12}
                textTransform="capitalize"
              />
            </View>
          </View>
          <View
            style={[
              styles.row,
              { justifyContent: "space-between", marginTop: 5 },
            ]}
          >
            <CustomText
              label="Rating"
              color={COLORS.subtxt}
              fontSize={12}
              fontFamily={fonts.semiBold}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CustomRating
                size={15}
                value={1}
                disabled={true}
                totalStars={1}
              />
              <CustomText
                label="4.4(343)"
                color={COLORS.primaryColor}
                fontSize={12}
                fontFamily={fonts.semiBold}
              />
            </View>
          </View>

          <View
            style={[
              styles.row,
              { justifyContent: "space-between", marginTop: 5 },
            ]}
          >
            <CustomText
              label="Invoice #"
              color={COLORS.subtxt}
              fontSize={12}
              fontFamily={fonts.semiBold}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CustomText
                label="Inv 001"
                color={COLORS.primaryColor}
                fontSize={12}
                fontFamily={fonts.semiBold}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DetailCard;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    borderRadius: 15,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  profile: {
    width: 90,
    height: 72,
    borderRadius: 8,
  },
  profile1: {
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 3.14,
    borderColor: COLORS.white,
    alignSelf: "center",
    marginBottom: -20,
    zIndex: 100,
  },
  statusContainer: {
    backgroundColor: "#FF8E001A",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  statusContainer1: {
    backgroundColor: "#00900538",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 15,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icn: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    tintColor: COLORS.inputLabel,
  },
});
