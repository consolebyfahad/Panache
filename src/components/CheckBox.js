import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';

import Icons from './Icons';

import {COLORS} from '../utils/COLORS';

const CheckBox = ({value, setValue}) => {
  return (
    <TouchableOpacity
      onPress={() => setValue(!value)}
      style={styles.mainContainer}>
      {value && (
        <View style={styles.empty}>
          <Icons family="Entypo" name="check" color={COLORS.white} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  mainContainer: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderWidth: 0.7,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: COLORS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
