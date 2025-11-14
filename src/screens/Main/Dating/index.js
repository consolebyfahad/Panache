import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import ImageFast from "../../../components/ImageFast";
import { image } from "../../../assets/images";

import CustomText from "../../../components/CustomText";
import Icons from "../../../components/Icons";
import { COLORS } from "../../../utils/COLORS";
import fonts from "../../../assets/fonts";
import { useSelector } from "react-redux";
import { ApiRequest } from "../../../Services/ApiRequest";
import NoDataFound from "../../../components/NoDataFound";
import { useIsFocused } from "@react-navigation/native";

const DUMMY_DATA = [
  {
    id: "1",
    first_name: "Sarah",
    last_name: "Johnson",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    first_name: "Michael",
    last_name: "Smith",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "3",
    first_name: "Emily",
    last_name: "Davis",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "4",
    first_name: "James",
    last_name: "Wilson",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "5",
    first_name: "Jessica",
    last_name: "Brown",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "6",
    first_name: "David",
    last_name: "Martinez",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "7",
    first_name: "Lisa",
    last_name: "Anderson",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "8",
    first_name: "Robert",
    last_name: "Taylor",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

const Date = ({ navigation }) => {
  const isToken = useSelector((state) => state.authConfig.token);
  const isfocued = useIsFocused();
  const spinValue = useRef(new Animated.Value(0)).current;
  const [datingArray, setDatingArray] = useState([]); 
  const [allProfiles, setAllProfiles] = useState(DUMMY_DATA);
  const [viewedProfileIds, setViewedProfileIds] = useState([]); // Track viewed profiles
  const [loading, setLoading] = useState(false);

  const getRandomProfiles = (profilesArray, count = 4) => {
    // Filter out already viewed profiles
    const availableProfiles = profilesArray.filter(
      profile => !viewedProfileIds.includes(profile.id)
    );

    if (availableProfiles.length === 0) {
      // If all profiles have been viewed, reset and use all profiles
      setViewedProfileIds([]);
      return getRandomProfiles(profilesArray, count);
    }

    if (availableProfiles.length <= count) {
      return availableProfiles;
    }
    
    const shuffled = [...availableProfiles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Simulating an API call
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = {
        type: "get_profiles",
        user_id: isToken,
      };

      const response = await ApiRequest(data);
      const profiles = response?.data?.profile || DUMMY_DATA;
      setAllProfiles(profiles); 
      setDatingArray(getRandomProfiles(profiles, 4)); 
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllProfiles(DUMMY_DATA);
      setDatingArray(getRandomProfiles(DUMMY_DATA, 4));
    } finally {
      setLoading(false);
    }
  };

  const spinWheel = async () => {
    // Mark current profiles as viewed before spinning
    const currentProfileIds = datingArray.map(profile => profile.id);
    setViewedProfileIds(prev => [...prev, ...currentProfileIds]);

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(async () => {
      spinValue.setValue(0);
      // Get new profiles excluding the ones just marked as viewed
      const updatedViewedIds = [...viewedProfileIds, ...currentProfileIds];
      const availableProfiles = allProfiles.filter(
        profile => !updatedViewedIds.includes(profile.id)
      );
      
      if (availableProfiles.length === 0) {
        // Reset if all profiles viewed
        setViewedProfileIds([]);
        setDatingArray(getRandomProfiles(allProfiles, 4));
      } else if (availableProfiles.length <= 4) {
        setDatingArray(availableProfiles);
      } else {
        const shuffled = [...availableProfiles].sort(() => 0.5 - Math.random());
        setDatingArray(shuffled.slice(0, 4));
      }
      
      animateListItems();
    });
  };

  const animateListItems = () => {
    datingArray.forEach((_, index) => {
      const animValue = new Animated.Value(1);
      Animated.timing(animValue, {
        toValue: 1.2,
        duration: 300,
        delay: index * 200,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(animValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });

      itemAnimations[index] = animValue;
    });
  };

  const itemAnimations = useRef([]).current;

  useEffect(() => {
    fetchData();
  }, [isfocued]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ScreenWrapper
      scrollEnabled
      paddingHorizontal={10}
      headerUnScrollable={() => (
        <Header title={"DATING"} containerWidth={"92%"} />
      )}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <ImageFast
          onPress={spinWheel}
          source={image.Wheel}
          resizeMode={"contain"}
          style={{ height: 300, width: "100%" }}
        />
      </Animated.View>

      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <FlatList
          data={datingArray}
          keyExtractor={(item, index) => item?.id || index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchData}
              colors={[COLORS.primaryColor]}
            />
          }
          ListEmptyComponent={<NoDataFound title={"No date found!"} />}
          renderItem={({ item, index }) => {
            const scale = itemAnimations[index] || new Animated.Value(1);
            return (
              <Animated.View
                style={{
                  transform: [{ scale }],
                }}
              >
                <TouchableOpacity
                  style={styles.DateCard}
                  onPress={() =>
                    navigation.navigate("DatingProfile", { data: item })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                    }}
                  >
                    <ImageFast
                      source={item?.image ? { uri: item?.image } : image.user}
                      style={styles.icn}
                      resizeMode={"cover"}
                    />

                    <CustomText
                      label={item?.first_name + " " + item?.last_name}
                      color={COLORS.white}
                      fontFamily={fonts.medium}
                      textTransform={"capitalize"}
                      fontSize={18}
                    />
                  </View>
                  <Icons
                    name={"chevron-small-right"}
                    family={"Entypo"}
                    color={COLORS.gray}
                    size={40}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Date;

const styles = StyleSheet.create({
  DateCard: {
    backgroundColor: "#323232",
    height: 120, 
    borderRadius: 20,
    marginTop: 15, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 25,
  },
  icn: {
    height: 95, 
    width: 95, 
    borderRadius: 20, 
  },
});