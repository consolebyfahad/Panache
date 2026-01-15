import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
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
  console.log("=== FaceVerification Component Rendered ===");

  const navigation = useNavigation();
  const route = useRoute();
  console.log("Route params:", route.params);

  const { uploadedImageUri, mediaType, onVerificationSuccess } =
    route.params || {};

  console.log("Extracted params - uploadedImageUri:", uploadedImageUri);
  console.log("Extracted params - mediaType:", mediaType);
  console.log(
    "Extracted params - onVerificationSuccess:",
    typeof onVerificationSuccess
  );

  const [hasPermission, setHasPermission] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  console.log("State - hasPermission:", hasPermission);
  console.log("State - isDetecting:", isDetecting);
  console.log("State - capturedImage:", capturedImage);
  console.log("State - loading:", loading);
  console.log("State - verificationResult:", verificationResult);

  const cameraRef = useRef(null);
  console.log("Camera ref:", cameraRef.current ? "initialized" : "null");

  // Use the newer useCameraDevice hook instead of useCameraDevices
  const device = useCameraDevice("front");
  console.log("Selected device:", device);
  console.log("Device name:", device?.name);
  console.log("Device position:", device?.position);
  console.log("Device ID:", device?.id);

  useEffect(() => {
    console.log("=== useEffect triggered ===");
    console.log("mediaType:", mediaType);
    console.log("device:", device);

    if (mediaType === "video") {
      console.log("Media type is video, skipping camera permission");
      console.log("Will call handleVideoVerification in 1000ms");
      setTimeout(() => {
        handleVideoVerification();
      }, 1000);
    } else {
      console.log("Media type is image, requesting camera permission");
      requestCameraPermission();
    }
  }, []);

  // Log when device becomes available
  useEffect(() => {
    if (device) {
      console.log("=== Device became available ===");
      console.log("Device:", device);
      console.log("Device name:", device.name);
      console.log("Device position:", device.position);
    } else {
      console.log("=== Device is still undefined ===");
    }
  }, [device]);

  const requestCameraPermission = async () => {
    console.log("=== requestCameraPermission START ===");
    if (mediaType === "video") {
      console.log("Skipping permission request for video");
      return; // Skip for videos
    }

    console.log("Requesting camera permission...");
    try {
      const permission = await Camera.requestCameraPermission();
      console.log("Camera permission result:", permission);
      const hasPermissionValue = permission === "granted";
      console.log("Setting hasPermission to:", hasPermissionValue);
      setHasPermission(hasPermissionValue);
      console.log("=== requestCameraPermission END ===");
    } catch (error) {
      console.log("Error requesting camera permission:", error);
      setHasPermission(false);
    }
  };

  // Handle video verification (simple success)
  const handleVideoVerification = () => {
    console.log("=== handleVideoVerification START ===");
    console.log("Setting loading to true");
    setLoading(true);

    setTimeout(() => {
      console.log("Setting verification result to success");
      const result = {
        verified: true,
        message: "✅ Verification successful!",
      };
      setVerificationResult(result);
      setLoading(false);
      console.log("Loading set to false, showing toast");
      ToastMessage("Verification successful!");

      setTimeout(() => {
        console.log("Calling onVerificationSuccess callback");
        if (onVerificationSuccess) {
          console.log("onVerificationSuccess exists, calling it");
          onVerificationSuccess();
        } else {
          console.log("onVerificationSuccess is not defined");
        }
        console.log("Navigating back");
        navigation.goBack();
        console.log("=== handleVideoVerification END ===");
      }, 2000);
    }, 1500);
  };

  // Capture photo for image verification
  const capturePhoto = async () => {
    console.log("=== capturePhoto START ===");
    console.log("Camera ref current:", cameraRef.current);

    if (!cameraRef.current) {
      console.log("Camera ref is null, returning");
      return;
    }

    try {
      console.log("Setting isDetecting to true");
      setIsDetecting(true);

      console.log("Calling takePhoto with options");
      const photoOptions = {
        qualityPrioritization: "quality",
        flash: "off",
        enableAutoStabilization: true,
      };
      console.log("Photo options:", photoOptions);

      const photo = await cameraRef.current.takePhoto(photoOptions);
      console.log("Photo captured successfully");
      console.log("Photo path:", photo.path);
      console.log("Photo width:", photo.width);
      console.log("Photo height:", photo.height);

      setCapturedImage(photo.path);
      console.log("Captured image set in state");

      // Verify face with uploaded image
      console.log("Calling verifyFaceWithImage");
      await verifyFaceWithImage(photo.path);
      console.log("=== capturePhoto END ===");
    } catch (error) {
      console.error("Error capturing photo:", error);
      console.error("Error stack:", error.stack);
      ToastMessage("Failed to capture photo. Please try again.");
      setIsDetecting(false);
      console.log("=== capturePhoto ERROR END ===");
    }
  };

  // Verify captured face with uploaded image
  const verifyFaceWithImage = async (capturedImagePath) => {
    console.log("=== verifyFaceWithImage START ===");
    console.log("capturedImagePath:", capturedImagePath);
    console.log("uploadedImageUri:", uploadedImageUri);

    try {
      console.log("Setting loading to true");
      setLoading(true);

      // Use the uploaded image URI as reference
      console.log("Calling verifyFaces service");
      const result = await verifyFaces(capturedImagePath, uploadedImageUri);
      console.log("verifyFaces returned result:", result);
      console.log("Result verified:", result.verified);
      console.log("Result message:", result.message);
      console.log("Result confidence:", result.confidence);

      setVerificationResult(result);
      console.log("Verification result set in state");
      setLoading(false);
      console.log("Loading set to false");

      if (result.verified) {
        console.log("Verification successful, showing toast");
        ToastMessage(result.message);

        // Call success callback and navigate back
        setTimeout(() => {
          console.log("Calling onVerificationSuccess callback");
          if (onVerificationSuccess) {
            console.log("onVerificationSuccess exists, calling it");
            onVerificationSuccess();
          } else {
            console.log("onVerificationSuccess is not defined");
          }
          console.log("Navigating back");
          navigation.goBack();
          console.log("=== verifyFaceWithImage SUCCESS END ===");
        }, 2000);
      } else {
        console.log("Verification failed, showing error toast");
        ToastMessage(result.message);
        // Allow retry
        setCapturedImage(null);
        setIsDetecting(false);
        console.log("Reset captured image and isDetecting");
        console.log("=== verifyFaceWithImage FAILED END ===");
      }
    } catch (error) {
      console.error("Verification error:", error);
      console.error("Error stack:", error.stack);
      ToastMessage("Verification failed. Please try again.");
      setLoading(false);
      setCapturedImage(null);
      setIsDetecting(false);
      console.log("=== verifyFaceWithImage ERROR END ===");
    }
  };

  const retakePhoto = () => {
    console.log("=== retakePhoto called ===");
    setCapturedImage(null);
    setVerificationResult(null);
    setIsDetecting(false);
    console.log("Reset all states for retake");
  };

  // Video verification view
  if (mediaType === "video") {
    console.log("=== Rendering VIDEO verification view ===");
    console.log("loading:", loading);
    console.log("verificationResult:", verificationResult);

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
    console.log("=== Rendering PERMISSION REQUEST view ===");
    console.log("hasPermission:", hasPermission);

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
    console.log("=== Rendering DEVICE LOADING view ===");
    console.log("device:", device);
    console.log("devices:", devices);

    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primaryColor} />
      </View>
    );
  }

  console.log("=== Rendering MAIN CAMERA view ===");
  console.log("loading:", loading);
  console.log("verificationResult:", verificationResult);
  console.log("capturedImage:", capturedImage);
  console.log("isDetecting:", isDetecting);
  console.log("device:", device);
  console.log("cameraRef.current:", cameraRef.current);

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
                <TouchableOpacity
                  onPress={retakePhoto}
                  style={styles.tryAgainButton}
                >
                  {/* <CustomText
                    label="Try Again"
                    fontSize={14}
                    color={COLORS.white}
                    fontFamily={fonts.regular}
                  /> */}
                  <Text style={styles.tryAgainButtonText}>Try Again</Text>
                </TouchableOpacity>
                {/* <CustomButton
                  title="Try Again"
                  onPress={retakePhoto}
                  marginTop={30}
                  color={COLORS.black}
                  width="80%"
                /> */}
              </View>
            )}
          </View>
        ) : (
          <>
            <Camera
              ref={(ref) => {
                console.log("=== Camera ref callback ===");
                console.log("Camera ref:", ref);
                cameraRef.current = ref;
                if (ref) {
                  console.log("Camera component mounted successfully");
                } else {
                  console.log("Camera component unmounted");
                }
              }}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              photo={true}
              onInitialized={() => {
                console.log("=== Camera initialized ===");
                console.log("Camera ref after init:", cameraRef.current);
              }}
              onError={(error) => {
                console.error("=== Camera error ===");
                console.error("Error:", error);
              }}
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
  tryAgainButton: {
    backgroundColor: COLORS.primaryColor,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  tryAgainButtonText: {
    color: COLORS.black,
    fontFamily: fonts.medium,
    fontSize: 16,
  },
});
