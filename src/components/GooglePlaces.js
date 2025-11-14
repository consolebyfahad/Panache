import React, { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";

import CustomInput from "./CustomInput";
import CustomText from "./CustomText";

import { COLORS } from "../utils/COLORS";
import fonts from "../assets/fonts";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

const GooglePlaces = ({
  value,
  setValue,
  setState,
  setLatLong,
  withLabel,
  error,
  placeholder = "Address",
  setCity,
  setZipCode,
  setCountry,
}) => {
  const mapRef = useRef(null);
  const isFocused = useIsFocused();
  const currentLocation = useSelector((state) => state.users.location);
  const [searchQuery, setSearchQuery] = useState(value);
  const [predictions, setPredictions] = useState([]);
  const [latitudeLongitude, setLatitudeLongitude] = useState({});
  const [loading, setLoading] = useState(false);
  const { colors, toggleTheme, isDarkMode } = useTheme();

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);
  const apiKey = "AIzaSyCZLtofoePX_DcD3LIoSYvBg4sKVU-JZR4";

  const handleSearch = async (text) => {
    setLoading(true);
    setSearchQuery(text);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${text}`
      );
      const data = await response.json();
      if (data.predictions) {
        setPredictions(data.predictions);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching predictions", error);
    }
  };
  const handlePredictionPress = (item) => {
    setValue(item?.description);

    const fetchPlaceDetails = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?key=${apiKey}&place_id=${item.place_id}`
        );
        const data = await response.json();

        if (data.result && data.result.address_components) {
          const addressComponents = data.result.address_components;

          // Extract state
          const stateComponent = addressComponents.find((component) =>
            component.types.includes("administrative_area_level_1")
          );
          const state = stateComponent ? stateComponent.long_name : null;
          setState?.(state);

          // Extract city
          const cityComponent = addressComponents.find((component) =>
            component.types.includes("locality")
          );
          const city = cityComponent ? cityComponent.long_name : null;
          setCity?.(city);

          // Extract ZIP code
          const zipComponent = addressComponents.find((component) =>
            component.types.includes("postal_code")
          );
          const zipCode = zipComponent ? zipComponent.long_name : null;
          setZipCode?.(zipCode);

          // Extract country
          const countryComponent = addressComponents.find((component) =>
            component.types.includes("country")
          );
          const country = countryComponent ? countryComponent.long_name : null;
          setCountry?.(country);

          // Set latitude and longitude
          if (data.result.geometry && data.result.geometry.location) {
            const { lat, lng } = data.result.geometry.location;
            setLatLong?.({ latitude: lat, longitude: lng });
            setLatitudeLongitude({ latitude: lat, longitude: lng });
          } else {
            console.error(
              "Location information not available in the detailed place data"
            );
          }

          setSearchQuery(item.description);
          setPredictions([]);
        } else {
          console.error(
            "Address components not available in the detailed place data"
          );
        }
      } catch (error) {
        console.error("Error fetching place details", error);
      }
    };

    fetchPlaceDetails();
  };

  useEffect(() => {
    if (
      (latitudeLongitude?.latitude && latitudeLongitude?.longitude) ||
      (currentLocation?.latitude && currentLocation?.longitude)
    ) {
      mapRef.current?.animateToRegion(
        {
          latitude: latitudeLongitude?.latitude || 52.3555,
          longitude: latitudeLongitude?.longitude || 1.1743,
          latitudeDelta: 0.545,
          longitudeDelta: 0.545,
        },
        1000
      );
    }
  }, [latitudeLongitude, isFocused]);

  return (
    <>
      <CustomInput
        placeholder={placeholder}
        withLabel={withLabel}
        value={searchQuery}
        labelColo={COLORS.black}
        isError={error}
        marginBottom={predictions?.length ? 0.1 : error ? 5 : 20}
        onChangeText={(text) => handleSearch(text)}
      />

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          color={COLORS.primaryColor}
          size="large"
        />
      ) : (
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <FlatList
            data={predictions}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handlePredictionPress(item)}
              >
                <CustomText
                  fontFamily={fonts.semiBold}
                  fontSize={12}
                  label={item.description}
                  color={colors.black}
                />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}

      {error && !predictions?.length && (
        <CustomText
          label={error}
          color={COLORS.red}
          fontFamily={fonts.semiBold}
          fontSize={10}
          marginBottom={15}
        />
      )}
    </>
  );
};

export default GooglePlaces;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 20,
    width: "100%",
  },
  mainContainer1: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 17,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemContainer: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    width: width,
    borderBottomColor: COLORS.authText,
    borderBottomWidth: 1,
  },
  input: {
    width: "98%",
    height: "100%",
    justifyContent: "center",
  },
  leftIcon: {
    width: 17,
    height: 17,
    resizeMode: "contain",
  },
  modalMainContainer: {
    alignSelf: "center",
    width: "95%",
    height: "99%",
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 15,
  },
});
