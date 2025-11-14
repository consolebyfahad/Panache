import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import CustomText from "./CustomText";
import ImageFast from "./ImageFast";

import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import fonts from "../assets/fonts";
import { Images } from "../assets/images";
import { COLORS } from "../utils/COLORS";
import { useTheme } from "../context/ThemeContext";

const Card = ({ marginBottom, marginTop, data }) => {
  const { colors, toggleTheme, isDarkMode } = useTheme();

  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.mainContainer,
        {
          marginBottom,
          marginTop,
          backgroundColor: colors.bg,
          borderColor: isDarkMode ? "#848484" : "#ECEFF3",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate("EventDetails", { item: data })}
        style={[styles.container, { backgroundColor: colors.bg }]}
      >
        <ImageFast
          source={data?.images[0] ? { uri: data?.images[0] } : Images.cardImg}
          style={styles.profile}
        />
        <View style={{ width: "63%" }}>
          <CustomText
            label={data?.name}
            fontFamily={fonts.semiBold}
            marginTop={8}
            color={colors.black}
            marginBottom={5}
          />
          <View
            style={[
              styles.row,
              {
                borderBottomColor: isDarkMode ? "#848484" : COLORS.border,
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 8,
              },
            ]}
          >
            <Image source={Images.location} style={styles.icn} />

            <CustomText
              label={data?.category?.name}
              color={COLORS.gray}
              numberOfLines={1}
              fontSize={12}
              marginLeft={5}
            />
          </View>

          <View
            style={[
              styles.row,
              { justifyContent: "space-between", marginTop: 5 },
            ]}
          >
            <CustomText
              label="Date"
              color={COLORS.gray}
              fontSize={12}
              fontFamily={fonts.medium}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CustomText
                label={moment(data?.start_Date).format("DD MMM YYYY")}
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
              label="Time remaining"
              color={COLORS.gray}
              fontSize={12}
              fontFamily={fonts.medium}
            />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CustomText
                label={moment(data?.start_Time).format("h:mm A")}
                color={COLORS.primaryColor}
                fontSize={12}
                fontFamily={fonts.semiBold}
              />
            </View>
          </View>

          {data?.purchase_by.length > 0 ? (
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", marginTop: 5 },
              ]}
            >
              <>
                <CustomText
                  label="Tickets purchased"
                  color={COLORS.gray}
                  fontSize={12}
                  fontFamily={fonts.medium}
                />
                <>
                  <View style={styles.goingContainer}>
                    {data?.purchase_by.map((item, index) => (
                      <>
                        <ImageFast
                          key={index}
                          isView
                          source={
                            item?.user?.image
                              ? { uri: item?.user?.image }
                              : Images.placeholderUser
                          }
                          style={styles.icn}
                          resizeMode={"cover"}
                        />
                        {data?.purchase_by?.length > 3 ? (
                          <View style={styles.onGoing}>
                            <CustomText
                              label={`${data?.purchase_by.length} +`}
                              color={"#8D8D8D"}
                              fontFamily={fonts.regular}
                              fontSize={14}
                            />
                          </View>
                        ) : null}
                      </>
                    ))}
                  </View>
                </>
              </>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    borderRadius: 15,
    padding: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  profile: {
    width: "32%",
    height: 120,
    borderRadius: 8,
  },
  statusContainer: {
    backgroundColor: "#003F7D14",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icn: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    tintColor: COLORS.primaryColor,
    borderRadius: 100,
  },

  goingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },

  onGoing: {
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 100,
    marginLeft: -5,
  },

  icn2: {
    width: 20,
    height: 20,
    marginLeft: -10,
  },
});
