import { useEffect, useState } from "react";
import { ApiRequest } from "./src/Services/ApiRequest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CustomModal from "./src/components/CustomModal";
import CustomButton from "./src/components/CustomButton";
import ImageFast from "./src/components/ImageFast";
import CustomText from "./src/components/CustomText";
import { COLORS } from "./src/utils/COLORS";
import fonts from "./src/assets/fonts";
import { StyleSheet, View } from "react-native";
import Icons from "./src/components/Icons";
import { image } from "./src/assets/images";

export default function DatePopup() {
  const navigate = useNavigation();

  const [sucessModal, setsucessModal] = useState(false);
  const [UserData, setUserData] = useState([]);
  const [PhoneModal, setPhoneModal] = useState(false);

  const checkDate = async () => {
    const isToken = await AsyncStorage.getItem("user_id");
    try {
      let body = {
        type: "check_date",
        user_id: isToken,
      };
      const response = await ApiRequest(body);

      if (response.data?.date?.status == "pending") {            
        navigate.navigate("Request", { data: response.data?.date , isPopup: true});
      } else {
        // console.log("Date check failed");
      }
    } catch (error) {
      // console.error("Error checking date:", error);
    }
  };

  const checkforFeedback = async () => {
    const isToken = await AsyncStorage.getItem("user_id");
    try {
      let body = {
        type: "check_feedback",
        user_id: isToken,
      };
      const response = await ApiRequest(body);
      
      if (response.data?.date?.user) {
        setUserData(response.data?.date);
        setTimeout(() => {
          setsucessModal(true)
        }, 500);
      } else {
        console.log("feedback check failed");
      }
    } catch (error) {
      console.error("Error checking feedback:", error);
    }
  };

  const addFeedback = async (data) => {
    if (data == "yes") {
      setsucessModal(false);
      setTimeout(() => {
        setPhoneModal(true);
      }, 500);
    } else {
      const body = {
        type: "update_data",
        table_name: "dates",
        id: UserData?.id,
        feedback: 1,
      };
      const response = await ApiRequest(body);
      if (response?.data?.result) {
        const isToken = await AsyncStorage.getItem("user_id");
        let apibody = {
          type: "add_data",
          table_name: "feedback",
          date_id: UserData?.id,
          phone_number: "no",
          next_date: "no",
          user_id: isToken,
        };
        const response = await ApiRequest(apibody);
        if (response?.data?.result) {
          setsucessModal(false);
        }
      }
    }
  };

  const addDateFeedback = async (data,test) => {    

    const isToken = await AsyncStorage.getItem("user_id");
    let apibody = {
      type: "add_data",
      table_name: "feedback",
      date_id: UserData?.id,
      phone_number: data,
      next_date: test  ? test :  data,
      user_id: isToken,
    };
    const response = await ApiRequest(apibody);

    if (response?.data?.result) {
      let datesbody = {
        type: "update_data",
        table_name: "dates",
        id: UserData?.id,
        feedback: 1,
      };
      const res = await ApiRequest(datesbody);
      if (res?.data?.result) {
        setPhoneModal(false);
        navigate.navigate("DatingProfile", { data: UserData?.user, issecond : true });
      }
    }
  };

  useEffect(() => {
    let interval;
    if (!sucessModal && !PhoneModal) {
      interval = setInterval(() => {
        checkforFeedback();
      }, 120000);
    }
    return () => clearInterval(interval);
  }, [sucessModal, PhoneModal]);


  useEffect(() => {
    const interval = setInterval(() => {
      checkDate();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CustomModal
        isVisible={sucessModal}
        onDisable={() => setsucessModal(false)}
        backdropOpacity={0.4}
        isChange
      >
        <View style={styles.modalContainer}>
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
              label={"Feedback"}
              fontFamily={fonts.medium}
              color={COLORS.primaryColor}
              fontSize={18}
            />

            <Icons
              name={"close"}
              family={"AntDesign"}
              color={COLORS.primaryColor}
              size={24}
              onPress={() =>setsucessModal (false)}
            />
          </View>

          <View style={styles.dateContainer}>
            <ImageFast
              source={
                UserData?.user?.image
                  ? { uri: UserData?.user?.image }
                  : image.Date5
              }
              style={styles.icn2}
              resizeMode={"cover"}
            />
            <View>
              <CustomText
                label={
                  UserData?.user?.first_name + " " + UserData?.user?.last_name
                }
                fontFamily={fonts.medium}
                color={COLORS.primaryColor}
                textTransform={"capitalize"}
                fontSize={16}
              />
              <CustomText
                label={UserData?.user?.city + ", " + UserData?.user?.country}
                fontFamily={fonts.medium}
                color={COLORS.gray}
                fontSize={16}
              />
            </View>
          </View>

          <CustomText
            label={`Would you like to see ${
              UserData?.user?.first_name + " " + UserData?.user?.last_name
            } for another date?`}
            fontFamily={fonts.medium}
            color={COLORS.white}
            textAlign={"center"}
            marginTop={20}
            fontSize={16}
          />

          <CustomButton
            onPress={() => addFeedback("yes")}
            title={"Yes"}
            width="95%"
            color={COLORS.black}
            marginTop={10}
          />

          <CustomButton
            onPress={() => addFeedback("no")}
            title={"No"}
            width="95%"
            color={COLORS.primaryColor}
            marginTop={20}
            marginBottom={10}
            backgroundColor={"#323232"}
          />
        </View>
      </CustomModal>

      <CustomModal
        isVisible={PhoneModal}
        onDisable={() => setPhoneModal(false)}
        backdropOpacity={0.4}
        isChange
      >
        <View style={styles.modalContainer}>
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
              label={"Feedback"}
              fontFamily={fonts.medium}
              color={COLORS.primaryColor}
              fontSize={18}
            />

            <Icons
              name={"close"}
              family={"AntDesign"}
              color={COLORS.primaryColor}
              size={24}
              onPress={() => setPhoneModal(false)}
            />
          </View>

          <View style={styles.dateContainer}>
            <ImageFast
              source={
                UserData?.user?.image
                  ? { uri: UserData?.user?.image }
                  : image.Date5
              }
              style={styles.icn2}
              resizeMode={"cover"}
            />
            <View>
              <CustomText
                label={
                  UserData?.user?.first_name + " " + UserData?.user?.last_name
                }
                fontFamily={fonts.medium}
                color={COLORS.primaryColor}
                textTransform={"capitalize"}
                fontSize={16}
              />
              <CustomText
                label={UserData?.user?.city + ", " + UserData?.user?.country}
                fontFamily={fonts.medium}
                color={COLORS.gray}
                fontSize={16}
              />
            </View>
          </View>

          <CustomText
            label={`Would you like ${
              UserData?.user?.first_name + " " + UserData?.user?.last_name
            } to receive your mobile number?`}
            fontFamily={fonts.medium}
            color={COLORS.white}
            textAlign={"center"}
            marginTop={20}
            fontSize={16}
          />

          <CustomButton
            onPress={() => addDateFeedback("yes")}
            title={"Yes"}
            width="95%"
            color={COLORS.black}
            marginTop={10}
          />

          <CustomButton
            onPress={() => addDateFeedback("no","yes")}
            title={"No"}
            width="95%"
            color={COLORS.primaryColor}
            marginTop={20}
            marginBottom={10}
            backgroundColor={"#323232"}
          />
        </View>
      </CustomModal>
    </>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#222222",
    width: "100%",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },

  dateContainer: {
    backgroundColor: "#323232",
    height: 80,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "95%",
    marginLeft: "2.5%",
    marginTop: 20,
    padding: 10,
    // paddingLeft: 7,
  },

  icn2: {
    height: 66,
    width: 66,
    borderRadius: 15,
  },
});
