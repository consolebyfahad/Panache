import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';

import CustomText from './CustomText';
import Icons from './Icons';

import {COLORS} from '../utils/COLORS';
import fonts from '../assets/fonts';

const CustomCalendar = ({disabled, selectedDates = [], disabledDates = []}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getMonthName = date => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[date.getMonth()];
  };

  const handleDatePress = day => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(day);
      setSelectedEndDate(null);
    } else if (selectedStartDate && !selectedEndDate) {
      if (day < selectedStartDate) {
        setSelectedStartDate(day);
      } else {
        setSelectedEndDate(day);
      }
    }
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const daysInMonth = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );

  const monthName = getMonthName(currentMonth);
  const today = new Date();

  const isDateInRange = day => {
    if (!selectedStartDate || !selectedEndDate) {
      return false;
    }
    return day > selectedStartDate && day < selectedEndDate;
  };

  const isStartDate = day => {
    return (
      selectedStartDate &&
      day.toDateString() === selectedStartDate.toDateString()
    );
  };

  const isEndDate = day => {
    return (
      selectedEndDate && day.toDateString() === selectedEndDate.toDateString()
    );
  };

  const isSelectedDate = day => {
    return selectedDates.some(
      selectedDate =>
        new Date(selectedDate).toDateString() === day.toDateString(),
    );
  };

  const isToday = day => {
    return day.toDateString() === today.toDateString();
  };

  const isDisabledDate = day => {
    return disabledDates.some(
      disabledDate =>
        new Date(disabledDate).toDateString() === day.toDateString(),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icons
          family="Entypo"
          name="chevron-left"
          size={22}
          color={COLORS.black}
          onPress={prevMonth}
        />
        <CustomText
          fontFamily={fonts.bold}
          fontSize={16}
          label={`${monthName} ${currentMonth.getFullYear()}`}
        />
        <Icons
          family="Entypo"
          name="chevron-right"
          size={22}
          onPress={nextMonth}
        />
      </View>
      <View style={styles.daysHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <View style={{width: '14.25%', alignItems: 'center'}} key={day}>
            <CustomText key={day} label={day} fontFamily={fonts.semiBold} />
          </View>
        ))}
      </View>
      <View style={styles.daysContainer}>
        {daysInMonth.map((day, index) => {
          const isBeforeToday = day < today && !isToday(day);
          const isSelectedStart = isStartDate(day);
          const isSelectedEnd = isEndDate(day);
          const inRange = isDateInRange(day);
          const isSelected = isSelectedDate(day);
          const isDisabled = isDisabledDate(day);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.day,
                isSelectedStart ? styles.selectedStartDay : {},
                isSelectedEnd ? styles.selectedEndDay : {},
                inRange ? styles.inRangeDay : {},
                isSelected ? styles.selectedDay : {},
                isDisabled ? styles.disabledDay : {},
              ]}
              onPress={() =>
                !isBeforeToday && !isDisabled && handleDatePress(day)
              }
              disabled={disabled || isBeforeToday || isDisabled}>
              <View
                style={[
                  styles.dayInner,
                  isSelectedStart ? styles.selectedStartDayInner : {},
                  isSelectedEnd ? styles.selectedEndDayInner : {},
                  inRange ? styles.inRangeDayInner : {},
                  isSelected ? styles.selectedDayInner : {},
                  isDisabled ? styles.disabledDayInner : {},
                ]}>
                <CustomText
                  label={day.getDate()}
                  fontFamily={fonts.bold}
                  color={
                    isBeforeToday || isDisabled
                      ? COLORS.gray
                      : isSelectedStart || isSelectedEnd || isSelected
                      ? COLORS.white
                      : COLORS.black
                  }
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  daysHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.1%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  dayInner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  selectedDay: {
    borderRadius: 10,
  },
  selectedDayInner: {
    backgroundColor: COLORS.black,
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  selectedStartDay: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  selectedStartDayInner: {
    backgroundColor: COLORS.black,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
  },
  selectedEndDay: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  selectedEndDayInner: {
    backgroundColor: COLORS.black,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  },
  inRangeDay: {
    backgroundColor: 'transparent',
  },
  inRangeDayInner: {
    backgroundColor: COLORS.button,
  },
  disabledDay: {
    backgroundColor: 'transparent',
  },
  disabledDayInner: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 100,
    width: 30,
    height: 30,
  },
});

export default CustomCalendar;
