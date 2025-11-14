import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { openCamera, openPicker } from "react-native-image-crop-picker";

import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import DatePicker from "react-native-date-picker";
import { useDispatch, useSelector } from "react-redux";
import fonts from "../../../assets/fonts";
import { image } from "../../../assets/images";
import CheckBox from "../../../components/CheckBox";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomModal from "../../../components/CustomModal";
import CustomText from "../../../components/CustomText";
import Header from "../../../components/Header";
import Icons from "../../../components/Icons";
import ImageFast from "../../../components/ImageFast";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { ApiRequest } from "../../../Services/ApiRequest";
import { setUserData } from "../../../store/reducer/usersSlice";
import { COLORS } from "../../../utils/COLORS";
import { uploadAndGetUrl } from "../../../utils/constants";
import { ToastMessage } from "../../../utils/ToastMessage";
import Video from "react-native-video";

const width = Dimensions.get("screen").width;

const EditProfile = () => {
  const { userData } = useSelector((state) => state.users);
  const isToken = useSelector((state) => state.authConfig.token);
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [SelectedSign, setSelectedSign] = useState("");
  const [isVisible, setisVisible] = useState(false);
  const [selectedNames, setSelectedNames] = useState([]);
  const [Bio, setBio] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const data = [
    { name: "male", id: 1, isChecked: false },
    { name: "female", id: 2, isChecked: false },
    { name: "other", id: 3, isChecked: false },
  ];

  useEffect(() => {
    if (userData?.gender_interest) {
      const parsedInterests = JSON.parse(userData.gender_interest);
      const validNames = parsedInterests.filter((interest) =>
        data.some((item) => item.name === interest)
      );
      setSelectedNames(validNames);
      setSelectedIds(
        data
          .filter((item) => validNames.includes(item.name))
          .map((item) => item.id)
      );
    }
  }, [userData]);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Support both images and videos
  const [viewVideos, setViewVideos] = useState({
    view1: [],
    view2: [],
    view3: [],
    view4: [],
    view5: [],
    view6: [],
  });

  const zodiacSigns = [
    { name: "Aries", sign: "♈" },
    { name: "Taurus", sign: "♉" },
    { name: "Gemini", sign: "♊" },
    { name: "Cancer", sign: "♋" },
    { name: "Leo", sign: "♌" },
    { name: "Virgo", sign: "♍" },
    { name: "Libra", sign: "♎" },
    { name: "Scorpio", sign: "♏" },
    { name: "Sagittarius", sign: "♐" },
    { name: "Capricorn", sign: "♑" },
    { name: "Aquarius", sign: "♒" },
    { name: "Pisces", sign: "♓" },
  ];

  useEffect(() => {
    if (userData?.user_gallery && userData?.user_gallery.length > 0) {
      let fixedData = [];

      if (userData?.user_gallery) {
        try {
          fixedData = JSON.parse(userData.user_gallery);
          // Determine if URL is image or video based on extension or path
          const getMediaType = (url) => {
            if (!url) return "video"; // default
            const lowerUrl = url.toLowerCase();
            if (lowerUrl.includes("/videos/")) return "video";
            if (
              lowerUrl.includes("/images/") ||
              lowerUrl.match(/\.(jpg|jpeg|png|gif|webp)$/)
            )
              return "image";
            return "video"; // default fallback
          };

          setViewVideos({
            view1: fixedData[0]
              ? [{ url: fixedData[0], type: getMediaType(fixedData[0]) }]
              : [],
            view2: fixedData[1]
              ? [{ url: fixedData[1], type: getMediaType(fixedData[1]) }]
              : [],
            view3: fixedData[2]
              ? [{ url: fixedData[2], type: getMediaType(fixedData[2]) }]
              : [],
            view4: fixedData[3]
              ? [{ url: fixedData[3], type: getMediaType(fixedData[3]) }]
              : [],
            view5: fixedData[4]
              ? [{ url: fixedData[4], type: getMediaType(fixedData[4]) }]
              : [],
            view6: fixedData[5]
              ? [{ url: fixedData[5], type: getMediaType(fixedData[5]) }]
              : [],
          });
        } catch (error) {
          console.error("Error parsing user gallery:", error);
          fixedData = [];
        }
      } else {
        console.warn("user_gallery data is not available");
      }
    }
  }, [userData?.user_gallery]);

  const [currentView, setCurrentView] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoModal, setVideoModal] = useState(false);

  const openVideoPickerModal = (view) => {
    setCurrentView(view);
    setVideoModal(true);
  };

  // Image functions
  const recordImageFromCamera = () => {
    try {
      const options = {
        mediaType: "photo",
        quality: 0.8,
        cropping: true,
        includeBase64: false,
      };
      setVideoModal(false);
      setTimeout(async () => {
        const result = await openCamera(options);
        if (result) {
          uploadAndGetUrl(result, isToken).then((res) => {
            const url = `http://portal.ivmsgroup.com/panache/images/${res}`;
            handleMediaSelection(url, "image");
          });
        }
      }, 500);
    } catch (error) {
      console.log("recordImageFromCamera error", error);
    }
  };

  const selectImageFromLibrary = async () => {
    try {
      const options = {
        mediaType: "photo",
        quality: 0.8,
        cropping: true,
      };
      setVideoModal(false);
      setTimeout(async () => {
        const result = await openPicker(options);
        if (result) {
          uploadAndGetUrl(result, isToken).then((res) => {
            const url = `http://portal.ivmsgroup.com/panache/images/${res}`;
            handleMediaSelection(url, "image");
          });
        }
      }, 1000);
    } catch (error) {
      console.log("selectImageFromLibrary error", error);
    }
  };

  // Video functions
  const recordVideoFromCamera = () => {
    try {
      const options = {
        mediaType: "video",
        videoQuality: "high",
        durationLimit: 90, // 90 seconds maximum
        includeBase64: false,
      };
      setVideoModal(false);
      setTimeout(async () => {
        const result = await openCamera(options);
        if (result) {
          // Check video duration
          if (result.duration && result.duration > 90000) {
            ToastMessage("Video duration must be 90 seconds or less");
            return;
          }
          if (result.duration && result.duration < 60000) {
            ToastMessage("Video must be at least 60 seconds long");
            return;
          }

          uploadAndGetUrl(result, isToken).then((res) => {
            const url = `http://portal.ivmsgroup.com/panache/videos/${res}`;
            handleMediaSelection(url, "video");
          });
        }
      }, 500);
    } catch (error) {
      console.log("recordVideoFromCamera error", error);
    }
  };

  const selectVideoFromLibrary = async () => {
    try {
      const options = {
        mediaType: "video",
        videoQuality: "high",
        durationLimit: 90, // 90 seconds maximum
      };
      setVideoModal(false);
      setTimeout(async () => {
        const result = await openPicker(options);
        if (result) {
          // Check video duration
          if (result.duration && result.duration > 90000) {
            ToastMessage("Video duration must be 90 seconds or less");
            return;
          }
          if (result.duration && result.duration < 60000) {
            ToastMessage("Video must be at least 60 seconds long");
            return;
          }

          uploadAndGetUrl(result, isToken).then((res) => {
            const url = `http://portal.ivmsgroup.com/panache/videos/${res}`;
            handleMediaSelection(url, "video");
          });
        }
      }, 1000);
    } catch (error) {
      console.log("selectVideoFromLibrary error", error);
    }
  };

  const handleMediaSelection = (uploadedUrl, type) => {
    setVideoModal(false);

    // Navigate to face verification screen
    navigation.navigate("FaceVerification", {
      uploadedImageUri: uploadedUrl,
      mediaType: type,
      onVerificationSuccess: () => {
        // After verification success, save the media
        setViewVideos((prev) => ({
          ...prev,
          [currentView]: [{ url: uploadedUrl, type: type }],
        }));
        ToastMessage(
          `${
            type === "image" ? "Image" : "Video"
          } uploaded and verified successfully`
        );
      },
    });
  };

  const handleVideoDelete = (view) => {
    setViewVideos((prev) => ({
      ...prev,
      [view]: [],
    }));
  };

  useEffect(() => {
    setBio(userData?.bio);
    const selected = zodiacSigns.find(
      (item) => item.name === userData?.starsign
    );
    if (selected) {
      setSelectedSign(selected);
    }
  }, [userData]);

  const onSubmit = async () => {
    setLoading(true);
    const allUrls = Object.values(viewVideos)
      .flat()
      .map((item) => item.url);
    let data = {
      type: "update_data",
      table_name: "users",
      id: isToken,
      image: allUrls[0], // First media (image or video) as main
      user_gallery: JSON.stringify(allUrls),
      gender_interest: selectedNames,
      bio: Bio,
      starsign: SelectedSign?.name,
    };
    const response = await ApiRequest(data);
    if (response?.data?.result) {
      let body = {
        type: "profile",
        user_id: isToken,
      };
      const profileApi = await ApiRequest(body);
      dispatch(setUserData(profileApi?.data?.profile));
      navigate.goBack();
      setLoading(false);
      ToastMessage(response?.data?.message);
    } else {
      ToastMessage(response?.data?.message);
      setLoading(false);
    }
  };

  const ModalIcons = ({ source, title, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={source}
            style={{
              width: 60,
              height: 60,
              resizeMode: "contain",
              tintColor: COLORS.primaryColor,
            }}
          />
        </View>
        <CustomText
          label={title}
          fontFamily={fonts.semiBold}
          color={COLORS.white}
          marginTop={10}
        />
      </TouchableOpacity>
    );
  };

  const VideoThumbnail = ({ videoUrl, view, index, mediaType }) => {
    const isImage = mediaType === "image";
    const isVideo = mediaType === "video";

    return (
      <View style={{ width: "99%", height: "100%", borderRadius: 15 }}>
        {videoUrl ? (
          <>
            {isImage ? (
              <ImageFast
                source={{ uri: videoUrl }}
                style={{ width: "100%", height: "100%", borderRadius: 15 }}
                resizeMode="cover"
              />
            ) : (
              <Video
                source={{ uri: videoUrl }}
                style={{ width: "100%", height: "100%", borderRadius: 15 }}
                paused={true}
                resizeMode="cover"
              />
            )}
            {isVideo && (
              <View style={styles.videoPlayIcon}>
                <Icons
                  name={"play-circle"}
                  family={"Feather"}
                  color={COLORS.white}
                  size={40}
                />
              </View>
            )}
            <View style={styles.videoOverlay}>
              <View style={styles.videoBadge}>
                <CustomText
                  label={index === 0 ? "Main" : index.toString()}
                  color={COLORS.white}
                  fontFamily={fonts.regular}
                  fontSize={10}
                />
              </View>
              <TouchableOpacity onPress={() => handleVideoDelete(view)}>
                <ImageFast
                  source={image.trash}
                  style={{ width: 24, height: 24 }}
                  resizeMode={"contain"}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyVideoContainer}>
            <Icons
              name={"plus-circle"}
              family={"Feather"}
              color={COLORS.gray}
              size={40}
            />
            <CustomText
              label={"Add Media"}
              color={COLORS.gray}
              fontSize={10}
              marginTop={5}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => <Header title={"Edit Profile"} />}
    >
      <CustomText
        label={"Profile Media"}
        color={COLORS.white}
        fontFamily={fonts.bold}
        fontSize={18}
        marginBottom={5}
      />
      <CustomText
        label={"Add images or record 60-90 second videos to showcase yourself"}
        color={COLORS.gray}
        fontFamily={fonts.medium}
        fontSize={12}
        marginBottom={10}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          gap: 5,
          position: "relative",
        }}
      >
        <TouchableOpacity
          onPress={() => openVideoPickerModal("view1")}
          style={styles.uploadContainer}
        >
          <VideoThumbnail
            videoUrl={viewVideos?.view1[0]?.url}
            view="view1"
            index={0}
            mediaType={viewVideos?.view1[0]?.type || "video"}
          />
        </TouchableOpacity>

        <View style={{ width: "100%", marginLeft: 5 }}>
          <TouchableOpacity
            onPress={() => openVideoPickerModal("view2")}
            style={styles.uploadContainerSide}
          >
            <VideoThumbnail
              videoUrl={viewVideos?.view2[0]?.url}
              view="view2"
              index={2}
              mediaType={viewVideos?.view2[0]?.type || "video"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openVideoPickerModal("view3")}
            style={styles.uploadContainerSide}
          >
            <VideoThumbnail
              videoUrl={viewVideos?.view3[0]?.url}
              view="view3"
              index={3}
              mediaType={viewVideos?.view3[0]?.type || "video"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => openVideoPickerModal("view4")}
          style={styles.uploadContainerBottom}
        >
          <VideoThumbnail
            videoUrl={viewVideos?.view4[0]?.url}
            view="view4"
            index={4}
            mediaType={viewVideos?.view4[0]?.type || "video"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openVideoPickerModal("view5")}
          style={styles.uploadContainerBottom}
        >
          <VideoThumbnail
            videoUrl={viewVideos?.view5[0]?.url}
            view="view5"
            index={5}
            mediaType={viewVideos?.view5[0]?.type || "video"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openVideoPickerModal("view6")}
          style={styles.uploadContainerBottom}
        >
          <VideoThumbnail
            videoUrl={viewVideos?.view6[0]?.url}
            view="view6"
            index={6}
            mediaType={viewVideos?.view6[0]?.type || "video"}
          />
        </TouchableOpacity>
      </View>

      <View>
        <CustomText
          label={"My Bio"}
          color={COLORS.white}
          fontFamily={fonts.bold}
          fontSize={18}
          marginTop={20}
        />
        <CustomText
          label={"Write fun and punchy intro."}
          color={COLORS.gray}
          fontFamily={fonts.medium}
          fontSize={12}
        />

        <CustomInput
          multiline
          height={100}
          value={Bio}
          onChangeText={(text) => setBio(text)}
          Background={"#323232"}
          placeholder={"A little bit about you..."}
          placeholderTextColor={COLORS.white}
          marginTop={10}
        />

        <CustomText
          label={"My basics"}
          color={COLORS.white}
          fontFamily={fonts.bold}
          fontSize={18}
          marginTop={10}
        />

        <TouchableOpacity
          style={styles.signCard}
          onPress={() => setisVisible(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {SelectedSign ? (
              <CustomText
                label={SelectedSign?.sign}
                color={COLORS.primaryColor}
                fontFamily={fonts.medium}
                fontSize={18}
              />
            ) : (
              <ImageFast
                source={image?.Leo}
                resizeMode={"contain"}
                style={{ width: 24, height: 24 }}
              />
            )}

            <CustomText
              label={"STAR SIGN"}
              color={COLORS.white}
              fontFamily={fonts.medium}
              fontSize={16}
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <CustomText
              label={SelectedSign?.name ? SelectedSign?.name : "STAR SIGN"}
              color={COLORS.gray}
              fontFamily={fonts.regular}
              fontSize={14}
            />
            <Icons
              name={"chevron-small-right"}
              family={"Entypo"}
              color={COLORS.gray}
              size={24}
            />
          </View>
        </TouchableOpacity>

        <CustomModal
          isVisible={isVisible}
          onDisable={() => setisVisible(false)}
          backdropOpacity={0.4}
          isChange
        >
          <View style={styles.modalContainer2}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                height: 58,
                paddingHorizontal: 20,
                borderBottomWidth: 0.2,
                borderBottomColor: COLORS.gray,
              }}
            >
              <CustomText
                label={"Select Ziodic Sign"}
                fontFamily={fonts.medium}
                color={COLORS.primaryColor}
                fontSize={18}
              />
              <Icons
                name={"close"}
                family={"AntDesign"}
                color={COLORS.primaryColor}
                size={24}
                onPress={() => setisVisible(false)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ScrollView>
                {zodiacSigns?.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedSign(item);
                      setisVisible(false);
                    }}
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      gap: 10,
                    }}
                  >
                    <CustomText
                      label={item?.sign}
                      color={COLORS.primaryColor}
                      fontFamily={fonts.medium}
                      fontSize={18}
                    />

                    <CustomText
                      label={item?.name}
                      color={COLORS.white}
                      fontFamily={fonts.medium}
                      fontSize={18}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </CustomModal>
      </View>

      <CustomText label={"Gender Interests"} color={COLORS.primaryColor} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {data.map((item) => (
          <TouchableOpacity key={item?.id} style={styles.item}>
            <CheckBox
              value={selectedIds.includes(item.id)}
              setValue={() => {
                if (selectedIds.includes(item.id)) {
                  setSelectedIds((prev) => prev.filter((id) => id !== item.id));
                  setSelectedNames((prev) =>
                    prev.filter((name) => name !== item.name)
                  );
                } else {
                  setSelectedIds((prev) => [...prev, item.id]);
                  setSelectedNames((prev) => [...prev, item.name]);
                }
              }}
            />
            <CustomText
              label={item.name}
              textTransform={"capitalize"}
              color={COLORS.primaryColor}
              fontFamily={fonts.medium}
            />
          </TouchableOpacity>
        ))}
      </View>

      <CustomButton
        onPress={onSubmit}
        loading={loading}
        title={"Save Changes"}
        disabled={
          !Object.values(viewVideos).some((videos) => videos.length > 0) ||
          !selectedNames?.length > 0 ||
          !Bio ||
          !SelectedSign?.name
        }
        color={COLORS.black}
        marginTop={10}
        marginBottom={10}
      />

      {/* Media Selection Modal - Images and Videos */}
      <CustomModal
        isChange
        isVisible={videoModal}
        transparent={true}
        onDisable={() => setVideoModal(false)}
        backgroundColor="transparent"
      >
        <View style={[styles.mainContainer]}>
          <Icons
            family="Entypo"
            name="circle-with-cross"
            size={25}
            color={COLORS.primaryColor}
            style={{ alignSelf: "flex-end", marginBottom: 10 }}
            onPress={() => setVideoModal(false)}
          />
          <CustomText
            label="Add Image or Video"
            fontSize={18}
            fontFamily={fonts.bold}
            alignSelf="center"
            marginBottom={10}
            color={COLORS.white}
          />
          <CustomText
            label="Choose image or record 60-90 second video"
            fontSize={12}
            fontFamily={fonts.regular}
            alignSelf="center"
            marginBottom={30}
            color={COLORS.gray}
          />
          <View
            style={[
              styles.modalIconContainer,
              { flexDirection: "column", gap: 20 },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <ModalIcons
                source={image.gallery}
                title="Choose Image"
                onPress={selectImageFromLibrary}
              />
              <ModalIcons
                source={image.camera}
                title="Take Photo"
                onPress={recordImageFromCamera}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <ModalIcons
                source={image.gallery}
                title="Choose Video"
                onPress={selectVideoFromLibrary}
              />
              <ModalIcons
                source={image.camera}
                title="Record Video"
                onPress={recordVideoFromCamera}
              />
            </View>
          </View>
        </View>
      </CustomModal>

      {openDate && (
        <DatePicker
          modal
          open={openDate}
          onCancel={() => setOpenDate(false)}
          date={date}
          onConfirm={(date) => {
            setDate(date);
            setOpenDate(false);
          }}
          mode="date"
          theme="dark"
        />
      )}
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  modal: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderColor: COLORS.primaryColor,
    padding: 25,
    borderWidth: 1,
    elevation: 2,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
  },

  uploadContainer: {
    backgroundColor: "#323232",
    width: "66%",
    height: 243,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },

  uploadContainerSide: {
    backgroundColor: "#323232",
    width: "32%",
    height: 120,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    overflow: "hidden",
  },

  uploadContainerBottom: {
    backgroundColor: "#323232",
    height: 120,
    flex: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    overflow: "hidden",
  },

  mainContainer: {
    backgroundColor: COLORS.bg,
    width: "100%",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 24,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  iconStyle: {
    position: "absolute",
    bottom: 15,
    right: 5,
    borderRadius: 50,
    borderWidth: 1,
    backgroundColor: "white",
    borderWidth: 0,
    padding: 5,
  },
  container: {
    alignSelf: "center",
    width: "100%",
  },
  modalContainer: {
    height: "30%",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 15,
  },

  modalContainer2: {
    backgroundColor: "#222222",
    width: "100%",
    maxHeight: "100%",
    borderRadius: 12,
    paddingVertical: 15,
    position: "absolute",
    bottom: 0,
  },
  modalIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  emptyView: {
    width: 60,
    height: 6,
    borderRadius: 100,
    backgroundColor: COLORS.emptyView,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 10,
  },

  item: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },

  mainContainerFixed: {
    marginBottom: 15,
    marginTop: 0,
    borderColor: COLORS.inputBorder,
    height: 52,
    width: "100%",
    borderRadius: 12,
    paddingLeft: 20,
    backgroundColor: "#141414",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 10,
  },

  signCard: {
    backgroundColor: "#323232",
    height: 56,
    borderRadius: 12,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  videoPlayIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    opacity: 0.9,
  },

  videoOverlay: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    justifyContent: "space-between",
    width: "100%",
    bottom: 10,
    paddingHorizontal: 10,
  },

  videoBadge: {
    backgroundColor: "#323232",
    height: 20,
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
