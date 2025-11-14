import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import HomeHeader from "./Molecules/HomeHeader";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";
import { COLORS } from "../../../utils/COLORS";
import CustomText from "../../../components/CustomText";
import fonts from "../../../assets/fonts";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import CustomModal from "../../../components/CustomModal";
import Icons from "../../../components/Icons";
import QRCode from "react-native-qrcode-svg";
import CustomButton from "../../../components/CustomButton";
import { useSelector } from "react-redux";
import moment from "moment";
import { ApiRequest } from "../../../Services/ApiRequest";
import { ToastMessage } from "../../../utils/ToastMessage";
const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 40) / 2.1;
const ITEM_HEIGHT = ITEM_WIDTH * 0.8;
const logo =
  "data:image/png;base64,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";

const Home = () => {
  const { userData } = useSelector((state) => state.users);
  const isToken = useSelector((state) => state.authConfig.token);
  console.log(isToken);

  const currentHour = moment().hour();

  // Determine the greeting based on the current hour
  let greeting = "";
  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 18 && currentHour < 21) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  const navigation = useNavigation();
  const [QrModal, setQrModal] = useState(false);

  const homeArry = [
    {
      id: 1,
      name: "Profile",
      image: image.profile,

      onPress: () => {
        navigation.navigate("Profile");
      },
    },
    {
      id: 2,
      name: "Connect",
      image: image.date,
      onPress: () => {
        navigation.navigate("Date");
      },
    },
    {
      id: 3,
      name: "Calendar",
      image: image.calender,
      onPress: () => {
        navigation.navigate("MyCalendar");
      },
    },
    {
      id: 4,
      name: "Settings",
      image: image.setting,
      onPress: () => {
        navigation.navigate("Settings");
      },
    },
    {
      id: 5,
      name: "Notifications",
      image: image.notifications,
      onPress: () => {
        navigation.navigate("Notifications");
      },
    },
    {
      id: 6,
      name: "My Tag",
      image: image.tags,
      onPress: () => {
        if (userData?.tag_scan == 1) {
          setQrModal(true);
        } else {
          ToastMessage(`Please activate your Tag from settings!`);
        }
      },
    },
  ];

  return (
    <>
      <ScreenWrapper headerUnScrollable={() => <HomeHeader />}>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <ImageFast
            source={userData?.image ? { uri: userData?.image } : image.userplaceholder}
            style={{
              height: 100,
              width: 100,
              borderRadius: 100,
              borderWidth: 2,
              borderColor: COLORS.primaryColor,
            }}
          />

          <CustomText
            label={greeting}
            fontSize={16}
            fontFamily={fonts.medium}
            color={COLORS.gray}
            marginTop={10}
          />
          <CustomText
            label={userData?.first_name + " " + userData?.last_name}
            fontSize={26}
            fontFamily={fonts.medium}
            textTransform={"capitalize"}
            marginTop={-8}
            color={COLORS.primaryColor}
            marginBottom={20}
          />
        </View>
        <FlatList
          data={homeArry}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={item.onPress} style={styles.homeCard}>
              <ImageFast
                source={item?.image}
                style={styles.icn}
                resizeMode={"contain"}
              />
              <CustomText
                label={item.name}
                color={COLORS.white}
                fontSize={16}
                fontFamily={fonts.medium}
                marginTop={20}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </ScreenWrapper>
      <CustomModal
        isChange
        isVisible={QrModal}
        onDisable={() => setQrModal(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 58,
              paddingHorizontal: 12,
              borderBottomWidth: 0.2,
              borderBottomColor: COLORS.gray,
            }}
          >
            <CustomText
              label={"ID Tag"}
              fontFamily={fonts.medium}
              color={COLORS.primaryColor}
              fontSize={18}
            />
            <Icons
              name={"close"}
              family={"AntDesign"}
              color={COLORS.primaryColor}
              size={24}
              onPress={() => setQrModal(false)}
            />
          </View>
          <View style={{ alignSelf: "center", marginTop: 20 }}>
            <QRCode
              value={isToken}
              logo={{ uri: logo }}
              logoBackgroundColor="transparent"
              size={250}
            />
          </View>
          <CustomText
            label={"Your QR Code"}
            color={COLORS.white}
            fontSize={18}
            fontFamily={fonts.semiBold}
            alignSelf={"center"}
            marginTop={20}
          />
          <View style={{ paddingHorizontal: 40 }}>
            <CustomText
              label={
                "This QR code will allow other persons to find your profile in their list"
              }
              color={COLORS.gray}
              fontSize={16}
              fontFamily={fonts.semiBold}
              alignSelf={"center"}
              textAlign={"center"}
            />
          </View>

          <CustomButton
            backgroundColor={COLORS.primaryColor}
            width="90%"
            title={"Scan QR Code"}
            onPress={() => {
              setQrModal(false);
              setTimeout(() => {
                navigation.navigate("TagScan");
              }, 500);
            }}
            marginTop={15}
          />
        </View>
      </CustomModal>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  homeCard: {
    backgroundColor: "#323232",
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 15,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  icn: {
    width: 36,
    height: 36,
  },
  modalContainer: {
    backgroundColor: "#323232",
    width: "100%",
    borderRadius: 12,
    paddingVertical: 15,
    position: "absolute",
    bottom: 0,
  },
});
