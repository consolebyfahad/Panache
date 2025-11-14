import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';

import CustomText from './CustomText';

import {Images} from '../assets/images';
import {COLORS} from '../utils/COLORS';
import fonts from '../assets/fonts';

const EditWithText = ({title, onPress, marginBottom = 20, marginTop = 0}) => {
  return (
    <View style={[styles.mainContainer, {marginTop, marginBottom}]}>
      <CustomText
        label={title}
        fontFamily={fonts.medium}
        color={COLORS.primaryColor}
      />
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        <Image source={Images.edit} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default EditWithText;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: COLORS.primaryColor,
  },
});
