import React, { useState, forwardRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import CustomText from "./CustomText";
import Icons from "./Icons";
import { COLORS } from "../utils/COLORS";
import i18n from "../Language/i18n";
import fonts from "../assets/fonts";
import ImageFast from "./ImageFast";
import { Images } from "../assets/images";

const CustomInput = forwardRef(
  (
    {
      placeholder,
      secureTextEntry,
      value,
      onChangeText,
      keyboardType,
      multiline,
      maxLength,
      placeholderTextColor,
      editable,
      textAlignVertical,
      marginBottom,
      height,
      autoCapitalize,
      error,
      isFocus,
      isBlur,
      width,
      onEndEditing,
      autoFocus,
      searchIcon,
      borderRadius,
      marginTop,
      withLabel,
      isError,
      labelColor,
      borderColor,
      isEmail,
      isPass,
      isProfile,
      isfilter,
      Background,
      City,
      Country,
      dateTime,
    },
    ref // Receiving the forwarded ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hidePass, setHidePass] = useState(true);

    const handleFocus = () => {
      setIsFocused(true);
      isFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      isBlur?.();
    };

    return (
      <View style={{ width: width || "100%" }}>
        {withLabel && (
          <CustomText
            label={withLabel}
            marginBottom={8}
            color={labelColor || COLORS.white}
          />
        )}
        <View
          style={[
            styles.mainContainer,
            {
              marginBottom: error ? 5 : marginBottom || 15,
              marginTop,
              borderColor:
                error || isError
                  ? COLORS.red
                  : isFocused
                  ? COLORS.primaryColor
                  : borderColor
                  ? borderColor
                  : COLORS.inputBorder,
              height: height || 52,
              width: "100%",
              borderRadius: borderRadius || 12,
              paddingLeft: searchIcon ? 45 : 20,
              backgroundColor: Background || "#141414",
            },
          ]}
        >
          {searchIcon && (
            <Icons
              family="Feather"
              name="search"
              size={22}
              color={COLORS.black}
              style={{ position: "absolute", left: 15 }}
            />
          )}

          <TextInput
            ref={ref} // Assigning the forwarded ref
            placeholder={i18n.t(placeholder)}
            style={[
              styles.input,
              {
                width: secureTextEntry || searchIcon ? "92%" : "98%",
                paddingVertical: multiline ? 5 : 0,
                marginLeft: isEmail || isPass || isProfile ? 25 : 0,
                color: COLORS.white,
              },
            ]}
            secureTextEntry={secureTextEntry ? (hidePass ? true : false) : false}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            multiline={multiline}
            onEndEditing={onEndEditing}
            maxLength={maxLength}
            placeholderTextColor={placeholderTextColor || COLORS.inputLabel}
            editable={editable}
            textAlignVertical={multiline ? "top" : textAlignVertical}
            autoCapitalize={autoCapitalize}
            autoFocus={autoFocus}
          />
          {secureTextEntry && (
            <Icons
              name={!hidePass ? "eye" : "eye-off"}
              color={COLORS.gray}
              size={20}
              family="Feather"
              marginLeft={-10}
              onPress={() => setHidePass(!hidePass)}
            />
          )}
          {dateTime && (
            <Icons
              name={"calendar"}
              color={COLORS.gray}
              size={20}
              family="Ionicons"
              marginLeft={-10}
              onPress={() => setHidePass(!hidePass)}
            />
          )}

          {City && (
            <Icons
              name={"down"}
              color={COLORS.gray}
              size={20}
              family="AntDesign"
              marginLeft={-10}
              onPress={() => setHidePass(!hidePass)}
            />
          )}
          {Country && (
            <Icons
              name={"down"}
              color={COLORS.gray}
              size={20}
              family="AntDesign"
              marginLeft={-10}
              onPress={() => setHidePass(!hidePass)}
            />
          )}
          {isfilter && (
            <ImageFast
              source={Images.filter}
              style={{ height: 20, width: 20 }}
              resizeMode={"contain"}
            />
          )}
        </View>
        {error && (
          <CustomText
            label={error}
            color={COLORS.red}
            fontFamily={fonts.semiBold}
            fontSize={10}
            marginBottom={15}
            numberOfLines={1}
          />
        )}
      </View>
    );
  }
);

export default CustomInput;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    height: "100%",
    padding: 0,
    margin: 0,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
});
