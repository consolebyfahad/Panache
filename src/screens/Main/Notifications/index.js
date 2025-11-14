import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import { image } from "../../../assets/images";
import { TouchableOpacity } from "react-native";
import ImageFast from "../../../components/ImageFast";
import Icons from "../../../components/Icons";
import CustomText from "../../../components/CustomText";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import { useSelector } from "react-redux";
import { ApiRequest } from "../../../Services/ApiRequest";
import moment from "moment";
import NoDataFound from "../../../components/NoDataFound";

const Notifications = ({ navigation }) => {
  const isToken = useSelector((state) => state.authConfig.token);
  const [loading, setloading] = useState(true);
  const [Notidata, setNotidata] = useState([]);

  const Notifications = [
    {
      id: 1,
      time: "5 mins ago",
      title: "Title",
      des: "Lorem ipsum dolor sit amet",
      image: image.profilenoti,
      day: "New",
    },
    {
      id: 2,
      time: "5 mins ago",
      title: "Grace W",
      des: "Grace has accepted your Connect",
      image: image.user,
      day: "Yesterday",
    },
    {
      id: 3,
      time: "5 mins ago",
      title: "Title",
      des: "Lorem ipsum dolor sit amet",
      image: image.profilenoti,
    },
    {
      id: 4,
      title: "Guy Hawkins",
      time: "5 mins ago",
      des: "Guy wants to Connect",
      image: image.user,
      day: "Last month",
    },
    {
      id: 5,
      title: "Title",
      time: "5 mins ago",
      des: "Lorem ipsum dolor sit amet",
      image: image.Date5,
    },
    {
      id: 6,
      title: "Title",
      time: "5 mins ago",
      des: "Lorem ipsum dolor sit amet",
      image: image.profilenoti,
    },
    {
      id: 7,
      title: "Title",
      time: "5 mins ago",
      des: "Lorem ipsum dolor sit amet",
      image: image.profilenoti,
    },
  ];

  const getNotifications = async () => {
    let body = {
      type: "notifications",
      user_id: isToken,
    };
    const response = await ApiRequest(body);
    setNotidata(response?.data?.notifications);
    setloading(false);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <ScreenWrapper
      headerUnScrollable={() => <Header title={"Notifications"} />}
    >
      <FlatList
        data={Notidata}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getNotifications}
            colors={[COLORS.primaryColor]}
          />
        }
        ListEmptyComponent={
          <NoDataFound
            title={"No data Found"}
            desc={"There is No Notification"}
          />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            <CustomText
              label={moment(item?.created_at).format("MMMM D, YYYY")}
              color={"#727272"}
              fontFamily={fonts.medium}
              fontSize={14}
              marginTop={10}
              marginBottom={10}
            />
            <TouchableOpacity
              style={styles.DateCard}
              onPress={
                item?.title == "New Connect" ||
                item?.title == "Connect Accepted" ||
                item?.title == "Connect Rejected"
                  ? () => navigation.navigate("Request", { data: item })
                  : () => {}
              }
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                {item?.title == "New Connect" ||
                item?.title == "Connect Accepted" ||
                item?.title == "Connect Rejected" ? (
                  <ImageFast
                    source={{ uri: item?.image }}
                    style={styles.icn}
                    resizeMode={"cover"}
                  />
                ) : (
                  <View
                    style={{
                      backgroundColor: "#222222",
                      padding: 20,
                      borderRadius: 13,
                    }}
                  >
                    <ImageFast
                      source={image.profilenoti}
                      style={styles.icn2}
                      resizeMode={"contain"}
                    />
                  </View>
                )}

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <CustomText
                      label={item?.title}
                      textTransform={"capitalize"}
                      color={COLORS.primaryColor}
                      fontFamily={fonts.medium}
                      fontSize={18}
                    />
                    <CustomText
                      label={moment(item?.created_at).format("hh:mm A")}
                      color={COLORS.gray}
                      fontFamily={fonts.medium}
                      fontSize={14}
                    />
                  </View>

                  <CustomText
                    label={item?.body}
                    color={COLORS.gray}
                    fontFamily={fonts.medium}
                    fontSize={14}
                    marginTop={-8}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}
      />
    </ScreenWrapper>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  icn: {
    height: 66,
    width: 66,
    borderRadius: 15,
  },
  DateCard: {
    backgroundColor: "#323232",
    // height: ;,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 20,
    height: 'auto',
  },

  icn2: {
    height: 26,
    width: 26,
  },
});
