import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import LinearGradient from "react-native-linear-gradient";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";
import { COLORS } from "../../../utils/COLORS";
import CustomText from "../../../components/CustomText";
import fonts from "../../../assets/fonts";
import { TouchableOpacity } from "react-native";
import Header from "../../../components/Header";
import CustomInput from "../../../components/CustomInput";
import Icons from "../../../components/Icons";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import { Calendar } from "react-native-calendars";
import DatePicker from "react-native-date-picker";

import moment from "moment/moment";
import { ApiRequest } from "../../../Services/ApiRequest";
import { useSelector } from "react-redux";
import { ToastMessage } from "../../../utils/ToastMessage";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
import RNCalendarEvents from "react-native-calendar-events";

const DatingProfile = ({ route, navigation }) => {
  const { userData } = useSelector((state) => state.users);

  const [SecondModal, setSecondModal] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [AddtoCanderDate, setAddtoCanderDate] = useState("");

  let mytimings = [];

  if (userData?.timings) {
    try {
      mytimings = JSON.parse(userData?.timings);
    } catch (error) {
      console.error("Error parsing user gallery:", error);
      mytimings = [];
    }
  } else {
    console.warn("timing data is not available");
  }

  const [sucessModal, setsucessModal] = useState(false);
  const data = route?.params?.data;

  const profileViewed = async () => {
    let body = {
      type: "add_data",
      user_id: isToken,
      profile_id: data?.id,
      table_name: "view_history",
    };

    const res = await ApiRequest(body);
  };

  useEffect(() => {
    if (data?.id) {
      profileViewed();
    }
  }, [data?.id]);

  const isSecond = route?.params?.issecond;

  let userTiimgs = [];

  if (data?.timings) {
    try {
      const sanitizedJsonString = data?.timings.replace(/\\/g, "");
      userTiimgs = JSON.parse(sanitizedJsonString);
    } catch (error) {
      userTiimgs = [];
    }
  }

  const [isloading, setisloading] = useState(false);
  let fixedData = [];
  if (data?.user_gallery) {
    try {
      fixedData = JSON.parse(data.user_gallery);
    } catch (error) {
      fixedData = [];
    }
  }

  const isToken = useSelector((state) => state.authConfig.token);

  const [isVisible, setisVisible] = useState(false);
  const [dateTimeModal, setdateTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState();

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [venueModal, setvenueModal] = useState(false);
  const [Venudata, setVenudata] = useState([]);
  const [SelectedVenu, setSelectedVenu] = useState("");

  const [isAM, setIsAM] = useState(true);
  const statusBarHeight = Platform.OS === "ios" ? 40 : StatusBar.currentHeight;

  // New state for available time slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Calculate mutual availability for the selected date
  const calculateMutualAvailability = (selectedDate) => {
    if (!selectedDate) return [];

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const selectedDay = daysOfWeek[moment(selectedDate).day()];

    // Get timing for both users for the selected day
    const myDayTiming = mytimings.find((t) => t.day === selectedDay);
    const theirDayTiming = userTiimgs.find((t) => t.day === selectedDay);

    // If either person is not available, return empty array
    if (!myDayTiming?.isEnabled || !theirDayTiming?.isEnabled) {
      return [];
    }

    // Parse times
    const myFromTime = moment(myDayTiming.fromTime);
    const myToTime = moment(myDayTiming.toTime);
    const theirFromTime = moment(theirDayTiming.fromTime);
    const theirToTime = moment(theirDayTiming.toTime);

    // Find overlap
    const overlapStart = moment.max(myFromTime, theirFromTime);
    const overlapEnd = moment.min(myToTime, theirToTime);

    // If no overlap, return empty
    if (overlapStart >= overlapEnd) {
      return [];
    }

    // Generate 30-minute time slots within the overlap
    const timeSlots = [];
    let currentTime = overlapStart.clone();

    while (currentTime < overlapEnd) {
      timeSlots.push({
        time: currentTime.format("HH:mm"),
        display: currentTime.format("hh:mm A"),
        hour: currentTime.format("HH"),
        minute: currentTime.format("mm"),
        period: currentTime.format("A"),
      });
      currentTime.add(30, "minutes");
    }

    return timeSlots;
  };

  // Update available slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      const slots = calculateMutualAvailability(selectedDate);
      setAvailableTimeSlots(slots);
      setSelectedTimeSlot(null);
      setSelectedTime(null);
    }
  }, [selectedDate]);

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
    setSelectedTime(slot.time);
    setIsAM(slot.period === "AM");
  };

  const TimeSelet = () => {
    setisVisible(false);
    setTimeout(() => {
      setdateTimeModal(true);
    }, 500);
  };

  const VenuSelet = () => {
    setisVisible(false);
    setTimeout(() => {
      setvenueModal(true);
    }, 500);
  };

  const setVenuId = (item) => {
    setSelectedVenu(item);
  };

  const confrimVenu = () => {
    setvenueModal(false);
    setTimeout(() => {
      setisVisible(true);
    }, 500);
  };

  const handelModals = () => {
    setdateTimeModal(false);
    setTimeout(() => {
      setisVisible(true);
    }, 500);
  };

  const getViews = async () => {
    let data = {
      type: "get_data",
      table_name: "venues",
    };
    const response = await ApiRequest(data);
    setVenudata(response?.data?.data);
  };

  useEffect(() => {
    getViews();
  }, []);

  const CreateRequest = async () => {
    if (!selectedTimeSlot) {
      ToastMessage("Please select a time slot");
      return;
    }

    const time = selectedTimeSlot.period;
    const dateTimeString = `${selectedDate} ${selectedTimeSlot.time}`;

    const formattedDate = moment(dateTimeString, "YYYY-MM-DD HH:mm")
      .local()
      .toISOString();

    setAddtoCanderDate(formattedDate);
    setisloading(true);

    let body = {
      type: "add_data",
      user_id: isToken,
      table_name: "dates",
      venue_id: SelectedVenu?.id,
      datetime: formattedDate,
      date_id: data?.id,
    };

    const response = await ApiRequest(body);

    if (response?.data?.result) {
      if (isSecond) {
        setisVisible(false);
        setisloading(false);
        setTimeout(() => {
          setSecondModal(true);
        }, 500);
      } else {
        setisVisible(false);
        setisloading(false);
        setTimeout(() => {
          setsucessModal(true);
        }, 500);
      }
    } else {
      setisloading(false);
      ToastMessage(response?.data?.message || "Failed to create date request");
    }
  };

  const AddToCalender = async () => {
    navigation.navigate("Home");
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

        <View style={{ position: "absolute", bottom: 190, width: "100%" }}>
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

        {fixedData ? (
          <FlatList
            data={fixedData}
            contentContainerStyle={{ justifyContent: "space-between" }}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={{ marginLeft: index == 0 ? 0 : 10 }}>
                <ImageFast
                  isView
                  source={{ uri: item }}
                  style={styles.icn}
                  resizeMode={"cover"}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={[0, 1, 2, 3, 4, 5]}
            contentContainerStyle={{ justifyContent: "space-between" }}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={{ marginLeft: index == 0 ? 0 : 10 }}>
                <ImageFast
                  isView
                  source={image.Date5}
                  style={styles.icn}
                  resizeMode={"cover"}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <CustomText
          label={"My Bio"}
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

        <CustomButton
          title={"Let's Connect"}
          onPress={() => setisVisible(true)}
          color={COLORS.black}
        />

        <CustomModal
          isVisible={isVisible}
          onDisable={() => setisVisible(false)}
          backdropOpacity={0.4}
          isChange
        >
          <View style={styles.modalContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 58,
                paddingHorizontal: 20,
                borderBottomWidth: 0.2,
                borderBottomColor: COLORS.gray,
              }}
            >
              <CustomText
                label={"Let's Connect"}
                fontFamily={fonts.medium}
                color={COLORS.primaryColor}
                fontSize={18}
              />

              <Icons
                name={"close"}
                family={"AntDesign"}
                color={COLORS.primaryColor}
                size={24}
                onPress={() => setisVisible(false)}
              />
            </View>

            <View style={styles.dateContainer}>
              <ImageFast
                source={
                  data?.image ? { uri: data?.image } : image.mainplaceholder
                }
                style={styles.icn2}
                resizeMode={"cover"}
              />
              <View>
                <CustomText
                  label={data?.first_name + " " + data?.last_name}
                  fontFamily={fonts.medium}
                  color={COLORS.primaryColor}
                  textTransform={"capitalize"}
                  fontSize={16}
                />
                <CustomText
                  label={data?.city + ", " + data?.country}
                  fontFamily={fonts.medium}
                  color={COLORS.gray}
                  fontSize={16}
                />
              </View>
            </View>

            <CustomText
              label={"Select Venue"}
              fontFamily={fonts.medium}
              color={COLORS.gray}
              fontSize={14}
              marginTop={10}
              marginLeft={12}
            />

            {SelectedVenu ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setvenueModal(true)}
              >
                <ImageFast
                  source={{ uri: SelectedVenu.image }}
                  style={[styles.venu]}
                  resizeMode={"cover"}
                />
                <View style={{ position: "absolute", left: 20, top: 35 }}>
                  <CustomText
                    label={SelectedVenu?.name}
                    color={COLORS?.white}
                    fontFamily={fonts?.medium}
                    fontSize={16}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={VenuSelet} style={styles.venue}>
                <ImageFast
                  source={image.location}
                  resizeMode={"contain"}
                  style={{ height: 24, width: 24 }}
                />
                <CustomText
                  label={"Choose Venue"}
                  fontFamily={fonts.medium}
                  color={COLORS.gray}
                  fontSize={14}
                />
              </TouchableOpacity>
            )}

            <CustomText
              label={"Date & Time"}
              fontFamily={fonts.medium}
              color={COLORS.gray}
              fontSize={14}
              marginTop={10}
              marginLeft={12}
            />
            <TouchableOpacity onPress={TimeSelet} style={styles.venue}>
              <ImageFast
                source={image.calenderLight}
                resizeMode={"contain"}
                style={{
                  height: 24,
                  width: 24,
                  tintColor: selectedDate ? COLORS.primaryColor : COLORS.gray,
                }}
              />
              <View style={{ flexDirection: "row", gap: 5 }}>
                <CustomText
                  label={
                    selectedDate
                      ? moment(selectedDate).format("MMMM D, YYYY")
                      : "Choose Date & "
                  }
                  fontFamily={fonts.medium}
                  color={selectedDate ? COLORS.primaryColor : COLORS.gray}
                  fontSize={14}
                />

                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: selectedDate ? COLORS.primaryColor : COLORS.gray,
                  }}
                >
                  {selectedTimeSlot ? selectedTimeSlot.display : "Time"}
                </Text>
              </View>
            </TouchableOpacity>

            <CustomButton
              title={"Confirm"}
              width="95%"
              loading={isloading}
              disabled={!SelectedVenu || !selectedDate || !selectedTimeSlot}
              onPress={CreateRequest}
              color={COLORS.black}
              marginTop={20}
            />
          </View>
        </CustomModal>

        <CustomModal
          isVisible={dateTimeModal}
          onDisable={() => setdateTimeModal(false)}
          backdropOpacity={0.4}
          isChange
        >
          <View style={[styles.modalContainer, { paddingHorizontal: 10 }]}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 58,
                gap: 5,
                paddingHorizontal: 20,
                borderBottomWidth: 0.2,
                borderBottomColor: COLORS.gray,
              }}
              onPress={() => setdateTimeModal(false)}
            >
              <Icons
                name={"chevron-back"}
                family={"Ionicons"}
                color={COLORS.primaryColor}
                size={24}
              />
              <CustomText
                label={"Select Date & Time"}
                fontFamily={fonts.medium}
                color={COLORS.primaryColor}
                fontSize={18}
              />
            </TouchableOpacity>

            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: COLORS.primaryColor,
                },
              }}
              minDate={today}
              theme={{
                textDayFontSize: 20,
                textMonthFontSize: 20,
                arrowColor: "#fff",
                textDisabledColor: "#555555",
                calendarBackground: "#222222",
                dayTextColor: "#fff",
                monthTextColor: "#fff",
                zIndex: 999,
              }}
            />

            {selectedDate && (
              <View style={styles.timeSlotContainer}>
                <CustomText
                  label={"Available Times (Mutual Availability)"}
                  fontFamily={fonts.medium}
                  fontSize={16}
                  color={COLORS.white}
                  marginBottom={10}
                  marginLeft={10}
                />

                {availableTimeSlots.length > 0 ? (
                  <ScrollView
                    style={{ maxHeight: 200 }}
                    showsVerticalScrollIndicator={false}
                  >
                    <View style={styles.timeSlotGrid}>
                      {availableTimeSlots.map((slot, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.timeSlotButton,
                            selectedTimeSlot?.time === slot.time &&
                              styles.timeSlotButtonSelected,
                          ]}
                          onPress={() => handleTimeSlotSelect(slot)}
                        >
                          <CustomText
                            label={slot.display}
                            color={
                              selectedTimeSlot?.time === slot.time
                                ? COLORS.black
                                : COLORS.white
                            }
                            fontSize={14}
                            fontFamily={fonts.medium}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <View style={styles.noSlotsContainer}>
                    <Icons
                      name={"calendar-times-o"}
                      family={"FontAwesome"}
                      color={COLORS.gray}
                      size={40}
                    />
                    <CustomText
                      label={"No mutual availability on this date"}
                      color={COLORS.gray}
                      fontSize={14}
                      marginTop={10}
                      textAlign={"center"}
                    />
                    <CustomText
                      label={"Please select a different date"}
                      color={COLORS.gray}
                      fontSize={12}
                      marginTop={5}
                      textAlign={"center"}
                    />
                  </View>
                )}
              </View>
            )}

            <CustomButton
              title={"Confirm"}
              onPress={handelModals}
              disabled={!selectedTimeSlot}
              marginTop={10}
              color={COLORS.black}
              marginBottom={10}
            />
          </View>
        </CustomModal>

        <CustomModal
          isVisible={venueModal}
          onDisable={() => setvenueModal(false)}
          backdropOpacity={0.4}
          isChange
        >
          <View style={styles.modalContainerVuenu}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 58,
                gap: 5,
                paddingHorizontal: 10,
                borderBottomWidth: 0.2,
                borderBottomColor: COLORS.gray,
              }}
              onPress={() => setvenueModal(false)}
            >
              <Icons
                name={"chevron-back"}
                family={"Ionicons"}
                color={COLORS.primaryColor}
                size={24}
              />
              <CustomText
                label={"Select Venue"}
                fontFamily={fonts.medium}
                color={COLORS.primaryColor}
                fontSize={18}
              />
            </TouchableOpacity>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {Venudata.map((item, index) => (
                <TouchableOpacity
                  key={item.id.toString()}
                  activeOpacity={0.8}
                  onPress={() => setVenuId(item)}
                >
                  <ImageFast
                    source={{ uri: item.image }}
                    style={[
                      styles.venu,
                      {
                        borderColor:
                          SelectedVenu?.id === item?.id
                            ? COLORS.primaryColor
                            : "",
                        borderWidth: SelectedVenu?.id === item?.id ? 1 : 0,
                      },
                    ]}
                    resizeMode={"cover"}
                  />
                  <View style={{ position: "absolute", left: 20, top: 35 }}>
                    <CustomText
                      label={item?.name}
                      color={COLORS?.white}
                      fontFamily={fonts?.medium}
                      fontSize={16}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <CustomButton
              title={"Confirm"}
              onPress={confrimVenu}
              marginTop={10}
              color={COLORS.black}
              marginBottom={10}
            />
          </View>
        </CustomModal>

        <CustomModal
          isVisible={sucessModal}
          onDisable={() => setsucessModal(false)}
          backdropOpacity={0.4}
          isChange
        >
          <View style={styles.modalContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 58,
                paddingHorizontal: 20,
                borderBottomWidth: 0.2,
                borderBottomColor: COLORS.gray,
              }}
            >
              <CustomText
                label={"Date Confirmed"}
                fontFamily={fonts.medium}
                color={COLORS.primaryColor}
                fontSize={18}
              />

              <Icons
                name={"close"}
                family={"AntDesign"}
                color={COLORS.primaryColor}
                size={24}
                onPress={() => setsucessModal(false)}
              />
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <ImageFast
                source={image.Successtick}
                style={styles.icn2}
                resizeMode={"cover"}
              />
              <CustomText
                label={`A date request sent to ${
                  data?.first_name + " " + data?.last_name
                }`}
                fontFamily={fonts.medium}
                color={COLORS.white}
                width={300}
                textAlign={"center"}
                marginTop={10}
                fontSize={16}
              />
            </View>

            <View style={styles.dateContainer}>
              <ImageFast
                source={data?.image ? { uri: data?.image } : image.Date5}
                style={styles.icn2}
                resizeMode={"cover"}
              />
              <View>
                <CustomText
                  label={data?.first_name + " " + data?.last_name}
                  fontFamily={fonts.medium}
                  color={COLORS.primaryColor}
                  textTransform={"capitalize"}
                  fontSize={16}
                />
                <CustomText
                  label={data?.city + ", " + data?.country}
                  fontFamily={fonts.medium}
                  color={COLORS.gray}
                  fontSize={16}
                />
              </View>
            </View>

            <CustomText
              label={"Venue"}
              fontFamily={fonts.medium}
              color={COLORS.gray}
              fontSize={14}
              marginTop={10}
              marginLeft={12}
            />

            <View style={styles.venue}>
              <ImageFast
                source={image.location}
                resizeMode={"contain"}
                style={{ height: 24, width: 24 }}
              />
              <CustomText
                label={SelectedVenu?.name}
                fontFamily={fonts.medium}
                color={COLORS.white}
                fontSize={14}
              />
            </View>

            <CustomText
              label={"Date & Time"}
              fontFamily={fonts.medium}
              color={COLORS.gray}
              fontSize={14}
              marginTop={10}
              marginLeft={12}
            />
            <View style={styles.venue}>
              <ImageFast
                source={image.calenderLight}
                resizeMode={"contain"}
                style={{
                  height: 24,
                  width: 24,
                  tintColor: COLORS.primaryColor,
                }}
              />
              <View style={{ flexDirection: "row", gap: 5 }}>
                <CustomText
                  label={moment(selectedDate).format("MMMM D, YYYY")}
                  fontFamily={fonts.medium}
                  color={COLORS.white}
                  fontSize={14}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.medium,
                    color: COLORS.white,
                  }}
                >
                  {selectedTimeSlot?.display}
                </Text>
              </View>
            </View>

            <CustomButton
              title={"Back to Home"}
              width="95%"
              onPress={AddToCalender}
              color={COLORS.black}
              marginTop={20}
            />
          </View>
        </CustomModal>

        <CustomModal
          isVisible={SecondModal}
          onDisable={() => setSecondModal(false)}
          backdropOpacity={0.4}
          isChange
        >
          <View style={styles.modalContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 58,
                paddingHorizontal: 20,
                borderBottomWidth: 0.2,
                borderBottomColor: COLORS.gray,
              }}
            >
              <CustomText
                label={"Date Confirmed"}
                fontFamily={fonts.medium}
                color={COLORS.primaryColor}
                fontSize={18}
              />

              <Icons
                name={"close"}
                family={"AntDesign"}
                color={COLORS.primaryColor}
                size={24}
                onPress={() => setSecondModal(false)}
              />
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <ImageFast
                source={image.Successtick}
                style={styles.icn2}
                resizeMode={"cover"}
              />

              <CustomText
                label={`${
                  data?.first_name + " " + data?.last_name
                } has been notified - good luck on your second date!`}
                fontFamily={fonts.medium}
                color={COLORS.white}
                width={300}
                textAlign={"center"}
                marginTop={10}
                fontSize={16}
              />
            </View>

            <View style={styles.dateContainer}>
              <ImageFast
                source={data?.image ? { uri: data?.image } : image.Date5}
                style={styles.icn2}
                resizeMode={"cover"}
              />

              <View>
                <CustomText
                  label={data?.first_name + " " + data?.last_name}
                  fontFamily={fonts.medium}
                  color={COLORS.primaryColor}
                  textTransform={"capitalize"}
                  fontSize={16}
                />
                <CustomText
                  label={data?.city + ", " + data?.country}
                  fontFamily={fonts.medium}
                  color={COLORS.gray}
                  fontSize={16}
                />
              </View>
            </View>

            <CustomButton
              title={"Home"}
              width="95%"
              backgroundColor={"#323232"}
              loading={isloading}
              onPress={() => navigation.navigate("Home")}
              color={COLORS.primaryColor}
              marginTop={20}
            />
          </View>
        </CustomModal>
      </View>
    </ScreenWrapper>
  );
};

export default DatingProfile;

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
    maxHeight: "100%",
  },

  modalContainerVuenu: {
    backgroundColor: "#222222",
    width: "100%",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    height: 400,
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

  timeSlotContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },

  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 10,
  },

  timeSlotButton: {
    backgroundColor: "#323232",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: "30%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },

  timeSlotButtonSelected: {
    backgroundColor: COLORS.primaryColor,
    borderColor: COLORS.primaryColor,
  },

  noSlotsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
});