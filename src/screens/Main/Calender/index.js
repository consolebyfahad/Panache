import moment from "moment/moment";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import Toggle from "react-native-toggle-element";
import { useDispatch, useSelector } from "react-redux";
import fonts from "../../../assets/fonts";
import CustomButton from "../../../components/CustomButton";
import CustomText from "../../../components/CustomText";
import Header from "../../../components/Header";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { ApiRequest } from "../../../Services/ApiRequest";
import { setUserData } from "../../../store/reducer/usersSlice";
import { COLORS } from "../../../utils/COLORS";
import { ToastMessage } from "../../../utils/ToastMessage";
import Icons from "../../../components/Icons";

const MyCalendar = ({ navigation }) => {
  const { userData } = useSelector((state) => state.users);

  let timings = [];
  let specificDates = {};

  if (userData?.timings && userData?.timings != null) {
    try {
      timings = JSON.parse(userData?.timings);
    } catch (error) {
      console.error("Error parsing user timings:", error);
      timings = [];
    }
  }

  // Parse specific date overrides
  if (userData?.specific_dates && userData?.specific_dates != null) {
    try {
      specificDates = JSON.parse(userData?.specific_dates);
    } catch (error) {
      console.error("Error parsing specific dates:", error);
      specificDates = {};
    }
  }

  const isToken = useSelector((state) => state.authConfig.token);
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  
  // Toggle between weekly and calendar view
  const [viewMode, setViewMode] = useState("weekly"); // "weekly" or "calendar"
  
  // Current month for calendar view
  const [currentMonth, setCurrentMonth] = useState(moment());
  
  // Selected date for override
  const [selectedDate, setSelectedDate] = useState(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  
  // Specific date overrides storage
  const [dateOverrides, setDateOverrides] = useState(specificDates);

  const [availability, setAvailability] = useState(
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((day, index) => ({
      day,
      isEnabled: timings[index]?.isEnabled || false,
      fromTime: timings[index]?.fromTime
        ? new Date(timings[index]?.fromTime)
        : new Date(),
      toTime: timings[index]?.toTime
        ? new Date(timings[index]?.toTime)
        : new Date(),
    }))
  );

  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isSettingFromTime, setIsSettingFromTime] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // Override modal state
  const [overrideFromTime, setOverrideFromTime] = useState(new Date());
  const [overrideToTime, setOverrideToTime] = useState(new Date());
  const [overrideIsAvailable, setOverrideIsAvailable] = useState(true);

  const handleToggle = (index, value) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].isEnabled = value;
    setAvailability(updatedAvailability);
  };

  const handleSetTime = (index, isFromTime, time) => {
    const updatedAvailability = [...availability];
    if (isFromTime) {
      updatedAvailability[index].fromTime = time;
    } else {
      updatedAvailability[index].toTime = time;
    }
    setAvailability(updatedAvailability);
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.clone().startOf("month");
    const endOfMonth = currentMonth.clone().endOf("month");
    const startDate = startOfMonth.clone().startOf("week");
    const endDate = endOfMonth.clone().endOf("week");

    const days = [];
    const day = startDate.clone();

    while (day.isBefore(endDate, "day")) {
      days.push({
        date: day.clone(),
        isCurrentMonth: day.month() === currentMonth.month(),
      });
      day.add(1, "day");
    }

    return days;
  };

  // Check if a specific date has availability
  const getDateAvailability = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    
    // Check for specific override first
    if (dateOverrides[dateStr]) {
      return dateOverrides[dateStr];
    }
    
    // Fall back to weekly schedule
    const dayOfWeek = date.day();
    const daySchedule = availability[dayOfWeek === 0 ? 6 : dayOfWeek - 1];
    
    return {
      isEnabled: daySchedule.isEnabled,
      fromTime: daySchedule.fromTime,
      toTime: daySchedule.toTime,
      isOverride: false,
    };
  };

  // Handle date selection in calendar
  const handleDatePress = (date) => {
    setSelectedDate(date);
    const dateStr = date.format("YYYY-MM-DD");
    const existing = dateOverrides[dateStr];
    
    if (existing) {
      setOverrideIsAvailable(existing.isEnabled);
      setOverrideFromTime(new Date(existing.fromTime));
      setOverrideToTime(new Date(existing.toTime));
    } else {
      const dayAvailability = getDateAvailability(date);
      setOverrideIsAvailable(dayAvailability.isEnabled);
      setOverrideFromTime(dayAvailability.fromTime);
      setOverrideToTime(dayAvailability.toTime);
    }
    
    setShowOverrideModal(true);
  };

  // Save date override
  const saveOverride = () => {
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const newOverrides = { ...dateOverrides };
    
    newOverrides[dateStr] = {
      isEnabled: overrideIsAvailable,
      fromTime: overrideFromTime.toISOString(),
      toTime: overrideToTime.toISOString(),
    };
    
    setDateOverrides(newOverrides);
    setShowOverrideModal(false);
    ToastMessage(`Override set for ${selectedDate.format("MMM DD, YYYY")}`);
  };

  // Remove date override
  const removeOverride = () => {
    const dateStr = selectedDate.format("YYYY-MM-DD");
    const newOverrides = { ...dateOverrides };
    delete newOverrides[dateStr];
    setDateOverrides(newOverrides);
    setShowOverrideModal(false);
    ToastMessage("Override removed");
  };

  const uploadavailability = async () => {
    setLoading(true);
    let body = {
      type: "update_data",
      table_name: "users",
      timings: JSON.stringify(availability),
      specific_dates: JSON.stringify(dateOverrides),
      id: isToken,
    };
    const response = await ApiRequest(body);
    if (response?.data?.result) {
      let body = {
        type: "profile",
        user_id: isToken,
      };
      const profileApi = await ApiRequest(body);
      dispatch(setUserData(profileApi?.data?.profile));
      setLoading(false);
      navigation.goBack();
      ToastMessage(response?.data?.message);
    } else {
      ToastMessage(response?.data?.message);
      setLoading(false);
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <ScreenWrapper headerUnScrollable={() => <Header title={"My Calendar"} />}>
      <CustomText
        label={"Your Availability"}
        color={COLORS.white}
        fontFamily={fonts.bold}
        fontSize={22}
      />
      <CustomText
        label={"Manage your availability for dating"}
        color={COLORS.gray}
        fontFamily={fonts.medium}
        fontSize={14}
      />

      {/* View Toggle */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            viewMode === "weekly" && styles.viewToggleButtonActive,
          ]}
          onPress={() => setViewMode("weekly")}
        >
          <CustomText
            label={"Weekly Schedule"}
            color={viewMode === "weekly" ? COLORS.white : COLORS.gray}
            fontFamily={fonts.medium}
            fontSize={14}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            viewMode === "calendar" && styles.viewToggleButtonActive,
          ]}
          onPress={() => setViewMode("calendar")}
        >
          <CustomText
            label={"Calendar View"}
            color={viewMode === "calendar" ? COLORS.white : COLORS.gray}
            fontFamily={fonts.medium}
            fontSize={14}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 20 }}
      >
        {viewMode === "weekly" ? (
          // Weekly Schedule View
          <>
            {availability.map((day, index) => (
              <View key={index} style={styles.availbilityContainer}>
                <View style={styles.availbilityText}>
                  <CustomText
                    label={day.day}
                    color={COLORS.white}
                    fontFamily={fonts.bold}
                    fontSize={16}
                  />
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
                    value={day.isEnabled}
                    onPress={() => handleToggle(index, !day.isEnabled)}
                  />
                </View>

                {day.isEnabled && (
                  <View style={styles.timeRow}>
                    <View style={{ width: "45%" }}>
                      <CustomText
                        label={"From"}
                        color={COLORS.gray}
                        fontFamily={fonts.regular}
                        fontSize={12}
                        marginLeft={5}
                      />
                      <TouchableOpacity
                        style={styles.time}
                        onPress={() => {
                          setSelectedDayIndex(index);
                          setIsSettingFromTime(true);
                          setOpenTime(true);
                        }}
                      >
                        <CustomText
                          label={moment(day.fromTime).format("h:mm A")}
                          color={COLORS.white}
                          fontFamily={fonts.regular}
                          fontSize={12}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={{ width: "45%" }}>
                      <CustomText
                        label={"To"}
                        color={COLORS.gray}
                        fontFamily={fonts.regular}
                        fontSize={12}
                        marginLeft={5}
                      />
                      <TouchableOpacity
                        style={styles.time}
                        onPress={() => {
                          setSelectedDayIndex(index);
                          setIsSettingFromTime(false);
                          setOpenTime(true);
                        }}
                      >
                        <CustomText
                          label={moment(day.toTime).format("h:mm A")}
                          color={COLORS.white}
                          fontFamily={fonts.regular}
                          fontSize={12}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          // Calendar View
          <View style={styles.calendarContainer}>
            {/* Month Navigation */}
            <View style={styles.monthNavigation}>
              <TouchableOpacity
                onPress={() =>
                  setCurrentMonth(currentMonth.clone().subtract(1, "month"))
                }
              >
                <Icons
                  name={"chevron-left"}
                  family={"Entypo"}
                  color={COLORS.white}
                  size={30}
                />
              </TouchableOpacity>
              <CustomText
                label={currentMonth.format("MMMM YYYY")}
                color={COLORS.white}
                fontFamily={fonts.bold}
                fontSize={18}
              />
              <TouchableOpacity
                onPress={() =>
                  setCurrentMonth(currentMonth.clone().add(1, "month"))
                }
              >
                <Icons
                  name={"chevron-right"}
                  family={"Entypo"}
                  color={COLORS.white}
                  size={30}
                />
              </TouchableOpacity>
            </View>

            {/* Day Headers */}
            <View style={styles.dayHeaderRow}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <View key={day} style={styles.dayHeader}>
                  <CustomText
                    label={day}
                    color={COLORS.gray}
                    fontFamily={fonts.medium}
                    fontSize={12}
                  />
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((dayInfo, index) => {
                const availability = getDateAvailability(dayInfo.date);
                const dateStr = dayInfo.date.format("YYYY-MM-DD");
                const hasOverride = !!dateOverrides[dateStr];
                const isToday = dayInfo.date.isSame(moment(), "day");
                const isPast = dayInfo.date.isBefore(moment(), "day");

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      !dayInfo.isCurrentMonth && styles.calendarDayOtherMonth,
                      isToday && styles.calendarDayToday,
                      isPast && styles.calendarDayPast,
                    ]}
                    onPress={() => !isPast && handleDatePress(dayInfo.date)}
                    disabled={isPast}
                  >
                    <CustomText
                      label={dayInfo.date.format("D")}
                      color={
                        !dayInfo.isCurrentMonth
                          ? COLORS.gray
                          : isToday
                          ? COLORS.primaryColor
                          : COLORS.white
                      }
                      fontFamily={fonts.medium}
                      fontSize={14}
                    />
                    {dayInfo.isCurrentMonth && !isPast && (
                      <View
                        style={[
                          styles.availabilityIndicator,
                          {
                            backgroundColor: availability.isEnabled
                              ? COLORS.primaryColor
                              : "#666",
                          },
                        ]}
                      />
                    )}
                    {hasOverride && (
                      <View style={styles.overrideBadge}>
                        <CustomText
                          label={"•"}
                          color={COLORS.primaryColor}
                          fontSize={20}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: COLORS.primaryColor },
                  ]}
                />
                <CustomText
                  label={"Available"}
                  color={COLORS.gray}
                  fontSize={12}
                />
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#666" }]} />
                <CustomText
                  label={"Unavailable"}
                  color={COLORS.gray}
                  fontSize={12}
                />
              </View>
              <View style={styles.legendItem}>
                <CustomText label={"•"} color={COLORS.primaryColor} fontSize={20} />
                <CustomText
                  label={"Override"}
                  color={COLORS.gray}
                  fontSize={12}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <CustomButton
        onPress={uploadavailability}
        title={"Update Availability"}
        loading={Loading}
        marginBottom={40}
      />

      {/* Weekly Time Picker */}
      {openTime && (
        <DatePicker
          onCancel={() => setOpenTime(false)}
          open={openTime}
          date={
            isSettingFromTime
              ? availability[selectedDayIndex].fromTime
              : availability[selectedDayIndex].toTime
          }
          onConfirm={(time) => {
            handleSetTime(selectedDayIndex, isSettingFromTime, time);
            setOpenTime(false);
          }}
          theme="dark"
          mode="time"
          modal
        />
      )}

      {/* Override Modal */}
      {showOverrideModal && selectedDate && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CustomText
              label={`Set Availability for ${selectedDate.format(
                "MMM DD, YYYY"
              )}`}
              color={COLORS.white}
              fontFamily={fonts.bold}
              fontSize={18}
              marginBottom={15}
            />

            <View style={styles.overrideToggleRow}>
              <CustomText
                label={"Available"}
                color={COLORS.white}
                fontFamily={fonts.medium}
                fontSize={16}
              />
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
                value={overrideIsAvailable}
                onPress={() => setOverrideIsAvailable(!overrideIsAvailable)}
              />
            </View>

            {overrideIsAvailable && (
              <View style={styles.timeSelectionContainer}>
                <View style={{ width: "48%" }}>
                  <CustomText
                    label={"From"}
                    color={COLORS.gray}
                    fontSize={12}
                    marginBottom={5}
                  />
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => {
                      setIsSettingFromTime(true);
                      setOpenTime(true);
                    }}
                  >
                    <CustomText
                      label={moment(overrideFromTime).format("h:mm A")}
                      color={COLORS.white}
                      fontSize={14}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ width: "48%" }}>
                  <CustomText
                    label={"To"}
                    color={COLORS.gray}
                    fontSize={12}
                    marginBottom={5}
                  />
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => {
                      setIsSettingFromTime(false);
                      setOpenTime(true);
                    }}
                  >
                    <CustomText
                      label={moment(overrideToTime).format("h:mm A")}
                      color={COLORS.white}
                      fontSize={14}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              {dateOverrides[selectedDate.format("YYYY-MM-DD")] && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.removeButton]}
                  onPress={removeOverride}
                >
                  <CustomText
                    label={"Remove Override"}
                    color={COLORS.white}
                    fontSize={14}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowOverrideModal(false)}
              >
                <CustomText label={"Cancel"} color={COLORS.gray} fontSize={14} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveOverride}
              >
                <CustomText label={"Save"} color={COLORS.white} fontSize={14} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Override Time Picker */}
      {showOverrideModal && openTime && (
        <DatePicker
          onCancel={() => setOpenTime(false)}
          open={openTime}
          date={isSettingFromTime ? overrideFromTime : overrideToTime}
          onConfirm={(time) => {
            if (isSettingFromTime) {
              setOverrideFromTime(time);
            } else {
              setOverrideToTime(time);
            }
            setOpenTime(false);
          }}
          theme="dark"
          mode="time"
          modal
        />
      )}
    </ScreenWrapper>
  );
};

export default MyCalendar;

const styles = StyleSheet.create({
  availbilityContainer: {
    backgroundColor: "#323232",
    borderRadius: 15,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  availbilityText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  time: {
    backgroundColor: "#222222",
    height: 46,
    borderRadius: 15,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#323232",
    borderRadius: 15,
    padding: 5,
    marginVertical: 15,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  viewToggleButtonActive: {
    backgroundColor: COLORS.primaryColor,
  },
  calendarContainer: {
    backgroundColor: "#323232",
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dayHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  dayHeader: {
    width: "14%",
    alignItems: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    position: "relative",
  },
  calendarDayOtherMonth: {
    opacity: 0.3,
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: COLORS.primaryColor,
    borderRadius: 8,
  },
  calendarDayPast: {
    opacity: 0.4,
  },
  availabilityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
    bottom: 5,
  },
  overrideBadge: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#323232",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  overrideToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  timeSelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timePickerButton: {
    backgroundColor: "#222222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    flexWrap: "wrap",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primaryColor,
  },
  cancelButton: {
    backgroundColor: "#222222",
  },
  removeButton: {
    backgroundColor: "#d32f2f",
    marginRight: "auto",
  },
});