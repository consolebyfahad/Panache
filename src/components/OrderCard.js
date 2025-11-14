import { Image, StyleSheet, View } from "react-native";
import React from "react";

import CustomButton from "./CustomButton";
import CustomText from "./CustomText";
import ImageFast from "./ImageFast";

import { useNavigation } from "@react-navigation/native";
import { Images } from "../assets/images";
import fonts from "../assets/fonts";
import { COLORS } from "../utils/COLORS";

const OrderCard = ({
  status,
  marginBottom,
  marginTop,
  isEmployeDetaal,
  btntxt,
  isestimate,
}) => {
  const navigation = useNavigation();

  const renderButtons = () => {
    switch (status) {
      case "Orders":
        return (
          <View style={styles.row}>
            <CustomButton
              width={80}
              height={32}
              title="Complete"
              fontSize={12}
              borderWidth={1}
              borderColor={COLORS.primaryColor}
              backgroundColor="transparent"
              color={COLORS.primaryColor}
              marginRight={10}
            />
            <CustomButton
              width={80}
              height={32}
              title={isestimate ? " Accept " : "Message"}
              fontSize={12}
              onPress={() => navigation.navigate("Chat")} // Assuming you have a screen for messages
            />
          </View>
        );
      case "Estimates":
        return (
          <View style={styles.row}>
            <CustomButton
              width={80}
              height={32}
              title="Cancel"
              fontSize={12}
              borderWidth={1}
              borderColor={COLORS.primaryColor}
              backgroundColor="transparent"
              color={COLORS.primaryColor}
              marginRight={10}
            />
            <CustomButton
              width={80}
              height={32}
              title="Confirm"
              fontSize={12}
              onPress={() => navigation.navigate("ConfirmScreen")} // Assuming you have a screen for confirmation
            />
          </View>
        );
      case "Invoices":
        return null; // No buttons for Invoices
      default:
        return null;
    }
  };

  return (
    <View style={[styles.mainContainer, { marginBottom, marginTop }]}>
      <View style={styles.container}>
        <ImageFast
          onPress={
            status === "Orders"
              ? () => navigation.navigate("OrderDetail")
              : status === "Estimates"
              ? () => navigation.navigate("EstimateDetail")
              : status === "Invoices"
              ? () => navigation.navigate("Invoice")
              : status === "Proposals"
              ? () => navigation.navigate("PerposalsDetails")
              : null
          }
          source={Images.placeholderImage}
          style={styles.profile}
        />
        <View style={{ width: "63%" }}>
          <View style={styles.statusContainer}>
            <CustomText
              label={isestimate ? "#abc123" : status}
              color={COLORS.secondary}
              fontFamily={fonts.medium}
              fontSize={12}
              textTransform="capitalize"
            />
          </View>
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
                borderBottomColor: COLORS.lightGray,
                borderBottomWidth: 1,
                paddingBottom: 8,
                marginBottom: 8,
              },
            ]}
          >
            <Image source={Images.headerloc} style={styles.icn} />
            <CustomText
              label="San Francisco, CA"
              color={COLORS.inputLabel}
              fontSize={12}
              marginLeft={5}
            />
          </View>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <CustomText label="Time" color={COLORS.inputLabel} fontSize={12} />
            <CustomText label="09 : 00AM" fontSize={12} />
          </View>
          <View
            style={[
              styles.row,
              { justifyContent: "space-between", marginTop: 5 },
            ]}
          >
            <CustomText label="Date" color={COLORS.inputLabel} fontSize={12} />
            <CustomText label="Wed, 20 May 2024" fontSize={12} />
          </View>
        </View>
      </View>
      <View
        style={[styles.row, { justifyContent: "space-between", marginTop: 16 }]}
      >
        {status !== "Proposals" ? (
          <CustomText
            label="$103.55"
            color={COLORS.primaryColor}
            fontSize={16}
            fontFamily={fonts.semiBold}
          />
        ) : null}

        {status == "Proposals" ? (
          <CustomText
            label="Waiting for Estimate"
            color={COLORS.primaryColor}
            fontSize={14}
            fontFamily={fonts.semiBold}
          />
        ) : null}

        {isEmployeDetaal ? (
          <View style={styles.row}>
            <CustomButton
              width={80}
              height={32}
              onPress={() => navigation.navigate("Invoice")}
              title="Detail"
              fontSize={12}
            />
          </View>
        ) : (
          renderButtons() // Call the function to render buttons based on the status
        )}
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  profile: {
    width: "32%",
    height: 130,
    borderRadius: 8,
  },
  statusContainer: {
    backgroundColor: "#FF8E001A",
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
    tintColor: COLORS.inputLabel,
  },
});
