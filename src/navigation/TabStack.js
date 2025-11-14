import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Platform, Image, View } from "react-native";
import React from "react";

import Icons from "../components/Icons";

// screens

// import Profile from "../screens/Main/Profile";
// import Offers from "../screens/Main/Offers";
// import Home from "../screens/Main/Home";

// import { tabIcons } from "../assets/images/tabIcons";
// import { Images } from "../assets/images";
import { COLORS } from "../utils/COLORS";
// import i18n from "../Language/i18n";
import fonts from "../assets/fonts";

// import AddEvent from "../screens/Main/CreatEvent/Index";
// import QrTicketScan from "../screens/Main/QrScan";

const Tab = createBottomTabNavigator();
const TabStack = () => {
  return (
    <></>
    // <Tab.Navigator
    //   screenOptions={() => ({
    //     tabBarLabelStyle: {
    //       fontSize: 12,
    //       fontFamily: fonts.regular,
    //     },
    //     tabBarStyle: {
    //       height: Platform.OS == "android" ? 70 : 80,
    //       backgroundColor: colors.bg,
    //       borderColor: colors.bg,
    //       elevation: 10,
    //       borderTopLeftRadius: 20,
    //       borderTopRightRadius: 20,
    //       paddingBottom: Platform.OS == "android" ? 12 : 22,
    //       position: "absolute",
    //     },
    //     tabBarShowLabel: true,
    //     tabBarHideOnKeyboard: true,
    //     tabBarActiveTintColor: COLORS.primaryColor,
    //     headerShown: false,
    //   })}
    // >
    //   <Tab.Screen
    //     options={{
    //       tabBarIcon: ({ focused }) => (
    //         <Image
    //           source={tabIcons.home}
    //           style={[
    //             styles.icon,
    //             { tintColor: focused ? COLORS.primaryColor : COLORS.tabIcon },
    //           ]}
    //         />
    //       ),
    //     }}
    //     name={i18n.t("Home")}
    //     component={Home}
    //   />

    //   <Tab.Screen
    //     options={{
    //       tabBarIcon: ({ focused }) => (
    //         <Image
    //           source={tabIcons.orders}
    //           style={[
    //             styles.icon,
    //             { tintColor: focused ? COLORS.primaryColor : COLORS.tabIcon },
    //           ]}
    //         />
    //       ),
    //     }}
    //     name={i18n.t("My events")}
    //     component={Offers}
    //   />

    //   <Tab.Screen
    //     options={{
    //       tabBarLabelStyle: { color: COLORS.white },
    //       tabBarIcon: ({ focused }) => (
    //         <View style={styles.addIconContainer}>
    //           <Icons
    //             family="Feather"
    //             name="plus"
    //             color={COLORS.white}
    //             size={36}
    //           />
    //         </View>
    //       ),
    //     }}
    //     listeners={({ navigation }) => ({
    //       tabPress: (e) => {
    //         e.preventDefault();
    //         navigation.push("AddEvent");
    //       },
    //     })}
    //     name={i18n.t("CreateJob")}
    //     component={AddEvent}
    //   />

    //   <Tab.Screen
    //     options={{
    //       tabBarIcon: ({ focused }) => (
    //         <Image
    //           source={tabIcons.scan}
    //           style={[
    //             styles.icon,
    //             { tintColor: focused ? COLORS.primaryColor : COLORS.tabIcon },
    //           ]}
    //         />
    //       ),
    //     }}
    //     name={i18n.t("Ticket Scan")}
    //     component={QrTicketScan}
    //   />

    //   <Tab.Screen
    //     options={{
    //       tabBarIcon: ({ focused }) => (
    //         <Image
    //           source={Images.profile}
    //           style={[
    //             styles.icon,
    //             { tintColor: focused ? COLORS.primaryColor : COLORS.tabIcon },
    //           ]}
    //         />
    //       ),
    //     }}
    //     name={i18n.t("Profile")}
    //     component={Profile}
    //   />
    // </Tab.Navigator>
  );
};

export default TabStack;

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginBottom: -8,
  },
  homeIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: COLORS.white,
  },
  text: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
    bottom: 12,
  },
  addIconContainer: {
    height: 55,
    width: 55,
    borderRadius: 100,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -22,
  },
});
