import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View, Animated, Keyboard } from "react-native";
import { useDispatch } from "react-redux";

import ScreenWrapper from "../../../components/ScreenWrapper";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";
import DualText from "../../../components/DualText";

import SocialIcon from "./molecules/SocialIcon";

import { googleLogin, passwordRegex, regEmail } from "../../../utils/constants";
import { setUserData } from "../../../store/reducer/usersSlice";
import { setToken } from "../../../store/reducer/AuthConfig";
import { ToastMessage } from "../../../utils/ToastMessage";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import ImageFast from "../../../components/ImageFast";
import { image, Images } from "../../../assets/images";
import { TouchableOpacity } from "react-native";
import Header from "../../../components/Header";
import { ApiRequest } from "../../../Services/ApiRequest";
const height = Dimensions.get("screen").height;
const Login = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const dispatch = useDispatch();
  const init = {
    email: "",
    password: "",
  };
  const inits = {
    emailError: "",
    passwordError: "",
  };

  const [errors, setErrors] = useState(inits);
  const [state, setState] = useState(init);

  const array = [
    {
      id: 1,
      placeholder: "Username, email or phone number",
      value: state.email,
      onChange: (text) => setState({ ...state, email: text }),
      error: errors?.emailError,
      autoCapitalize: "none",
    },
    {
      id: 2,
      placeholder: "Password",
      value: state.password,
      onChange: (text) => setState({ ...state, password: text }),
      error: errors?.passwordError,
    },
  ];

  useEffect(() => {
    const keyboardShowEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyboardHideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const keyboardWillShow = Keyboard.addListener(
      keyboardShowEvent,
      (event) => {
        setIsKeyboardVisible(true);
        Animated.timing(keyboardHeight, {
          duration: event.duration || 300,
          toValue: event.endCoordinates?.height || 0,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      keyboardHideEvent,
      (event) => {
        setIsKeyboardVisible(false);
        Animated.timing(keyboardHeight, {
          duration: event.duration || 300,
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

  const handleLogin = async () => {
    const FcmToken = await AsyncStorage.getItem("fcmToken");
    // navigation.reset({
    //   index: 0,
    //   routes: [
    //     {
    //       name: "MainStack",
    //     },
    //   ],
    // });
    // return;
    setLoading(true);
    let body = {
      type: "login",
      email: state.email,
      password: state.password,
      social_token: FcmToken ? FcmToken : "",
    };
    console.log(body);
    const response = await ApiRequest(body);
    console.log(response);
    if (response?.data?.result == true) {
      setLoading(false);
      ToastMessage(response?.data?.message);
      dispatch(setUserData(response?.data?.profile[0]));
      dispatch(setToken(response?.data?.user_id));
      AsyncStorage.setItem("user_id", response?.data?.user_id);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainStack",
          },
        ],
      });
    } else {
      ToastMessage(response?.data?.message);
      setLoading(false);
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      if (!state.email) newErrors.emailError = "Please enter Email address";
      else if (!regEmail.test(state.email))
        newErrors.emailError = "Please enter valid email";
      else if (!state.password)
        newErrors.passwordError = "Please enter Password";
      setErrors(newErrors);
    };
  }, [state]);

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);

  return (
    <ScreenWrapper headerUnScrollable={() => <Header />}>
      <Animated.View>
        <View
          style={{
            flexDirection: "column",
            height: height * 0.8,
            justifyContent: "flex-end",
            paddingBottom: isKeyboardVisible ? 250 : 0,
          }}
        >
          <ImageFast
            source={image.appIcon}
            resizeMode={"contain"}
            style={{
              height: 96,
              width: 96,
              marginBottom: 80,
              alignSelf: "center",
            }}
          />
          <CustomText
            label="Welcome Back"
            fontFamily={fonts.semiBold}
            fontSize={26}
            alignSelf={"center"}
            color={COLORS.white}
          />
          <CustomText
            label="Login to your account"
            fontFamily={fonts.regular}
            alignSelf={"center"}
            fontSize={18}
            color={COLORS.gray}
            marginBottom={20}
          />
          {array.map((item) => (
            <CustomInput
              key={item?.id}
              placeholder={item.placeholder}
              value={item.value}
              onChangeText={item.onChange}
              autoCapitalize={item.autoCapitalize}
              error={item.error}
              withLabel={item.withLabel}
              secureTextEntry={item.id === 2}
            />
          ))}
          <CustomText
            label="Forgot Password?"
            fontFamily={fonts.bold}
            alignSelf="center"
            color={COLORS.primaryColor}
            fontSize={16}
            marginBottom={20}
            onPress={() => navigation.navigate("ForgetPass")}
          />
          <CustomButton
            title="Log in"
            onPress={handleLogin}
            loading={loading}
            color={COLORS.black}
            width="100%"
            alignSelf="center"
            disabled={Object.keys(errors).some((key) => errors[key] !== "")}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              marginTop: 20,
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
              onPress={() => navigation.navigate("Signup")}
              fontFamily={fonts.bold}
              color={COLORS.primaryColor}
            />
          </View>
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  headerImg: {
    width: "60%",
    height: 45,
    alignSelf: "center",
    marginVertical: 25,
    tintColor: COLORS.primaryColor,
  },

  footerText: {
    textAlign: "center",
    fontFamily: fonts.regular,
    marginBottom: 10,
    marginTop: 20,
  },
});
