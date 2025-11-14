import { Platform } from "react-native";

const FACE_API_CONFIG = {
  API_KEY: "wUMEkbH38iXACQKJsN8wZOAHTvtHMZgX",
  API_SECRET: "OOHILkIIpuLWKV8qZAurWirLquB0k8gG",
  BASE_URL: "https://api-us.faceplusplus.com/facepp/v3",
  CONFIDENCE_THRESHOLD: 80,
};

class FaceVerificationService {
  // Prepare image URI for upload
  prepareImageUri(imageUri) {
    // Handle remote URLs - Face++ can handle URLs directly
    if (imageUri.startsWith("http")) {
      return imageUri;
    }

    // Handle local file paths
    let uri = imageUri;
    if (Platform.OS === "ios" && !uri.startsWith("file://")) {
      uri = `file://${uri}`;
    } else if (Platform.OS === "android" && !uri.startsWith("file://")) {
      uri = `file://${uri}`;
    }

    return uri;
  }

  // Get face token from Face++ API
  async getFaceToken(imageUri) {
    try {
      const preparedUri = this.prepareImageUri(imageUri);
      const formData = new FormData();

      formData.append("api_key", FACE_API_CONFIG.API_KEY);
      formData.append("api_secret", FACE_API_CONFIG.API_SECRET);

      // Use image_file for local files, image_url for remote URLs
      if (preparedUri.startsWith("http")) {
        formData.append("image_url", preparedUri);
      } else {
        formData.append("image_file", {
          uri: preparedUri,
          type: "image/jpeg",
          name: "photo.jpg",
        });
      }

      const response = await fetch(`${FACE_API_CONFIG.BASE_URL}/detect`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      const result = JSON.parse(responseText);

      if (result.error_message) {
        throw new Error(result.error_message);
      }

      if (!result.faces || result.faces.length === 0) {
        throw new Error("No face detected in the image");
      }

      return result.faces[0].face_token;
    } catch (error) {
      console.error("Face detection error:", error);
      throw error;
    }
  }

  // Compare two face tokens with retry logic
  async compareFaceTokens(token1, token2, retryCount = 0) {
    const maxRetries = 3;
    const retryDelay = 2000;

    try {
      const formData = new FormData();
      formData.append("api_key", FACE_API_CONFIG.API_KEY);
      formData.append("api_secret", FACE_API_CONFIG.API_SECRET);
      formData.append("face_token1", token1);
      formData.append("face_token2", token2);

      const response = await fetch(`${FACE_API_CONFIG.BASE_URL}/compare`, {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorData = JSON.parse(responseText);

        // Handle concurrency limit with retry
        if (
          errorData.error_message === "CONCURRENCY_LIMIT_EXCEEDED" &&
          retryCount < maxRetries
        ) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return this.compareFaceTokens(token1, token2, retryCount + 1);
        }

        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      const result = JSON.parse(responseText);

      if (result.error_message) {
        throw new Error(result.error_message);
      }

      return result.confidence;
    } catch (error) {
      console.error("Face comparison error:", error);
      throw error;
    }
  }

  // Main verification function
  async verifyFaces(capturedImageUri, referenceImageUri) {
    try {
      // Validate input parameters
      if (!capturedImageUri || !referenceImageUri) {
        throw new Error("Both captured and reference images are required");
      }

      // Get face tokens for both images
      const capturedToken = await this.getFaceToken(capturedImageUri);
      const referenceToken = await this.getFaceToken(referenceImageUri);

      // Compare faces
      const confidence = await this.compareFaceTokens(
        capturedToken,
        referenceToken
      );

      // Validate confidence score
      if (
        typeof confidence !== "number" ||
        confidence < 0 ||
        confidence > 100
      ) {
        throw new Error("Invalid confidence score received from Face++ API");
      }

      const verified = confidence >= FACE_API_CONFIG.CONFIDENCE_THRESHOLD;

      let message = "";
      if (verified) {
        message = `✅ Identity verification completed! Confidence: ${confidence.toFixed(
          1
        )}%`;
      } else {
        message = `❌ Face verification failed. Confidence: ${confidence.toFixed(
          1
        )}% (Required: ${
          FACE_API_CONFIG.CONFIDENCE_THRESHOLD
        }%). Please try again with better lighting and ensure your face is clearly visible.`;
      }

      return {
        verified,
        confidence,
        message,
      };
    } catch (error) {
      console.error("❌ Verification failed:", error);

      let userMessage = "Verification failed. Please try again.";

      if (error.message.includes("No face detected")) {
        userMessage =
          "No face detected. Please ensure your face is clearly visible and centered in the frame.";
      } else if (error.message.includes("INVALID_IMAGE_SIZE")) {
        userMessage =
          "Image size issue. Please try taking a new photo with better quality.";
      } else if (error.message.includes("CONCURRENCY_LIMIT_EXCEEDED")) {
        userMessage =
          "Service is busy due to free tier limits. Please wait a moment and try again.";
      } else if (
        error.message.includes("INVALID_API_KEY") ||
        error.message.includes("AUTHENTICATION_FAILED")
      ) {
        userMessage = "Service configuration error. Please contact support.";
      } else if (
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        userMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message.includes("RATE_LIMIT_EXCEEDED")) {
        userMessage =
          "Too many requests. Please wait a moment before trying again.";
      }

      return {
        verified: false,
        confidence: 0,
        message: userMessage,
      };
    }
  }
}

// Export singleton instance
export const faceVerificationService = new FaceVerificationService();

// Export main function for easy use
export const verifyFaces = async (capturedImageUri, referenceImageUri) => {
  return await faceVerificationService.verifyFaces(
    capturedImageUri,
    referenceImageUri
  );
};
