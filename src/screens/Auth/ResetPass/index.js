import React, { useEffect, useMemo, useState } from "react";
import { Animated, Keyboard, View } from "react-native";

import ScreenWrapper from "../../../components/ScreenWrapper";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";
import DualText from "../../../components/DualText";

import { ToastMessage } from "../../../utils/ToastMessage";
import { passwordRegex } from "../../../utils/constants";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import { ApiRequest } from "../../../Services/ApiRequest";

const ResetPass = ({ navigation, route }) => {
  const token = route?.params?.token;

  const init = {
    password: "",
    confirmPassword: "",
  };
  const inits = {
    passwordError: "",
    confirmPasswordError: "",
  };
  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);

  const [keyboardHeight, setKeyboardHeight] = useState(new Animated.Value(0));
  const [isResetModal, setResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const array = [
    {
      id: 1,
      withLabel: "New Password",
      placeholder: "*******",
      value: state.password,
      onChange: (text) => setState({ ...state, password: text }),
      error: errors?.passwordError,
    },
    {
      id: 2,
      withLabel: "Confirm Password",
      placeholder: "*******",
      value: state.confirmPassword,
      onChange: (text) => setState({ ...state, confirmPassword: text }),
      error: errors?.confirmPasswordError,
    },
  ];

  const handleSetNewPassword = async () => {
    try {
      setLoading(true);
      const body = {
        type: "forgot_password",
        user_id: token,
        password: state.password,
      };
      
      const response = await ApiRequest(body);
      
      if (response?.data?.result) {
        navigation.navigate("SuccessPage", {
          isAccountCreated: true,
        });
      }
    } catch (error) {
      console.log(error.response.data);
      ToastMessage(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      if (!state.password) newErrors.passwordError = "Enter New Password";
      else if (!state.confirmPassword)
        newErrors.confirmPasswordError = "Please enter Password";
      else if (state.password !== state.confirmPassword)
        newErrors.confirmPasswordError = "Passwords do not match";
      setErrors(newErrors);
    };
  }, [state]);

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);
  return (
    <ScreenWrapper
      scrollEnabled
      footerUnScrollable={() => (
        <Animated.View
          style={{ marginBottom: keyboardHeight, paddingHorizontal: 20 }}
        >
          <CustomButton
            title="Reset Password"
            onPress={handleSetNewPassword}
            disabled={!Object.values(errors).every((error) => error === "")}
            loading={loading}
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
              label={"Remembered your password?"}
            />

            <CustomText
              label={"Login"}
              fontSize={14}
              onPress={() => navigation.navigate("Login")}
              fontFamily={fonts.bold}
              color={COLORS.primaryColor}
            />
          </View>
        </Animated.View>
      )}
    >
      <CustomText
        label="New Password"
        fontFamily={fonts.semiBold}
        fontSize={24}
        color={COLORS.white}
        marginTop={40}
      />
      <CustomText
        label="New Password to your account"
        fontSize={16}
        color={COLORS.white}
        marginBottom={50}
      />

      {array.map((item) => (
        <CustomInput
          key={item?.id}
          withLabel={item.withLabel}
          placeholder={item.placeholder}
          value={item.value}
          onChangeText={item.onChange}
          error={item.error}
          secureTextEntry
        />
      ))}
    </ScreenWrapper>
  );
};

export default ResetPass;
