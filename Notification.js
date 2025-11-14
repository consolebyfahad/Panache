import {StyleSheet, View, Image, Dimensions} from 'react-native';
import React from 'react';

import CustomText from './src/components/CustomText';

import {COLORS} from './src/utils/COLORS';
import fonts from './src/assets/fonts';
import { image } from './src/assets/images';

const {width, height} = Dimensions.get('window');

const Notification = ({title, desc, isVisible}) => {
  return (
    <>
      {isVisible ? (
        <View style={styles.mainContainer}>
          <View style={styles.Container}>
            <Image source={image.appIcon} style={styles.appIcon} />
            <View style={{width: '82%'}}>
              <CustomText
                label={title}
                fontFamily={fonts.semiBold}
                fontSize={18}
                color={COLORS.white}
                numberOfLines={1}
                marginBottom={5}
              />
              <CustomText
                label={desc}
                color={COLORS.white}
                fontFamily={fonts.medium}
                numberOfLines={1}
              />
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 9999,
    width,
    height: height / 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  Container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 15,
    backgroundColor:'#323232',
    elevation: 2,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    resizeMode: 'contain',
  },
});

export default Notification;
