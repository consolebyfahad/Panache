import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useDispatch } from "react-redux";
import { COLORS } from "../../../utils/COLORS";
import CustomText from "../../../components/CustomText";
import fonts from "../../../assets/fonts";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import Icons from "../../../components/Icons";
import CustomButton from "../../../components/CustomButton";
import { ToastMessage } from "../../../utils/ToastMessage";
import { ApiRequest } from "../../../Services/ApiRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setToken } from "../../../store/reducer/AuthConfig";
import { setUserData } from "../../../store/reducer/usersSlice";

const FaceRecog = ({ navigation, route }) => {
  const isAccountCreated = route.params?.isAccountCreated;
  const signupData = route.params?.signupData;
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1); // 1: First capture, 2: Liveness check

  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front;

  // Face++ API Configuration
  const FACE_PLUS_PLUS_API_KEY = "YOUR_API_KEY"; // Replace with your Face++ API key
  const FACE_PLUS_PLUS_API_SECRET = "YOUR_API_SECRET"; // Replace with your Face++ API secret
  const FACE_PLUS_PLUS_DETECT_URL =
    "https://api-us.faceplusplus.com/facepp/v3/detect";
  const FACE_PLUS_PLUS_COMPARE_URL =
    "https://api-us.faceplusplus.com/facepp/v3/compare";

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setHasPermission(permission === "authorized");
  };

  // Capture photo
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

      // Detect face using Face++
      await detectFace(photo.path);
    } catch (error) {
      console.error("Error capturing photo:", error);
      ToastMessage("Failed to capture photo. Please try again.");
      setIsDetecting(false);
    }
  };

  // Detect face using Face++ API
  const detectFace = async (imagePath) => {
    try {
      const formData = new FormData();
      formData.append("api_key", FACE_PLUS_PLUS_API_KEY);
      formData.append("api_secret", FACE_PLUS_PLUS_API_SECRET);
      formData.append("return_landmark", "1");
      formData.append("return_attributes", "gender,age,smiling,headpose,facequality,blur,eyestatus,emotion,ethnicity,beauty,mouthstatus,eyegaze,skinstatus");
      
      formData.append("image_file", {
        uri: `file://${imagePath}`,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      const response = await fetch(FACE_PLUS_PLUS_DETECT_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      console.log("Face++ Detection Result:", result);

      if (result.faces && result.faces.length > 0) {
        const face = result.faces[0];
        
        // Verify it's a real human face
        const isRealFace = validateFaceQuality(face);

        if (isRealFace) {
          setFaceDetected(true);
          ToastMessage("Face detected successfully!");

          if (verificationStep === 1) {
            // First capture successful, move to liveness check
            setVerificationStep(2);
            setCapturedImage(null);
            setIsDetecting(false);
            ToastMessage("Please smile for liveness verification");
          } else {
            // Liveness check passed
            await handleVerification(imagePath, face);
          }
        } else {
          setFaceDetected(false);
          setCapturedImage(null);
          setIsDetecting(false);
          ToastMessage("Face quality check failed. Please try again in good lighting.");
        }
      } else {
        setFaceDetected(false);
        setCapturedImage(null);
        setIsDetecting(false);
        ToastMessage("No face detected. Please position your face in the frame.");
      }
    } catch (error) {
      console.error("Face detection error:", error);
      setIsDetecting(false);
      ToastMessage("Face detection failed. Please try again.");
    }
  };

  // Validate face quality and check if it's a real person
  const validateFaceQuality = (face) => {
    const attributes = face.attributes;

    // Check face quality
    const faceQuality = attributes?.facequality?.value || 0;
    if (faceQuality < 70) {
      console.log("Low face quality:", faceQuality);
      return false;
    }

    // Check blur
    const blurGaussian = attributes?.blur?.gaussianblur?.value || 100;
    if (blurGaussian > 50) {
      console.log("Image too blurry:", blurGaussian);
      return false;
    }

    // Check if eyes are open (anti-spoofing)
    const leftEyeStatus = attributes?.eyestatus?.left_eye_status?.normal_glass_eye_open || 0;
    const rightEyeStatus = attributes?.eyestatus?.right_eye_status?.normal_glass_eye_open || 0;
    
    if (leftEyeStatus < 50 || rightEyeStatus < 50) {
      console.log("Eyes not properly detected");
      return false;
    }

    // For liveness check (step 2), verify smiling
    if (verificationStep === 2) {
      const smilingThreshold = attributes?.smile?.value || 0;
      if (smilingThreshold < 50) {
        ToastMessage("Please smile for verification");
        return false;
      }
    }

    // Check head pose (should be facing forward)
    const headPose = attributes?.headpose;
    const yawAngle = Math.abs(headPose?.yaw_angle || 0);
    const pitchAngle = Math.abs(headPose?.pitch_angle || 0);

    if (yawAngle > 20 || pitchAngle > 20) {
      console.log("Face not facing forward");
      ToastMessage("Please face the camera directly");
      return false;
    }

    return true;
  };

  // Handle final verification and account creation
  const handleVerification = async (imagePath, faceData) => {
    setLoading(true);

    try {
      // Upload face image to your server
      const faceImageUrl = await uploadFaceImage(imagePath);

      // Verify with backend
      const body = {
        type: "verify_face",
        user_id: signupData?.user_id,
        face_token: faceData.face_token,
        face_image: faceImageUrl,
        face_data: JSON.stringify(faceData),
      };

      const response = await ApiRequest(body);

      if (response?.data?.result) {
        ToastMessage("Face verification successful!");
        setLoading(false);
        
        // Navigate to success page
        navigation.navigate("SuccessPage", {
          isAccountCreated: isAccountCreated,
        });
      } else {
        ToastMessage(response?.data?.message || "Verification failed");
        setLoading(false);
        resetVerification();
      }
    } catch (error) {
      console.error("Verification error:", error);
      ToastMessage("Verification failed. Please try again.");
      setLoading(false);
      resetVerification();
    }
  };

  // Upload face image to server
  const uploadFaceImage = async (imagePath) => {
    try {
      const formData = new FormData();
      formData.append("type", "upload_face");
      formData.append("user_id", signupData?.user_id);
      formData.append("face_image", {
        uri: `file://${imagePath}`,
        type: "image/jpeg",
        name: "face.jpg",
      });

      const response = await fetch("YOUR_BACKEND_URL/upload.php", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      return result.image_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const resetVerification = () => {
    setCapturedImage(null);
    setFaceDetected(false);
    setIsDetecting(false);
    setVerificationStep(1);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setFaceDetected(false);
    setIsDetecting(false);
  };

  if (!hasPermission) {
    return (
      <ScreenWrapper headerUnScrollable={() => <Header />}>
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
        {!capturedImage ? (
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
                  label={
                    verificationStep === 1
                      ? "Position your face in the frame"
                      : "Now smile for liveness check"
                  }
                  fontSize={16}
                  color={COLORS.white}
                  fontFamily={fonts.medium}
                  textAlign="center"
                  marginBottom={20}
                />

                <View style={styles.instructionsContainer}>
                  <CustomText
                    label={`Step ${verificationStep} of 2`}
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
        ) : (
          <View style={styles.previewContainer}>
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primaryColor} />
              <CustomText
                label="Analyzing face..."
                fontSize={16}
                color={COLORS.white}
                fontFamily={fonts.medium}
                marginTop={20}
              />
            </View>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default FaceRecog;

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
});