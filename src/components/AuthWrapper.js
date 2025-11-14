import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyleSheet} from 'react-native';
import React from 'react';

import ImageFast from './ImageFast';
import {Images} from '../assets/images';
import CustomText from './CustomText';
import fonts from '../assets/fonts';
import {COLORS} from '../utils/COLORS';

const AuthWrapper = ({
  children,
  scrollEnabled = false,
  heading = '',
  desc = '',
}) => {
  return (
    <KeyboardAwareScrollView
      scrollEnabled={scrollEnabled}
      style={{flex: 1}}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      <ImageFast
        style={styles.logo}
        resizeMode="contain"
        source={Images.logoIcon}
      />
      <CustomText
        label={heading}
        fontFamily={fonts.boldExtra}
        fontSize={28}
        marginTop={20}
        marginBottom={5}
      />
      <CustomText
        label={desc}
        fontSize={16}
        color={COLORS.gray}
        marginBottom={30}
      />

      {children}
    </KeyboardAwareScrollView>
  );
};

export default AuthWrapper;
const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 60,
    marginTop: 20,
    alignSelf: 'center',
  },
});
