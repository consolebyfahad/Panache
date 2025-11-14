import React, { useEffect, useMemo, useState } from "react";

import CountryPhoneInput from "../../../components/CountryPhoneInput";
import ScreenWrapper from "../../../components/ScreenWrapper";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import DualText from "../../../components/DualText";
import Header from "../../../components/Header";

import { googleLogin, passwordRegex, regEmail } from "../../../utils/constants";
import { ToastMessage } from "../../../utils/ToastMessage";
import { ApiRequest, post } from "../../../Services/ApiRequest";
import CustomText from "../../../components/CustomText";
import fonts from "../../../assets/fonts";
import { COLORS } from "../../../utils/COLORS";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icons from "../../../components/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setToken } from "../../../store/reducer/AuthConfig";
import { setUserData } from "../../../store/reducer/usersSlice";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";
import CheckBox from "../../../components/CheckBox";

const Signup = ({ navigation }) => {
  const dispatch = useDispatch();
  const timimgdata = [
    {
      day: "Monday",
      isEnabled: false,
      fromTime: "2025-01-24T06:00:00.000Z",
      toTime: "2025-01-24T17:13:14.744Z",
    },
    {
      day: "Tuesday",
      isEnabled: false,
      fromTime: "2025-01-24T05:14:00.000Z",
      toTime: "2025-01-24T17:16:00.000Z",
    },
    {
      day: "Wednesday",
      isEnabled: false,
      fromTime: "2025-01-24T17:13:14.744Z",
      toTime: "2025-01-24T17:13:14.744Z",
    },
    {
      day: "Thursday",
      isEnabled: false,
      fromTime: "2025-01-24T05:13:00.000Z",
      toTime: "2025-01-24T17:13:14.744Z",
    },
    {
      day: "Friday",
      isEnabled: false,
      fromTime: "2025-01-24T17:13:14.744Z",
      toTime: "2025-01-24T17:13:14.744Z",
    },
    {
      day: "Saturday",
      isEnabled: false,
      fromTime: "2025-01-24T17:13:14.744Z",
      toTime: "2025-01-24T17:13:14.744Z",
    },
    {
      day: "Sunday",
      isEnabled: false,
      fromTime: "2025-01-24T17:13:14.744Z",
      toTime: "2025-01-24T17:13:14.744Z",
    },
  ];
  const [selectedName, setSelectedName] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const data = [
    { name: "Male", id: 1, isChecked: false },
    { name: "Female", id: 2, isChecked: false },
    { name: "Other", id: 3, isChecked: false },
  ];

  const handleSelection = (item) => {
    setSelectedName(item.name);
    setSelectedId(item.id);
  };

  const init = {
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    Cpassword: "",
  };
  const [state, setState] = useState(init);
  const inits = {
    fnameError: "",
    lnameError: "",
    emailError: "",
    phoneError: "",
    passwordError: "",
    CpasswordError: "",
  };

  const [errors, setErrors] = useState(inits);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    let body = {
      type: "register",
      timings: JSON.stringify(timimgdata),
      first_name: state.fname,
      last_name: state.lname,
      email: state.email,
      phone: state.phone,
      password: state.password,
      gender: selectedName,
    };
    const response = await ApiRequest(body);
    if (response?.data?.result == true) {
      setLoading(false);
      ToastMessage(response?.data?.message);
      // navigation.navigate("OTPScreen", {
      //   isAccountCreated: true,
      //   signupData: response?.data,
      //   phone: state.phone,
      // });
        navigation.navigate("FaceRecog", {
          isAccountCreated: true,
          signupData: response?.data,
          phone: state.phone,
      });
    } else {
      setLoading(false);
      ToastMessage(response?.data?.message);
    }
  };
  const array = [
  
    {
      id: 2,
      placeholder: "First Name",
      value: state.fname,
      onChange: (text) => setState({ ...state, fname: text }),
      error: errors.fnameError,
      isprofile: true,
    },
    {
      id: 3,
      placeholder: "Last Name",
      value: state.lname,
      onChange: (text) => setState({ ...state, lname: text }),
      error: errors.lnameError,
    },

    {
      id: 3,
      placeholder: "Email Address",
      value: state.email,
      error: errors.emailError,
      autoCapitalize: "none",
      onChange: (text) => setState({ ...state, email: text }),
    },
    {
      id: 4,
      placeholder: "Phone Number",
      value: state.phone,
      error: errors.phoneError,
      onChange: (text) => setState({ ...state, phone: text }),
    },

    {
      id: 5,
      placeholder: "Password",
      value: state.password,
      onChange: (text) => setState({ ...state, password: text }),
      error: errors.passwordError,
    },
    {
      id: 6,
      placeholder: "Confirm password",
      value: state.Cpassword,
      onChange: (text) => setState({ ...state, Cpassword: text }),
      error: errors.CpasswordError,
    },
  ];

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
       if (!state.fname) newErrors.fnameError = "Please enter First Name";
      else if (!state.lname) newErrors.lnameError = "Please enter Last Name";
      else if (state.fname.length < 4)
        newErrors.fnameError = "First name at least 4 characters";
      else if (!state.email)
        newErrors.emailError = "Please enter Email address";
      else if (!regEmail.test(state.email))
        newErrors.emailError = "Please enter valid email";
      else if (!state.password)
        newErrors.passwordError = "Please enter Password";
      else if (!state.Cpassword)
        newErrors.CpasswordError = "Please enter Confirm Password";
      else if (state.password !== state.Cpassword)
        newErrors.CpasswordError = "Password not Matched!";
      else if (!selectedName)
        newErrors.selectedNameError = "Gender is required!";
      setErrors(newErrors);
    };
  }, [state, selectedName]);

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);
  return (
    <ScreenWrapper scrollEnabled headerUnScrollable={() => <Header />}>
      <ImageFast
        source={image.appIcon}
        resizeMode={"contain"}
        style={{
          height: 96,
          width: 96,
          alignSelf: "center",
        }}
      />
      <CustomText
        label="Create Account"
        fontFamily={fonts.semiBold}
        fontSize={24}
        color={COLORS.white}
        alignSelf={"center"}
        marginTop={40}
      />
      <CustomText
        label="Set up your username and password. You can always change it later."
        fontFamily={fonts.regular}
        fontSize={18}
        textAlign={"center"}
        color={"#8C949F"}
        marginTop={2}
        alignSelf={"center"}
        marginBottom={20}
      />
      {array.map((item) => (
        <>
          {item.id == 4 ? (
            <CountryPhoneInput
              key={item.id}
              setValue={item.onChange}
              value={item.value}
              error={item.error}
              withLabel={item.withLabel}
            />
          ) : (
            <CustomInput
              withLabel={item.withLabel}
              key={item?.id}
              placeholder={item.placeholder}
              value={item.value}
              onChangeText={item.onChange}
              error={item.error}
              secureTextEntry={item?.id == 5 || item?.id == 6}
              autoCapitalize={item.autoCapitalize}
            />
          )}
        </>
      ))}

      <CustomText
        label={"Gender"}
        marginBottom={8}
        color={COLORS.primaryColor}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {data.map((item) => (
          <TouchableOpacity key={item?.id} style={styles.item}>
            <CheckBox
              value={selectedId === item.id}
              setValue={() => handleSelection(item)}
            />
            <CustomText
              label={item.name}
              color={COLORS.primaryColor}
              fontFamily={fonts.medium}
            />
          </TouchableOpacity>
        ))}
      </View>
      {errors.selectedNameError ? (
        <CustomText
          label={errors.selectedNameError}
          color={COLORS.red}
          fontFamily={fonts.regular}
        />
      ) : null}

      <CustomButton
        title="Create Account"
        marginTop={20}
        color={COLORS.black}
        onPress={handleSendOtp}
        loading={loading}
        disabled={!Object.values(errors).every((error) => error === "")}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{
          flexDirection: "row",
          alignSelf: "center",
          alignItems: "center",
          marginTop: 20,
          gap: 5,
          paddingBottom: 10,
        }}
      >
        <CustomText
          fontSize={14}
          fontFamily={fonts.bold}
          alignSelf="center"
          color={COLORS.gray1}
          label={"Already have an account?"}
        />

        <CustomText
          label={"Sign in"}
          fontSize={14}
          fontFamily={fonts.bold}
          color={COLORS.primaryColor}
        />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

export default Signup;

const styles = StyleSheet.create({
  backIcon: {
    width: 35,
    height: 35,
    backgroundColor: COLORS.back,
    elevation: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 25,
    marginTop: 25,
  },

  footerText: {
    textAlign: "center",
    fontFamily: fonts.regular,
    color: COLORS.black,
    marginBottom: 10,
    marginTop: 20,
  },

  item: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
