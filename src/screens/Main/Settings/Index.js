import {
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";
import CustomText from "../../../components/CustomText";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import Icons from "../../../components/Icons";
import Toggle from "react-native-toggle-element";
import CustomButton from "../../../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../../../store/reducer/AuthConfig";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";
import { ApiRequest } from "../../../Services/ApiRequest";
import { setUserData } from "../../../store/reducer/usersSlice";
import { ToastMessage } from "../../../utils/ToastMessage";

const Settings = ({ navigation }) => {
  const { userData } = useSelector((state) => state.users);

  const [toggleValue, setToggleValue] = useState(false);
  const [ToggleQr, setToggleQr] = useState(
    userData?.tag_scan == 1 ? true : false
  );
  const dispatch = useDispatch();

  const isToken = useSelector((state) => state.authConfig.token);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem("fcmToken");
    return !!token;
  };

  useEffect(() => {
    const initializeToggle = async () => {
      const hasToken = await checkToken();
      setToggleValue(hasToken);
    };
    initializeToggle();
  }, []);

  const getToken = async () => {
    if (Platform.OS === "android") {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        console.error("Permission not granted for notifications");
        return null;
      }
    } else if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        console.error("Permission not granted for notifications");
        return null;
      }
    }
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      await AsyncStorage.setItem("fcmToken", fcmToken);
    }
    return fcmToken;
  };

  const idtagCheck = async (ToggleQr) => {
    setToggleQr(ToggleQr);
    let body = {
      type: "update_data",
      table_name: "users",
      id: isToken,
      tag_scan: ToggleQr ? 1 : 0,
    };

    const res = await ApiRequest(body);
    if (res?.data?.result) {
      let body = {
        type: "profile",
        user_id: isToken,
      };
      const profileApi = await ApiRequest(body);
      dispatch(setUserData(profileApi?.data?.profile));
      ToastMessage(res?.data?.message);
    }
  };

  const removeToken = async () => {
    await AsyncStorage.removeItem("fcmToken");
    console.log("FCM Token removed from storage");
  };

  const handleToggle = async (val) => {
    setToggleValue(val);
    if (val) {
      const token = await getToken();
      if (token) {
        console.log("Notifications Enabled with token:", token);
      } else {
        console.error("Failed to get FCM token");
        setToggleValue(false);
      }
    } else {
      // Disable Notifications
      await removeToken();
      console.log("Notifications Disabled");
    }
  };

  const handleLogout = () => {
    dispatch(setToken(""));
    AsyncStorage.removeItem("user_id");
    navigation.navigate("AuthStack");
  };

  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => <Header title={"SETTINGS"} />}
    >
      {/* <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        style={styles.userProfile}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <ImageFast
            source={
              userData?.image ? { uri: userData?.image } : image.userplaceholder
            }
            resizeMode={"cover"}
            style={styles.profile}
          />
          <View>
            <CustomText
              label={userData?.first_name + " " + userData?.last_name}
              color={COLORS.primaryColor}
              fontSize={18}
              fontFamily={fonts.semiBold}
              textTransform={"capitalize"}
            />
            <CustomText
              label={userData?.email}
              numberOfLines={2}
              color={COLORS.gray}
              width={250}
              fontSize={14}
              marginTop={-4}
              fontFamily={fonts.regular}
            />
          </View>
        </View>
        <Icons
          name={"chevron-small-right"}
          family={"Entypo"}
          color={COLORS.gray}
          size={35}
        />
      </TouchableOpacity> */}


      <TouchableOpacity
        onPress={() => navigation.navigate("PersonalDetails")}
        style={styles.userProfile}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <View
            style={{
              backgroundColor: "#222222",
              borderRadius: 15,
              padding: 10,
            }}
          >
            <ImageFast
              source={image.profile}
              resizeMode={"cover"}
              style={styles.settingIcons}
            />
          </View>
          <CustomText
            label={"Personal Details"}
            color={COLORS.white}
            fontSize={14}
            fontFamily={fonts.medium}
          />
        </View>

        <Icons
          name={"chevron-small-right"}
          family={"Entypo"}
          color={COLORS.gray}
          size={35}
        />
      </TouchableOpacity>

      <View style={styles.userProfile}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <View
            style={{
              backgroundColor: "#222222",
              borderRadius: 15,
              padding: 10,
            }}
          >
            <ImageFast
              source={image.profilenoti}
              resizeMode={"cover"}
              style={styles.settingIcons}
            />
          </View>
          <CustomText
            label={"Notifications"}
            color={COLORS.white}
            fontSize={14}
            fontFamily={fonts.medium}
          />
        </View>
        <Toggle
          trackBar={{
            height: 30,
            width: 80,
            activeBackgroundColor: COLORS.primaryColor,
            inActiveBackgroundColor: COLORS.bg,
          }}
          trackBarStyle={{
            width: 60,
          }}
          thumbStyle={{
            width: 25,
            height: 25,
            backgroundColor: "#fff",
          }}
          value={toggleValue}
          onPress={(val) => handleToggle(val)}
        />
      </View>

      <View style={styles.userProfile}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <View
            style={{
              backgroundColor: "#222222",
              borderRadius: 15,
              padding: 10,
            }}
          >
            <ImageFast
              source={image.qr}
              resizeMode={"cover"}
              style={styles.settingIcons}
            />
          </View>
          <CustomText
            label={"ID Tag Scan"}
            color={COLORS.white}
            fontSize={14}
            fontFamily={fonts.medium}
          />
        </View>
        <Toggle
          trackBar={{
            height: 30,
            width: 80,
            activeBackgroundColor: COLORS.primaryColor,
            inActiveBackgroundColor: COLORS.bg,
          }}
          trackBarStyle={{
            width: 60,
          }}
          thumbStyle={{
            width: 25,
            height: 25,
            backgroundColor: "#fff",
          }}
          value={ToggleQr}
          onPress={(val) => idtagCheck(val)}
        />
      </View>

      <View style={styles.userProfile}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <View
            style={{
              backgroundColor: "#222222",
              borderRadius: 15,
              padding: 10,
            }}
          >
            <ImageFast
              source={image.privacy}
              resizeMode={"cover"}
              style={styles.settingIcons}
            />
          </View>
          <CustomText
            label={"Privacy & Policy"}
            color={COLORS.white}
            fontSize={14}
            fontFamily={fonts.medium}
          />
        </View>
        <Icons
          name={"chevron-small-right"}
          family={"Entypo"}
          color={COLORS.gray}
          size={35}
        />
      </View>

      <View style={styles.userProfile}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <View
            style={{
              backgroundColor: "#222222",
              borderRadius: 15,
              padding: 15,
            }}
          >
            <ImageFast
              source={image.terms}
              resizeMode={"cover"}
              style={styles.settingIcons}
            />
          </View>
          <CustomText
            label={"Terms & Conditions"}
            color={COLORS.white}
            fontSize={14}
            fontFamily={fonts.medium}
          />
        </View>
        <Icons
          name={"chevron-small-right"}
          family={"Entypo"}
          color={COLORS.gray}
          size={35}
        />
      </View>

      <CustomText
        label={"V 1.0.00"}
        color={COLORS.gray}
        fontSize={13}
        textAlign={"center"}
        alignSelf={"center"}
        fontFamily={fonts.medium}
        marginTop={20}
      />

      <View style={{ marginBottom: 20, marginTop: 20 }}>
        <CustomButton
          title={"Delete Account"}
          color={COLORS.red}
          backgroundColor={"#323232"}
        />

        <CustomButton
          title={"Logout"}
          onPress={handleLogout}
          color={COLORS.black}
          marginTop={10}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Settings;

const styles = StyleSheet.create({
  userProfile: {
    backgroundColor: "#323232",
    padding: 5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    height: 81,
    marginTop: 10,
  },
  profile: {
    height: 65,
    width: 65,
    borderRadius: 15,
  },

  settingIcons: {
    width: 28,
    height: 28,
  },
  icon: {
    width: 28,
    height: 28,
  },
});
