import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import LinearGradient from "react-native-linear-gradient";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";
import { COLORS } from "../../../utils/COLORS";
import CustomText from "../../../components/CustomText";
import fonts from "../../../assets/fonts";
import { TouchableOpacity } from "react-native";
import Header from "../../../components/Header";
import CustomInput from "../../../components/CustomInput";
import Icons from "../../../components/Icons";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal";
import { ApiRequest } from "../../../Services/ApiRequest";
import { ToastMessage } from "../../../utils/ToastMessage";
import { setUserData } from "../../../store/reducer/usersSlice";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

const Profile = ({ navigation }) => {
  const scrollRef = useRef(null); // Ref for scrolling
  const inputRef = useRef(null); // Ref for focusing input
  const { userData } = useSelector((state) => state.users);
  
  const [Bio, setBio] = useState("");
  const [isVisible, setisVisible] = useState(false);
  const [SelectedSign, setSelectedSign] = useState('')
  const isToken = useSelector((state) => state.authConfig.token);
  
  const [Loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  let fixedData = [];

  if (userData?.user_gallery) {
    try {
      fixedData = JSON.parse(userData.user_gallery);
    } catch (error) {
      console.error("Error parsing user gallery:", error);
      fixedData = []; // Assign an empty array or suitable fallback value
    }
  } else {
    console.warn("user_gallery data is not available");
  }
  
  



 
  const init = {
    email: "",
    password: "",
  };
  const inits = {
    emailError: "",
    passwordError: "",
  };

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
    setBio(userData?.bio)
    const selected = zodiacSigns.find(item => item.name === userData?.starsign);
    if (selected) {
      setSelectedSign(selected);
    }

 }, [userData])

  const [errors, setErrors] = useState(inits);
  const [state, setState] = useState(init);
  const [EditPress, setEditPress] = useState(false);
  
  const statusBarHeight = Platform.OS === "ios" ? 40 : StatusBar.currentHeight;

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      if (!state.email) newErrors.emailError = "Please enter Email address";
      else if (!state.password)
        newErrors.passwordError = "Please enter Password";
      else if (!passwordRegex.test(state.password))
        newErrors.passwordError =
          "Password must contain 1 number, 1 special character, Uppercase and 8 digits";
      setErrors(newErrors);
    };
  }, [state]);

  useEffect(() => {
    if (EditPress) {
      inputRef.current?.focus();
    }
  }, [EditPress]);

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);

  const UpdateBio = async () => {
    setLoading(true);
      let body = {
        type: "update_data",
        table_name: "users",
        id: isToken,
        bio: Bio,
        starsign : SelectedSign?.name
      }
      const response = await ApiRequest(body);
      if (response?.data?.result) {
      let body = {
        type: "profile",
        user_id: isToken,
      }
      const profileApi = await ApiRequest(body)
      dispatch(setUserData(profileApi?.data?.profile));
      setLoading(false);
      ToastMessage(response?.data?.message);
    } else {
      ToastMessage(response?.data?.message);
      setLoading(false);
    }      
   
  };

 
  

  return (
    <ScreenWrapper
      scrollEnabled
      statusBarColor="transparent"
      translucent
      headerUnScrollable={() => (
        <>
          <View style={[styles.header, { marginTop: statusBarHeight }]}>
            <Header
              title={"Profile"}
              // isEdit
              editPress={() => setEditPress(true)}
            />
          </View>
        </>
      )}
      paddingHorizontal={0.1}
    >
      <View style={styles.container}>
        {/* image.user */}
        <ImageFast
          source={userData?.image ? { uri: userData?.image } : image.mainplaceholder}
          style={{ height: height / 2, width: "100%" }}
          resizeMode={"cover"}
        />
        <LinearGradient
          colors={["rgba(34, 34, 34, 0.11)", "#222222"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          locations={[0.3486, 0.8025]}
          style={styles.gradient}
        />

        <View style={{ position: "absolute", bottom: 170, width: "100%" }}>
          <CustomText
            label={userData?.first_name + " " + userData?.last_name}
            fontSize={26}
            
            fontFamily={fonts.medium}
            marginTop={-8}
            textTransform={"capitalize"}
            color={COLORS.primaryColor}
            alignSelf={"center"}
          />
          <CustomText
            label={userData?.city + ", " + userData?.country}
            fontSize={16}
            fontFamily={fonts.medium}
            marginTop={-8}
            color={COLORS.gray}
            alignSelf={"center"}
          />
        </View>

        {fixedData?.length> 0 ? (
          <FlatList
            data={fixedData}
            contentContainerStyle={{ justifyContent: "space-between" }}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={{ marginLeft: index == 0 ? 0 : 10 }}>
                <ImageFast
                  isView
                  source={{ uri: item }}
                  style={styles.icn}
                  resizeMode={"cover"}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={[0, 1, 2, 3, 4, 5]}
            contentContainerStyle={{ justifyContent: "space-between" }}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={{ marginLeft: index == 0 ? 0 : 10 }}>
                <ImageFast
                  isView
                  source={image.mainplaceholder}
                  style={styles.icn}
                  resizeMode={"cover"}
                />
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={{ paddingHorizontal: 20 }}>
              <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        style={styles.userProfile}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <View
            style={{
              backgroundColor: "#222222",
              borderRadius: 15,
              padding: 10,
            }}
          >
            <ImageFast
              source={image.profile}
              resizeMode={"cover"}
              style={styles.settingIcons}
            />
          </View>
          <CustomText
            label={"Edit Profile"}
            color={COLORS.white}
            fontSize={14}
            fontFamily={fonts.medium}
          />
        </View>

        <Icons
          name={"chevron-small-right"}
          family={"Entypo"}
          color={COLORS.gray}
          size={35}
        />
      </TouchableOpacity>
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
          editable={false}
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
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {SelectedSign ? (
               <CustomText
               label={SelectedSign?.sign}
               color={COLORS.primaryColor}
               fontFamily={fonts.medium}
               fontSize={18}
             />
            ):(
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

      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  gradient: {
    position: "absolute",
    height: 500,
    width: width,
  },

  icn: {
    width: 140,
    height: 126,
    borderRadius: 12,
  },

  header: {
    position: "absolute",
    zIndex: 999,
    width: "100%",
  },
    userProfile: {
    backgroundColor: "#323232",
    padding: 5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20,
    height: 81,
    marginTop: 10,
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

  modalContainer: {
    backgroundColor: "#222222",
    width: "100%",
    maxHeight: '100%',
    borderRadius: 12,
    paddingVertical: 15,
    position: "absolute",
    bottom: 0,
  },
  settingIcons: {
    width: 28,
    height: 28,
  },
});
