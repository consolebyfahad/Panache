import PhoneInput from "react-native-phone-number-input";
import { StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";

import CustomText from "./CustomText";
import Icons from "./Icons";

import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";

const CountryPhoneInput = ({
  value = "+1",
  setValue,
  withLabel,
  onEndEditing,
  error,
  showCheck,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef();
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  return (
    <View style={{ marginBottom: error ? 0 : 20 }}>
      {withLabel && (
        <CustomText label={withLabel} marginBottom={8} color={COLORS.white} />
      )}
      <PhoneInput
        ref={ref}
        textInputStyle={{
          fontSize: 14,
          fontFamily: fonts.regular,
          color: COLORS.white,
        }}
        defaultValue={value}
        defaultCode="GB"
        layout="first"
        textInputProps={{
          placeholderTextColor: COLORS.inputLabel,
          maxLength: 12,
          style: [
            styles.phoneInput,
            { flex: 1, backgroundColor: COLORS.inputBorder },
          ],
          onFocus: handleFocus,
          onBlur: handleBlur,
          onEndEditing,
        }}
        renderDropdownImage={() => null}
        countryPickerButtonStyle={{
          backgroundColor: COLORS.inputBorder,
          color: COLORS.white,
        }}
        codeTextStyle={[styles.phoneInput, { marginLeft: -8 }]}
        containerStyle={[
          styles.phoneInputContainer,
          ,
          {
            borderColor: error
              ? COLORS.red
              : isFocused
              ? COLORS.primaryColor
              : COLORS.inputBorder,
          },
        ]}
        textContainerStyle={[styles.textContainerStyle]}
        onChangeFormattedText={(formattedValue) => setValue(formattedValue)}
      />
      {error && (
        <CustomText
          label={error}
          color={COLORS.red}
          fontFamily={fonts.semiBold}
          fontSize={10}
          marginBottom={15}
          marginTop={5}
        />
      )}
      {showCheck && value?.length ? (
        <Icons
          family={error ? "Entypo" : "AntDesign"}
          name={error ? "circle-with-cross" : "checkcircle"}
          size={20}
          color={error ? COLORS.red : COLORS.green}
          style={{ position: "absolute", right: 10, zIndex: 999, top: 15 }}
          onPress={error ? () => setValue("") : false}
        />
      ) : null}
    </View>
  );
};
export default CountryPhoneInput;
const styles = StyleSheet.create({
  phoneInput: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: COLORS.primaryColor,
  },
  phoneInputContainer: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    borderRadius: 6,
    color: COLORS.white,
    overflow: "hidden",
    borderWidth: 1,
    backgroundColor: COLORS.inputBorder,
  },
  textContainerStyle: {
    paddingVertical: 0,
    color: COLORS.white,
    backgroundColor: COLORS.inputBorder,
  },
});
