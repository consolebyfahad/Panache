import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useIsFocused } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import ImageFast from "./ImageFast";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../utils/COLORS";

const { width, height } = Dimensions.get("window");

const FocusAwareStatusBar = (props) => {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
};

const ScreenWrapper = ({
  children,
  statusBarColor,
  translucent = false,
  scrollEnabled = false,
  backgroundImage,
  backgroundColor,
  headerUnScrollable = () => null,
  footerUnScrollable = () => null,
  refreshControl,
  paddingBottom,
  nestedScrollEnabled,
  paddingHorizontal,
}) => {
  const isToken = useSelector((state) => state.authConfig.token);
  const padd = 20;
  const barStyle = "light-content";

  const content = () => {
    return (
      <View
        style={[
          styles.container,
          {
            paddingBottom: paddingBottom
              ? paddingBottom
              : Platform.OS === "android"
              ? 0
              : 20,
            backgroundColor: backgroundImage
              ? "transparent"
              : backgroundColor || COLORS.bg,
          },
        ]}
      >
        <FocusAwareStatusBar
          barStyle={barStyle}
          backgroundColor={statusBarColor || COLORS.bg}
          translucent={translucent}
        />
        {!translucent && (
          <SafeAreaView
            style={{ backgroundColor: backgroundColor || COLORS.bg }}
          />
        )}
        {headerUnScrollable()}
        {scrollEnabled ? (
          <KeyboardAwareScrollView
            nestedScrollEnabled={nestedScrollEnabled}
            refreshControl={refreshControl}
            style={[
              styles.container,
              {
                backgroundColor: backgroundColor || COLORS.bg,
                paddingHorizontal: paddingHorizontal || padd,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </KeyboardAwareScrollView>
        ) : (
          <View
            style={{ paddingHorizontal: paddingHorizontal || padd, flex: 1 }}
          >
            {children}
          </View>
        )}
        {footerUnScrollable()}
      </View>
    );
  };

  return backgroundImage ? (
    <View style={{ width, height: height + 70, zIndex: 999 }}>
      {content()}
      <ImageFast
        source={backgroundImage}
        style={{
          width,
          height: height + 70,
          position: "absolute",
          zIndex: -1,
        }}
        resizeMode="cover"
      />
    </View>
  ) : (
    content()
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
