import { Keyboard, Animated, View, StyleSheet } from "react-native";
import React, { useEffect, useState, useRef } from "react";

import ScreenWrapper from "../../../components/ScreenWrapper";
import CustomButton from "../../../components/CustomButton";
import CustomText from "../../../components/CustomText";
import OTPComponent from "../../../components/OTP";

import { ToastMessage } from "../../../utils/ToastMessage";
import { ApiRequest, post } from "../../../Services/ApiRequest";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import { TouchableOpacity } from "react-native";
import Icons from "../../../components/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "../../../store/reducer/AuthConfig";
import { setUserData } from "../../../store/reducer/usersSlice";
import { useDispatch } from "react-redux";
import { useTheme } from "../../../context/ThemeContext";
import Header from "../../../components/Header";

const OTPScreen = ({ navigation, route }) => {
  const isAccountCreated = route.params?.isAccountCreated;
  const isForget = route.params?.isForget;
  const forgetToken = route.params?.token;
  const signupData = route.params?.signupData;
  console.log(signupData);
  
  
  const phone = route.params?.phone;

  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const [timer, setTimer] = useState(59);
  const timerRef = useRef(null);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      "keyboardWillShow",
      (event) => {
        Animated.timing(keyboardHeight, {
          duration: event.duration,
          toValue: event.endCoordinates.height,
          useNativeDriver: false,
        }).start();
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      "keyboardWillHide",
      (event) => {
        Animated.timing(keyboardHeight, {
          duration: event.duration,
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    );
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    startTimer();

    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setTimer(59);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleCheckOtp = async () => {
    if (isForget) {
      handleRegisterUser();
    } else {
      setLoading(true);
      const body = {
        type: "verify_otp",
        code: otp,
        user_id: signupData?.user_id,
      };

      const response = await ApiRequest(body);
      if (response.data.result == true) {
        ToastMessage(response?.data?.message);
        setLoading(false);
        navigation.navigate("SuccessPage", {
          isAccountCreated: isAccountCreated,
        });
      } else {
        ToastMessage(response?.data?.message);
        console.log(response?.data?.message);
        setLoading(false);
      }
    }
  };

  const handleRegisterUser = async () => {
    setLoading(true);
    const body = {
      type: "verify_otp",
      code: otp,
      user_id: signupData?.user_id,
    };
    const response = await ApiRequest(body);
    if (response.data.result == true) {
      ToastMessage(response?.data?.message);
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "ResetPass",
            params: {
              token: signupData?.user_id,
            },
          },
        ],
      });
    } else {
      ToastMessage(response?.data?.message);
      console.log(response?.data?.message);
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    startTimer();
    const body = {
      type: "resend_otp",
      user_id: signupData?.user_id,
      phone: phone
    };
    const response = await ApiRequest(body);
    if (response.data.result == true) {
       console.log(response.data);
    } else {
      ToastMessage(response?.data?.message);
      console.log(response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => <Header />}
      footerUnScrollable={() => (
        <Animated.View
          style={{ marginBottom: keyboardHeight, paddingHorizontal: 20 }}
        >
          <CustomButton
            title="Verify"
            marginTop={40}
            marginBottom={20}
            color={COLORS.black}
            loading={loading}
            disabled={!otp}
            onPress={handleCheckOtp}
          />
        </Animated.View>
      )}
    >
      <CustomText
        label="Verification Code"
        fontFamily={fonts.bold}
        fontSize={26}
        color={COLORS.white}
        alignSelf={"center"}
        marginTop={40}
      />
      <CustomText
        label={`Please enter verification code we sent to your phone ${
          signupData?.phone || " "
        }`}
        color={COLORS.gray}
        fontSize={18}
        textAlign={"center"}
        fontFamily={fonts.medium}
        marginBottom={50}
      />
      <OTPComponent value={otp} setValue={setOtp} />
      <View style={styles.row}>
        <CustomText
          label="Resend code"
          fontSize={16}
          onPress={handleResendOtp}
          fontFamily={fonts.medium}
          color={COLORS.white}
          disabled={timer !== 0}
        />
        <CustomText
          label={` 00 : ${String(timer).padStart(2, "0")}`}
          color={COLORS.primaryColor}
          marginBottom={-3}
          fontSize={16}
        />
      </View>
    </ScreenWrapper>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
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
});
