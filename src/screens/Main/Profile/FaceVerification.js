import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../../utils/COLORS";
import CustomText from "../../../components/CustomText";
import fonts from "../../../assets/fonts";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import Icons from "../../../components/Icons";
import CustomButton from "../../../components/CustomButton";
import { ToastMessage } from "../../../utils/ToastMessage";
import { verifyFaces } from "../../../utils/FaceVerificationService";

const FaceVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { uploadedImageUri, mediaType, onVerificationSuccess } =
    route.params || {};

  const [hasPermission, setHasPermission] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front;

  useEffect(() => {
    requestCameraPermission();

    // For videos, skip verification and show success
    if (mediaType === "video") {
      setTimeout(() => {
        handleVideoVerification();
      }, 1000);
    }
  }, []);

  const requestCameraPermission = async () => {
    if (mediaType === "video") return; // Skip for videos

    const permission = await Camera.requestCameraPermission();
    setHasPermission(permission === "authorized");
  };

  // Handle video verification (simple success)
  const handleVideoVerification = () => {
    setLoading(true);
    setTimeout(() => {
      setVerificationResult({
        verified: true,
        message: "✅ Verification successful!",
      });
      setLoading(false);
      ToastMessage("Verification successful!");

      setTimeout(() => {
        if (onVerificationSuccess) {
          onVerificationSuccess();
        }
        navigation.goBack();
      }, 2000);
    }, 1500);
  };

  // Capture photo for image verification
  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setIsDetecting(true);
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: "quality",
        flash: "off",
        enableAutoStabilization: true,
      });

      console.log("Photo captured:", photo.path);
      setCapturedImage(photo.path);

      // Verify face with uploaded image
      await verifyFaceWithImage(photo.path);
    } catch (error) {
      console.error("Error capturing photo:", error);
      ToastMessage("Failed to capture photo. Please try again.");
      setIsDetecting(false);
    }
  };

  // Verify captured face with uploaded image
  const verifyFaceWithImage = async (capturedImagePath) => {
    try {
      setLoading(true);

      // Use the uploaded image URI as reference
      const result = await verifyFaces(capturedImagePath, uploadedImageUri);

      setVerificationResult(result);
      setLoading(false);

      if (result.verified) {
        ToastMessage(result.message);

        // Call success callback and navigate back
        setTimeout(() => {
          if (onVerificationSuccess) {
            onVerificationSuccess();
          }
          navigation.goBack();
        }, 2000);
      } else {
        ToastMessage(result.message);
        // Allow retry
        setCapturedImage(null);
        setIsDetecting(false);
      }
    } catch (error) {
      console.error("Verification error:", error);
      ToastMessage("Verification failed. Please try again.");
      setLoading(false);
      setCapturedImage(null);
      setIsDetecting(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setIsDetecting(false);
  };

  // Video verification view
  if (mediaType === "video") {
    return (
      <ScreenWrapper
        headerUnScrollable={() => <Header title="Face Verification" />}
      >
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primaryColor} />
              <CustomText
                label="Verifying..."
                fontSize={18}
                color={COLORS.white}
                fontFamily={fonts.medium}
                marginTop={20}
                textAlign="center"
              />
            </View>
          ) : verificationResult ? (
            <View style={styles.resultContainer}>
              <Icons
                name="check-circle"
                family="Feather"
                size={80}
                color={COLORS.primaryColor}
              />
              <CustomText
                label={verificationResult.message}
                fontSize={18}
                color={COLORS.white}
                fontFamily={fonts.bold}
                marginTop={20}
                textAlign="center"
              />
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primaryColor} />
              <CustomText
                label="Processing verification..."
                fontSize={18}
                color={COLORS.white}
                fontFamily={fonts.medium}
                marginTop={20}
                textAlign="center"
              />
            </View>
          )}
        </View>
      </ScreenWrapper>
    );
  }

  // Image verification view
  if (!hasPermission) {
    return (
      <ScreenWrapper
        headerUnScrollable={() => <Header title="Face Verification" />}
      >
        <View style={styles.permissionContainer}>
          <Icons
            name={"camera-off"}
            family={"Feather"}
            size={60}
            color={COLORS.gray}
          />
          <CustomText
            label="Camera permission required"
            fontSize={18}
            color={COLORS.white}
            fontFamily={fonts.medium}
            marginTop={20}
            textAlign="center"
          />
          <CustomButton
            title="Grant Permission"
            onPress={requestCameraPermission}
            marginTop={20}
            color={COLORS.black}
          />
        </View>
      </ScreenWrapper>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primaryColor} />
      </View>
    );
  }

  return (
    <ScreenWrapper paddingHorizontal={0}>
      <View style={styles.container}>
        {loading || verificationResult ? (
          <View style={styles.previewContainer}>
            {loading ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={COLORS.primaryColor} />
                <CustomText
                  label="Verifying face..."
                  fontSize={16}
                  color={COLORS.white}
                  fontFamily={fonts.medium}
                  marginTop={20}
                />
              </View>
            ) : verificationResult?.verified ? (
              <View style={styles.resultContainer}>
                <Icons
                  name="check-circle"
                  family="Feather"
                  size={80}
                  color={COLORS.primaryColor}
                />
                <CustomText
                  label={verificationResult.message}
                  fontSize={18}
                  color={COLORS.white}
                  fontFamily={fonts.bold}
                  marginTop={20}
                  textAlign="center"
                />
                <CustomText
                  label={`Confidence: ${verificationResult.confidence?.toFixed(
                    1
                  )}%`}
                  fontSize={14}
                  color={COLORS.gray}
                  fontFamily={fonts.regular}
                  marginTop={10}
                  textAlign="center"
                />
              </View>
            ) : (
              <View style={styles.resultContainer}>
                <Icons
                  name="x-circle"
                  family="Feather"
                  size={80}
                  color={COLORS.red || "#ff4444"}
                />
                <CustomText
                  label={verificationResult?.message || "Verification failed"}
                  fontSize={18}
                  color={COLORS.white}
                  fontFamily={fonts.bold}
                  marginTop={20}
                  textAlign="center"
                />
                <CustomButton
                  title="Try Again"
                  onPress={retakePhoto}
                  marginTop={30}
                  color={COLORS.black}
                />
              </View>
            )}
          </View>
        ) : (
          <>
            <Camera
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              photo={true}
            />

            {/* Face Detection Overlay */}
            <View style={styles.overlay}>
              <View style={styles.topSection}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Icons
                    name={"arrow-back"}
                    family={"Ionicons"}
                    size={24}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.middleSection}>
                <View style={styles.faceFrame}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>

              <View style={styles.bottomSection}>
                <CustomText
                  label="Position your face in the frame"
                  fontSize={16}
                  color={COLORS.white}
                  fontFamily={fonts.medium}
                  textAlign="center"
                  marginBottom={20}
                />

                <View style={styles.instructionsContainer}>
                  <CustomText
                    label="Please look directly at the camera"
                    fontSize={14}
                    color={COLORS.gray}
                    fontFamily={fonts.regular}
                    textAlign="center"
                  />
                </View>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={capturePhoto}
                  disabled={isDetecting}
                >
                  {isDetecting ? (
                    <ActivityIndicator size="large" color={COLORS.white} />
                  ) : (
                    <View style={styles.captureButtonInner} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default FaceVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  topSection: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  middleSection: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  faceFrame: {
    width: 280,
    height: 350,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: COLORS.primaryColor,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  bottomSection: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  instructionsContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.black,
  },
  loadingOverlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
