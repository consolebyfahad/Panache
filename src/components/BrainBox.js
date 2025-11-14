import {PermissionsAndroid, Platform, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch} from 'react-redux';
import React, {useEffect} from 'react';

import {setLocation} from '../store/reducer/usersSlice';

const BrainBox = ({children}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      }
    };
    requestLocationPermission();
  }, []);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        dispatch(
          setLocation({
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
          }),
        );
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  return <View style={{flex: 1}}>{children}</View>;
};

export default BrainBox;
