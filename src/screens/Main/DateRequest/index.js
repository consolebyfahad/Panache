import React, { useEffect, useState } from "react";
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import fonts from "../../../assets/fonts";
import { image } from "../../../assets/images";
import CustomButton from "../../../components/CustomButton";
import CustomText from "../../../components/CustomText";
import Header from "../../../components/Header";
import Icons from "../../../components/Icons";
import ImageFast from "../../../components/ImageFast";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { COLORS } from "../../../utils/COLORS";

import moment from "moment/moment";
import { Alert } from "react-native";
import RNCalendarEvents from "react-native-calendar-events";
import { useSelector } from "react-redux";
import { ApiRequest } from "../../../Services/ApiRequest";
import { ToastMessage } from "../../../utils/ToastMessage";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

const Request = ({ route, navigation }) => {
  const { userData } = useSelector((state) => state.users);
  const [requestStatus, setrequestStatus] = useState("");
  const isPopup = route?.params?.isPopup;
  const [DateData, setDateData] = useState([]);
  const [isRjectLoading, setisRjectLoading] = useState(false);

  const [eventId, setEventId] = useState('');
  const [calendars, setCalendars] = useState([]);
  const [pickedCal, setPickedCal] = useState(null);

  

  const data = route?.params?.data?.user_profile
    ? route?.params?.data?.user_profile
    : route?.params?.data?.user;

  const dateId = route?.params?.data?.date_id;
  const popupId = route?.params?.data?.id;

  const [isloading, setisloading] = useState(false);
  const isToken = useSelector((state) => state.authConfig.token);

  const statusBarHeight = Platform.OS === "ios" ? 40 : StatusBar.currentHeight;

  const getDateStatus = async () => {
    let apibody = {
      type: "get_data",
      table_name: "dates",
      id: isPopup ? popupId : dateId,
    };

    const request = await ApiRequest(apibody);
    setDateData(request?.data?.data);
    setrequestStatus(request?.data?.data[0]?.status);
  };
  useEffect(() => {
    getDateStatus();
  }, []);

  const AccpetOffer = async (status) => {
    setisloading(true);
    let apidata = {
      type: "accept_date",
      user_id: isToken,
      status: status,
      id: isPopup ? popupId : dateId,
    };
    const response = await ApiRequest(apidata);
    if (response?.data?.result) {
      ToastMessage(`Request ${status}`);
      AddToCalender();
      setisloading(false);
      setisRjectLoading(false);
    } else {
      setisloading(false);
    }
  };

  const RejectOffer = async (status) => {
    setisRjectLoading(true);
    let apidata = {
      type: "accept_date",
      user_id: isToken,
      status: status,
      id: isPopup ? popupId : dateId,
    };
    const response = await ApiRequest(apidata);
    if (response?.data?.result) {
      setisRjectLoading(false);
      ToastMessage(`Request ${status}`);
      navigation.navigate("Home");
      setisRjectLoading(false);
    } else {
      setisRjectLoading(false);
    }
  };



  useEffect(() => {
    async function loadCalendars() {
      try {
        const perms = await RNCalendarEvents.requestPermissions();
        if (perms === 'authorized') {
          const allCalendars = await RNCalendarEvents.findCalendars();
          const primaryCal = allCalendars.find(
            (cal) => cal.isPrimary && cal.allowsModifications
          );
          setCalendars(allCalendars);
          setPickedCal(primaryCal);
        } else {
          console.log('Calendar permission denied.');
        }
      } catch (error) {
        console.log('Error while fetching calendars:', error);
      }
    }

    if (Platform.OS === 'android') {
      loadCalendars();
    }
  }, []);

  const requestCalendarPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
        {
          title: "Calendar Permission",
          message: "This app needs access to your calendar to add events.",
          buttonPositive: "OK",
        }
      );
  
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS doesn't require this explicit permission
  };
  
  const AddToCalender = async () => {
    const hasPermission = await requestCalendarPermission();
    if (!hasPermission) {
      Alert.alert("Permission required", "Please allow calendar access in settings.");
      return;
    }

  
    const date = DateData?.[0]?.datetime;
    const formattedDate = moment(date, "MMM DD, YYYY hh:mm A").toISOString();
    const onehourmore = moment(date, "MMM DD, YYYY hh:mm A").add(1, "hours").toISOString();
  
    try {
      const eventDetails = {
        calendarId: Platform.OS === 'android' ? pickedCal?.id : undefined,
        title: `A Date With ${data?.first_name + " " + data?.last_name}`,
        startDate: formattedDate,
        endDate: onehourmore,
        description: "",
        notes: "",
        alarms: [{ date: -30 }],
      };
  
      console.log("Event Details:", eventDetails);
  
      const eventId = await RNCalendarEvents.saveEvent(eventDetails.title, eventDetails);
      console.log("Event ID:", eventId);
  
      if (eventId) {
        Alert.alert("Success", "Date has been added to your phone calendar", [
          { text: "OK", onPress: () => navigation.navigate("Home") },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add event to calendar");
      console.log("Calendar Error:", error);
    }
  };
  

  return (
    <ScreenWrapper
      scrollEnabled
      statusBarColor="transparent"
      translucent
      headerUnScrollable={() => (
        <>
          <View style={[styles.header, { marginTop: statusBarHeight }]}>
            <Header />
          </View>
        </>
      )}
      paddingHorizontal={0.1}
    >
      <View style={styles.container}>
        <ImageFast
          source={data?.image ? { uri: data?.image } : image.mainplaceholder}
          style={{ height: height / 2, width: "100%" }}
          resizeMode={"cover"}
        />
        <LinearGradient
          colors={["rgba(34, 34, 34, 0.11)", "#222222"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          locations={[0.3486, 0.8025]}
          style={styles.gradient}
        />

        <View style={{ position: "absolute", bottom: 50, width: "100%" }}>
          <CustomText
            label={data?.first_name + " " + data?.last_name}
            fontSize={26}
            fontFamily={fonts.medium}
            marginTop={-8}
            textTransform={"capitalize"}
            color={COLORS.primaryColor}
            alignSelf={"center"}
          />
          <CustomText
            label={data?.city + ", " + data?.country}
            fontSize={16}
            fontFamily={fonts.medium}
            marginTop={-8}
            color={COLORS.gray}
            alignSelf={"center"}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <CustomText
          label={"Bio"}
          color={COLORS.white}
          fontFamily={fonts.bold}
          fontSize={18}
          marginTop={20}
        />
        <CustomText
          label={data?.bio}
          color={COLORS.gray}
          fontFamily={fonts.medium}
          fontSize={14}
        />

        <View style={styles.signCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ImageFast
              source={image?.Leo}
              resizeMode={"contain"}
              style={{ width: 24, height: 24 }}
            />
            <CustomText
              label={"STAR SIGN"}
              color={COLORS.white}
              fontFamily={fonts.medium}
              fontSize={16}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <CustomText
              label={data?.starsign || "Leo"}
              color={COLORS.gray}
              fontFamily={fonts.regular}
              fontSize={14}
            />
            <Icons
              name={"chevron-small-right"}
              family={"Entypo"}
              color={COLORS.gray}
              size={24}
            />
          </View>
        </View>
        {requestStatus == "pending" ? (
          <>
            <CustomButton
              loading={isloading}
              title={"It’s A Date"}
              color={COLORS.black}
              onPress={() => AccpetOffer("accepted")}
            />

            <CustomButton
              loading={isRjectLoading}
              title={"NO Thanks"}
              backgroundColor={"#323232"}
              marginTop={10}
              onPress={() => RejectOffer("rejected")}
              fontFamily={fonts.bold}
              color={COLORS.primaryColor}
            />
          </>
        ) : (
          <CustomButton
            onPress={AddToCalender}
            title={requestStatus}
            backgroundColor={
              requestStatus == "rejected" ? COLORS.red : COLORS.primaryColor
            }
            marginTop={10}
            fontFamily={fonts.bold}
            color={requestStatus == "rejected" ? COLORS.white : COLORS.black}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Request;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    height: 500,
    width: width,
  },

  icn: {
    width: 140,
    height: 155,
    borderRadius: 12,
  },

  header: {
    position: "absolute",
    zIndex: 999,
    width: "100%",
    // marginTop: 35,
  },
  signCard: {
    backgroundColor: "#323232",
    height: 56,
    borderRadius: 12,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalContainer: {
    backgroundColor: "#222222",
    width: "100%",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    position: "absolute",
    bottom: 0,
  },

  dateContainer: {
    backgroundColor: "#323232",
    height: 80,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "95%",
    marginLeft: "2.5%",
    marginTop: 20,
    padding: 10,
    // paddingLeft: 7,
  },
  icn2: {
    height: 66,
    width: 66,
    borderRadius: 15,
  },

  venue: {
    backgroundColor: "#323232",
    width: "95%",
    marginLeft: "2.5%",
    height: 52,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
    marginTop: 10,
  },

  containercal: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  timeContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  timeText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  timeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timeDisplay: {
    color: "#fff",
    fontSize: 20,
    marginRight: 10,
  },
  amPmButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  amPmText: {
    color: "#fff",
    fontSize: 16,
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#F2C94C",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  confirmText: {
    color: "#1E1E1E",
    fontSize: 16,
    fontWeight: "bold",
  },

  venu: {
    height: 77,
    width: "95%",
    marginLeft: "2.5%",
    borderRadius: 15,
    marginVertical: 10,
  },
});
