import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { useSelector } from "react-redux";
import TabStack from "./TabStack";
import Home from "../screens/Main/Home/Home";
import Profile from "../screens/Main/Profile";
import Date from "../screens/Main/Dating";
import DatingProfile from "../screens/Main/Dating/DatingProfile";
import MyCalendar from "../screens/Main/Calender";
import Settings from "../screens/Main/Settings/Index";
import Notifications from "../screens/Main/Notifications";
import TagScan from "../screens/Main/MyTag";
import EditProfile from "../screens/Main/Profile/EditProfile";
import Request from "../screens/Main/DateRequest";
import PersonalDetails from "../screens/Main/Profile/PersonalDetails";
import FaceVerification from "../screens/Main/Profile/FaceVerification";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
      // initialRouteName="ServiceDetail"
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Date" component={Date} />
      <Stack.Screen name="DatingProfile" component={DatingProfile} />
      <Stack.Screen name="MyCalendar" component={MyCalendar} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="TagScan" component={TagScan} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Request" component={Request} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="FaceVerification" component={FaceVerification} />
    </Stack.Navigator>
  );
};

export default MainStack;
