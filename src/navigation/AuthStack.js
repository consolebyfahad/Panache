import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import React from "react";

//screens
import ForgetPass from "../screens/Auth/ForgetPass";
import ResetPass from "../screens/Auth/ResetPass";
import OTPScreen from "../screens/Auth/OTPScreen";
import Signup from "../screens/Auth/Signup";
import Login from "../screens/Auth/Login";
import getStarted from "../screens/Auth/GetStarted";
import SuccessPage from "../screens/Auth/SuccessPage";
import FaceRecog from "../screens/Auth/FaceRecog";
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      // initialRouteName="ChoseLocation"
    >
      <Stack.Screen name="getStarted" component={getStarted} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="FaceRecog" component={FaceRecog} />
      <Stack.Screen name="ForgetPass" component={ForgetPass} />
      <Stack.Screen name="ResetPass" component={ResetPass} />
      <Stack.Screen name="SuccessPage" component={SuccessPage} />
    </Stack.Navigator>
  );
};

export default AuthStack;
