import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image as ImageCompressor } from "react-native-compressor";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import storage from "@react-native-firebase/storage";
import axios from "axios";

import { ToastMessage } from "./ToastMessage";
import { endPoints } from "../Services/ENV";
import { post } from "../Services/ApiRequest";

export const regEmail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const passwordRegex =
  /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

  
  export const uploadAndGetUrl = async (file, user_id) => {
    try {
      console.log('uploadAndGetUrl - file:', file);
      console.log('uploadAndGetUrl - file.path:', file.path);
      console.log('uploadAndGetUrl - file.mime:', file.mime);
      
      // Determine if file is video or image
      const isVideo = file.mime?.startsWith('video/') || 
                     file.path?.toLowerCase().match(/\.(mp4|mov|avi|mkv|webm)$/);
      const isImage = file.mime?.startsWith('image/') || 
                     file.path?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|heic)$/);
      
      console.log('uploadAndGetUrl - isVideo:', isVideo);
      console.log('uploadAndGetUrl - isImage:', isImage);
      
      let uploadUri;
      let mimeType;
      let fileName;
      
      if (isVideo) {
        // For videos, use the original path without compression
        const originalPath = file.fileCopyUri || file.path;
        console.log('uploadAndGetUrl - original video path:', originalPath);
        
        uploadUri = Platform.OS === 'ios' 
          ? originalPath.replace('file://', '') 
          : originalPath;
        
        // Determine MIME type from file or default to mp4
        mimeType = file.mime || 'video/mp4';
        
        // Generate filename with correct extension
        const extension = file.mime?.includes('mov') ? 'mov' : 
                         file.mime?.includes('mp4') ? 'mp4' : 
                         file.filename?.split('.').pop() || 'mp4';
        fileName = `video_${new Date().toISOString().replace(/[.:-]+/g, '_')}.${extension}`;
        
        console.log('uploadAndGetUrl - video uploadUri:', uploadUri);
        console.log('uploadAndGetUrl - video mimeType:', mimeType);
        console.log('uploadAndGetUrl - video fileName:', fileName);
      } else {
        // For images, compress first
        const originalPath = file.fileCopyUri || file.path;
        console.log('uploadAndGetUrl - original image path:', originalPath);
        
        const resizeUri = await ImageCompressor.compress(originalPath);
        console.log('uploadAndGetUrl - compressed image path:', resizeUri);
        
        uploadUri = Platform.OS === 'ios' 
          ? resizeUri.replace('file://', '') 
          : resizeUri;
        
        mimeType = file.mime || 'image/jpeg';
        const extension = file.mime?.includes('png') ? 'png' : 
                         file.mime?.includes('jpg') || file.mime?.includes('jpeg') ? 'jpg' : 
                         'jpg';
        fileName = `image_${new Date().toISOString().replace(/[.:-]+/g, '_')}.${extension}`;
        
        console.log('uploadAndGetUrl - image uploadUri:', uploadUri);
        console.log('uploadAndGetUrl - image mimeType:', mimeType);
        console.log('uploadAndGetUrl - image fileName:', fileName);
      }
      
      // Validate uploadUri is not empty
      if (!uploadUri || uploadUri.trim() === '') {
        console.error('uploadAndGetUrl - uploadUri is empty!');
        throw new Error('File path is empty. Please try again.');
      }
  
      const formData = new FormData();
      formData.append('type', 'upload_data');
      formData.append('user_id', user_id);
      formData.append('file', {
        uri: uploadUri,
        name: fileName,
        type: mimeType,
      });
      
      console.log('uploadAndGetUrl - formData file object:', {
        uri: uploadUri,
        name: fileName,
        type: mimeType,
      });
  
      const response = await axios.post('http://portal.ivmsgroup.com/panache/api.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('uploadAndGetUrl - response:', response?.data);

      if (response?.data?.file_name) {
        const uploadedFileUrl = response.data.file_name; 
        ToastMessage('Upload Successfully');
        console.log('uploadAndGetUrl - uploaded file URL:', uploadedFileUrl);
        return uploadedFileUrl;
      } else {
        throw new Error(response.data.message || 'Failed to upload file');
      }
    } catch (err) {
      console.error('uploadAndGetUrl - Upload error:', err.message || err);
      console.error('uploadAndGetUrl - Error stack:', err.stack);
      ToastMessage('Upload Again');
      throw err; // Re-throw to allow caller to handle
    }
  };
  

export const getToken = async () => {
  if (Platform.OS === "android") {
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (status !== PermissionsAndroid.RESULTS.GRANTED) {
      console.error("Permission not granted for notifications");
      return;
    }
  } else if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      console.error("Permission not granted for notifications");
      return;
    }
  }
  const fcmToken = await AsyncStorage.getItem("fcmToken");
  if (!fcmToken) {
    const token = await messaging().getToken();
    await AsyncStorage.setItem("fcmToken", token);
  } else {
    return;
  }
};








export function _formatDate(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);

  if (now - date < 604800000) {
    if (now.toDateString() === date.toDateString()) {
      return "Today";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
    }
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
export function processArray(arr) {
  const groupedData = {};

  arr.forEach((item) => {
    const day = _formatDate(item.createdAt);
    if (!groupedData[day]) {
      groupedData[day] = [item];
    } else {
      groupedData[day].push(item);
    }
  });

  Object.keys(groupedData).forEach((day) => {
    const items = groupedData[day];
    const lastIndex = items.length - 1;

    items.forEach((item, index) => {
      item.day = day;
      item.show = index === lastIndex;
    });
  });

  const result = arr.map((item) => ({ ...item }));
  return result;
}
var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export const formatPrice = (number) => {
  var tier = (Math.log10(Math.abs(number)) / 3) | 0;
  if (tier == 0) return number;
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);
  var scaled = number / scale;
  var formattedNumber =
    scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(1);
  return formattedNumber + suffix;
};
export const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];

export const notificationArray = [
  {
    label: "Today",
  },
  {
    title: "New Service Request",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    time: "10:40 AM",
  },
  {
    title: "New Service Request",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    time: "10:40 AM",
  },
  {
    title: "New Service Request",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    time: "10:40 AM",
  },
  {
    label: "Yesterday",
  },
  {
    title: "New Service Request",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    time: "10:40 AM",
  },
  {
    title: "New Service Request",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    time: "10:40 AM",
  },
  {
    title: "New Service Request",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    time: "10:40 AM",
  },
];

export const googleLogin = async (data) => {
  data?.loading?.(true);
  try {
    const response = await post("auth/social-login", data.payload);
    data?.loading?.(false);
    return data?.resolve?.(response.data);
  } catch (error) {
    data?.loading?.(false);
    console.log(`googleLogin err====>`, error);
    return data?.reject?.(error);
  }
};
