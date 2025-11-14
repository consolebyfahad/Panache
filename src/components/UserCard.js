import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";

import CustomButton from "./CustomButton";
import CustomText from "./CustomText";
import ImageFast from "./ImageFast";

import { Images } from "../assets/images";
import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";
import { useNavigation } from "@react-navigation/native";

const UserCard = ({ marginBottom = 20 }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ApplicationDetails", { cus: true })}
      style={[styles.mainContainer, { marginBottom }]}
    >
      <View style={{ width: "38%", alignItems: "center" }}>
        <ImageFast
          source={Images.placeholderUser}
          style={styles.profileImg}
          resizeMode="cover"
        />
        <ImageFast source={Images.placeholderImage} style={styles.coverImg} />
        <CustomButton
          width={70}
          height={25}
          title="Book Now"
          fontSize={10}
          marginTop={10}
        />
      </View>
      <View style={{ width: "56%" }}>
        <CustomText
          label="Selamet Raharjo"
          color="#0D0D12"
          fontFamily={fonts.semiBold}
        />
        <View style={styles.borderContainer}>
          <View style={styles.row}>
            <Image source={Images.location} style={styles.location} />
            <CustomText
              label="San Francisco, CA"
              fontSize={12}
              color="#818898"
            />
          </View>
          <CustomText
            label="$50"
            fontSize={12}
            fontFamily={fonts.medium}
            color="#FF8E00"
          />
        </View>
        <View
          style={[
            styles.row,
            { justifyContent: "space-between", marginBottom: 10 },
          ]}
        >
          <CustomText
            label="Category"
            fontSize={12}
            color="#818898"
            fontFamily={fonts.medium}
          />
          <View style={styles.typeContainer}>
            <CustomText
              label="Ac Repair"
              fontFamily={fonts.semiBold}
              fontSize={10}
              color="#FF8E00"
            />
          </View>
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <CustomText
            label="Rating"
            fontSize={12}
            color="#818898"
            fontFamily={fonts.medium}
          />
          <View style={styles.row}>
            <Image source={Images.star} style={styles.star} />
            <CustomText
              label="4.4(343)"
              fontFamily={fonts.semiBold}
              fontSize={10}
              marginLeft={5}
              color="#003F7D"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#ECEFF3",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  profileImg: {
    width: 53,
    height: 53,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 999,
  },
  coverImg: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    marginTop: -20,
  },
  borderContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    paddingBottom: 15,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    width: 18,
    height: 18,
    resizeMode: "contain",
    marginRight: 5,
  },
  typeContainer: {
    height: 23,
    paddingHorizontal: 10,
    backgroundColor: "#FF8E001A",
    borderRadius: 100,
    justifyContent: "center",
  },
  star: {
    width: 14,
    height: 14,
    resizeMode: "contain",
  },
});
