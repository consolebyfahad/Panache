import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { openCamera, openPicker } from "react-native-image-crop-picker";

import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";
import CustomText from "../../../components/CustomText";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import CountryPhoneInput from "../../../components/CountryPhoneInput";
import CustomInput from "../../../components/CustomInput";
import CustomButton from "../../../components/CustomButton";
import UploadImage from "../../../components/UploadImage";
import { Touchable } from "react-native";
import { TouchableOpacity } from "react-native";
import CustomModal from "../../../components/CustomModal";
import Icons from "../../../components/Icons";
import { useDispatch, useSelector } from "react-redux";
import { uploadAndGetUrl } from "../../../utils/constants";
import { ApiRequest } from "../../../Services/ApiRequest";
import { ToastMessage } from "../../../utils/ToastMessage";
import { useNavigation } from "@react-navigation/native";
import { setUserData } from "../../../store/reducer/usersSlice";
import CheckBox from "../../../components/CheckBox";
import DatePicker from "react-native-date-picker";
import moment from "moment";
const width = Dimensions.get("screen").width;
const PersonalDetails = () => {
  const { userData } = useSelector((state) => state.users);
  const isToken = useSelector((state) => state.authConfig.token);
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState(new Date());

  const dispatch = useDispatch();
  const navigate = useNavigation();
  const init = {
    fname: "",
    lname: "",
    username: "",
    phone: "",
    City: "",
    address: " ",
    State: "",
  };

  const [state, setState] = useState(init);
  const inits = {
    fnameError: "",
    usernameError: "",
    phoneError: "",
    DOBError: "",
    CityError: "",
    addressError: "",
    StateError: "",
    selectedNameError: "",
  };

  const [errors, setErrors] = useState(inits);

  const [loading, setLoading] = useState(false);

  const array = [
    {
      id: 1,
      placeholder: "First Name",
      value: state.fname,
      onChange: (text) => setState({ ...state, fname: text }),
      error: errors.fnameError,
    },
    {
      id: 2,
      placeholder: "Last Name",
      value: state.lname,
      onChange: (text) => setState({ ...state, lname: text }),
      error: errors.lnameError,
    },

    {
      id: 4,
      placeholder: "DOB",
      value: date,
      onPress: () => setOpenDate(true),
      error: errors.DOBError,
      dateTime: true,
    },

    {
      id: 5,
      placeholder: "Phone Number",
      value: state.phone,
      error: errors.phoneError,
      onChange: (text) => setState({ ...state, phone: text }),
    },
    {
      id: 6,
      placeholder: "Country",
      value: state.Country,
      onChange: (text) => setState({ ...state, Country: text }),
      error: errors.CountryError,
    },
    {
      id: 7,
      placeholder: "City",
      value: state.City,
      onChange: (text) => setState({ ...state, City: text }),
      error: errors.CityError,
    },
    {
      id: 8,
      placeholder: "Address",
      value: state.address,
      onChange: (text) => setState({ ...state, address: text }),
      error: errors.addressError,
    },
    {
      id: 9,
      placeholder: "State",
      value: state.State,
      onChange: (text) => setState({ ...state, State: text }),
      error: errors.StateError,
    },
  ];

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birth.getDate())
        ) {
          age--;
        }

        return age;
      };

      if (!state.fname) newErrors.fnameError = "Please enter First Name";
      else if (state.fname.length < 4)
        newErrors.fnameError = "First name at least 4 characters";
      else if (!state.lname) newErrors.lnameError = "Please enter last name";
      else if (!state.phone) newErrors.phoneError = "Please enter phone";
      else if (!state.Country) newErrors.CountryError = "Please enter Country";
      else if (!state.City) newErrors.CityError = "Please enter City";
      else if (!state.State) newErrors.StateError = "Please enter State";
      else if (!date || calculateAge(date) < 18)
        newErrors.DOBError = "Users must be at least 18 years old";

      setErrors(newErrors);
    };
  }, [state, date]);

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);

  const onSubmit = async () => {
    setLoading(true);
    let data = {
      type: "update_data",
      table_name: "users",
      id: isToken,
      first_name: state?.fname,
      last_name: state?.lname,
      dob: date,
      phone: state?.phone,
      country: state?.Country,
      city: state?.City,
      state: state?.State,
      address: state?.address,
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
  useEffect(() => {
    setState({
      fname: userData?.first_name,
      lname: userData?.last_name,
      phone: userData?.phone,
      Country: userData?.country,
      City: userData?.city,
      State: userData?.state,
      address: userData?.address,
    });
    setDate(userData?.dob ? new Date(userData?.dob) : new Date());
  }, [userData]);

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
  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => <Header title={"Personal Details"} />}
    >
      <CustomText
        label={"Your Details"}
        fontFamily={fonts.medium}
        fontSize={18}
        color={COLORS.white}
        marginBottom={10}
      />

      {array.map((item) =>
        item?.id == 4 ? (
          <React.Fragment key={item.id}>
            <TouchableOpacity
              style={[
                styles.mainContainerFixed,
                {
                  borderColor: item.error ? COLORS.red : COLORS.inputBorder,
                  marginBottom: item.error ? 5 : 20,
                },
              ]}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <View style={styles.input}>
                <CustomText
                  label={
                    item.value
                      ? moment(item.value).format("DD/MM/YYYY")
                      : item.placeholder
                  }
                  fontFamily={fonts.regular}
                  fontSize={14}
                  color={COLORS.white}
                />
                <Icons
                  family="Entypo"
                  name="calendar"
                  size={22}
                  color={COLORS.gray}
                />
              </View>
            </TouchableOpacity>
            {item.error && (
              <CustomText
                label={item.error}
                color={COLORS.red}
                marginBottom={20}
              />
            )}
          </React.Fragment>
        ) : (
          <CustomInput
            withLabel={item.withLabel}
            key={item?.id}
            placeholder={item.placeholder}
            value={item.value}
            onChangeText={item.onChange}
            error={item.error}
            autoCapitalize={item.autoCapitalize}
            dateTime={item.dateTime}
            City={item.city}
            Country={item.country}
          />
        )
      )}

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

      <CustomButton
        onPress={onSubmit}
        loading={loading}
        title={"Save Changes"}
        disabled={Object.keys(errors).some((key) => errors[key] !== "")}
        color={COLORS.black}
        marginTop={10}
        marginBottom={10}
      />
    </ScreenWrapper>
  );
};

export default PersonalDetails;

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
  },

  uploadContainerSide: {
    backgroundColor: "#323232",
    width: "32%",
    height: 120,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  uploadContainerBottom: {
    backgroundColor: "#323232",
    height: 120,
    flex: 1, // Adjust the width automatically to share space equally
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
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
});
