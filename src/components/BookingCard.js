import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import ImageFast from "./ImageFast";
import { Images } from "../assets/images";
import { TouchableOpacity } from "react-native";
import CustomText from "./CustomText";
import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";
import Icons from "./Icons";
import CustomButton from "./CustomButton";

const BookingCard = ({ marginBottom, marginTop }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.mainContainer, { marginBottom, marginTop }]}
      onPress={() => navigation.navigate("EventDetails", { isbook: true })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <ImageFast
          isView
          source={Images.cardImg}
          style={{ height: 70, width: 70, borderRadius: 8 }}
        />

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "72%",
            }}
          >
            <CustomText
              label={"Tame Impala"}
              color={COLORS.black}
              fontFamily={fonts.bold}
            />
            <CustomText
              label={"1000$"}
              color={COLORS.primaryColor}
              fontFamily={fonts.bold}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginLeft: -4,
            }}
          >
            <ImageFast
              source={Images.location}
              style={{ width: 15, height: 15 }}
              resizeMode={"contain"}
            />

            <CustomText
              label={"Sunburn, Goa"}
              color={COLORS.gray}
              fontFamily={fonts.regular}
              fontSize={12}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              marginTop: 5,
            }}
          >
            <CustomText
              label={"5 march, 2021 "}
              color={COLORS.gray}
              fontFamily={fonts.regular}
              fontSize={10}
            />
            <Icons
              name={"dot-single"}
              family={"Entypo"}
              size={15}
              color={COLORS.gray}
            />

            <CustomText
              label={"10:00 PM "}
              color={COLORS.gray}
              fontFamily={fonts.regular}
              fontSize={10}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "74%",
              marginTop: 10,
            }}
          >
            <View style={styles.goingContainer}>
              <ImageFast
                source={Images.eclip}
                style={styles.icn}
                resizeMode={"contain"}
              />
              <ImageFast
                source={Images.eclip2}
                style={styles.icn}
                resizeMode={"contain"}
              />
              <ImageFast
                source={Images.eclip3}
                style={styles.icn}
                resizeMode={"contain"}
              />

              <View style={styles.onGoing}>
                <CustomText
                  label={"2345+"}
                  color={"#8D8D8D"}
                  fontFamily={fonts.regular}
                  fontSize={14}
                />
              </View>
            </View>

            <CustomButton
              backgroundColor={"transparent"}
              borderWidth={1}
              borderColor={COLORS.primaryColor}
              width={80}
              height={20}
              title={"View Ticket"}
              fontSize={10}
              color={COLORS.primaryColor}
              onPress={() => navigation.navigate("TicketQr")}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    borderWidth: 0.7,
    borderColor: "#ECEFF3",
    padding: 10,
    borderRadius: 10,
  },
  onGoing: {
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 5,
    borderRadius: 100,
    marginLeft: -10,
  },
  icn: {
    width: 30,
    height: 30,
    marginLeft: -10,
  },

  goingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
});
