import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenWrapper from "../../../components/ScreenWrapper";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";
import CustomButton from "../../../components/CustomButton";
import { COLORS } from "../../../utils/COLORS";
import FastImage from "react-native-fast-image";
import { ApiRequest } from "../../../Services/ApiRequest";
import { ToastMessage } from "../../../utils/ToastMessage";

const { width, height } = Dimensions.get("window");

const TagScan = ({ navigation }) => {
  const isfocused = useIsFocused();
  const [latestScannedData, setLatestScannedData] = useState(null);
  const [loading, setLoading] = useState(false); // changed
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const camera = useRef(null);
  const navigate = useNavigation();
  const [isInitialized, setIsInitialized] = useState(false);
  console.log("hasPermission", isInitialized);
  


  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: (codes) => {
      console.log(codes);
      ComfirmBarCode(codes[0].value);
      setLatestScannedData(codes[0].value);
    },
  });

  useEffect(() => {
    const checkPermission = async () => {
      await requestPermission();
    };
    checkPermission();

    return () => {}; // Cleanup if necessary
  }, []);

  const ComfirmBarCode = async (val) => {
    if (latestScannedData) return; // Check if already scanned
    const body = {
      type: "profile",
      user_id: val,
    };

    setLoading(true);
    try {
      const res = await ApiRequest(body);
      if (res?.data?.result) {
        console.log(res?.data?.profile);
        navigate.navigate("DatingProfile", { data: res?.data?.profile });
      } else {
        ToastMessage("Profile is not valid!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Checking camera permission...</Text>;
  } else if (!hasPermission) {
    return <Text>Camera permission not granted</Text>;
  }

  if (!device) {
    return <Text>No camera device available</Text>;
  }

  return (
    <ScreenWrapper
      translucent
      statusBarColor={"transparent"}
      paddingHorizontal={0.1}
      headerUnScrollable={() => (
        <View style={styles.header}>
          <Header title={"Scan QR Code"} isScan={true} />
        </View>
      )}
      footerUnScrollable={() => (
        <>
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 20,
              position: "absolute",
              bottom: 20,
              width: "100%",
            }}
          >
            <CustomButton
              onPress={() => navigation.goBack()}
              title={"Cancel"}
              color={COLORS.white}
              backgroundColor={"#323232"}
            />
          </View>
        </>
      )}
    >
      {loading && (
        <View
          style={{
            width,
            height,
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primaryColor} />
        </View>
      )}

      <Camera
        // style={styles.camera}
        codeScanner={codeScanner}
        onInitialized={() => setIsInitialized(true)}
        style={isInitialized ? {flex:1} : {flex : 0}}
        device={device}
        ref={camera}
        isActive={true}
      />

      <View style={styles.scanBoxContainer}>
        <ImageFast source={image.scanBox} style={styles.scanBox} />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({

  camera: {
    width: width,
    height: height,
    aspectRatio: 9 / 16, // Adjust based on your device's aspect ratio
  },
  header: {
    position: "absolute",
    zIndex: 999,
    width: "100%",
    marginTop: 20,
  },
  scanBoxContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  scanBox: {
    width: 264,
    height: 264,
  },
});

export default TagScan;
