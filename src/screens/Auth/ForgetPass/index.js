import {
  Animated,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import ScreenWrapper from "../../../components/ScreenWrapper";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";
import DualText from "../../../components/DualText";
import Icons from "../../../components/Icons";

import { ToastMessage } from "../../../utils/ToastMessage";
import { ApiRequest, post } from "../../../Services/ApiRequest";
import { regEmail } from "../../../utils/constants";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import Header from "../../../components/Header";
import CountryPhoneInput from "../../../components/CountryPhoneInput";

const ForgetPass = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const [Phone, setPhone] = useState("");

  const dispatch = useDispatch();

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



  const sendOtp = async () => {
    setLoading(true);
    const body = {
    type: "send_otp",
     phone: Phone,
    };    
    const response = await ApiRequest(body);
    if(response?.data?.result){
      ToastMessage(response?.data?.message);
      setLoading(false);
      navigation.navigate("OTPScreen", {
        isForget: true,
        signupData: response?.data,
        phone: Phone,
      });
    }else{
      ToastMessage(response?.data?.message);
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
            title="Continue"
            onPress={sendOtp}
            loading={loading}
            disabled={!Phone}
          />

          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 20,
              gap: 5,
            }}
          >
            <CustomText
              fontSize={14}
              fontFamily={fonts.bold}
              alignSelf="center"
              color={COLORS.gray1}
              label={"Don’t have an account?"}
            />

            <CustomText
              label={"Sign up"}
              fontSize={14}
              onPress={() =>
                navigation.navigate("Signup")
              }
              fontFamily={fonts.bold}
              color={COLORS.primaryColor}
            />
          </View>
        </Animated.View>
      )}
    >
      <CustomText
        label="Forgot Password"
        fontFamily={fonts.semiBold}
        fontSize={24}
        color={COLORS.primaryColor}
        marginTop={40}
      />
      <CustomText
        label="Send otp to reset your password"
        fontSize={16}
        color={COLORS.white}
        marginBottom={50}
      />
      <CountryPhoneInput
        setValue={setPhone}
        value={Phone}
        withLabel={"Phone"}
      />
    </ScreenWrapper>
  );
};

export default ForgetPass;
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
});
