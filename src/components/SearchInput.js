import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import Icons from "./Icons";

import { COLORS } from "../utils/COLORS";
import i18n from "../Language/i18n";
import fonts from "../assets/fonts";

const SearchInput = ({
  placeholder,
  value,
  onChangeText,
  maxLength,
  marginBottom,
  isFocus,
  isBlur,
  autoFocus,
  ref,
  marginTop,
  isBack,
  onPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const navigation = useNavigation();
  const handleFocus = () => {
    setIsFocused(true);
    isFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    isBlur?.();
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {
          marginBottom,
          marginTop,
          borderColor: isFocused ? COLORS.primaryColor : "#F2F2F2",
        },
      ]}
    >
      {isBack ? (
        <Icons
          family="Ionicons"
          name="arrow-back-outline"
          color="#0F1621"
          size={25}
          style={{ marginRight: 10 }}
          onPress={() => navigation.goBack()}
        />
      ) : null}

      <TextInput
        ref={ref}
        placeholder={i18n.t(placeholder)}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        placeholderTextColor="#9B9E9F"
        autoFocus={autoFocus}
      />
      <TouchableOpacity
        style={styles.searchIcon}
        activeOpacity={0.6}
        onPress={onPress}
      >
        <Icons family="Feather" name="search" color={COLORS.white} size={18} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FBFBFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderWidth: 1,
    height: 50,
    width: "100%",
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    padding: 0,
    margin: 0,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: COLORS.black,
  },
  searchIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
});
