import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';

import CustomModal from './CustomModal';
import CustomText from './CustomText';
import Icons from './Icons';

import {COLORS} from '../utils/COLORS';
import fonts from '../assets/fonts';
import CustomButton from './CustomButton';

const SelectModalValue = ({
  data,
  value,
  setValue,
  placeholder,
  error,
  withLabel,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      {withLabel && (
        <CustomText
          label={withLabel}
          fontFamily={fonts.medium}
          marginBottom={8}
          color={COLORS.inputLabel}
        />
      )}
      <View
        style={[
          styles.dropdownMainContainer,
          {
            marginBottom: error ? 5 : 15,
            borderColor: error ? COLORS.red : COLORS.inputBg,
          },
        ]}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => setModalVisible(true)}>
          <CustomText
            label={value?.length ? value?.[0] : placeholder}
            fontSize={12}
            color={value?.length ? COLORS.black : COLORS.inputLabel}
          />
          <Icons
            style={{color: COLORS.gray, fontSize: 20}}
            family="Entypo"
            name="chevron-down"
          />
        </TouchableOpacity>
        <CustomModal
          isVisible={isModalVisible}
          onDisable={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.row}>
              <View style={{width: 25}} />
              <CustomText label={withLabel} />
              <Icons
                family="Entypo"
                name="circle-with-cross"
                color={COLORS.red}
                size={25}
                onPress={() => {
                  setValue([]);
                  setModalVisible(false);
                }}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {data?.map((item, i) => (
                <TouchableOpacity
                  style={styles.list}
                  key={i}
                  onPress={() => {
                    if (value?.includes(item)) {
                      setValue(value.filter(val => val !== item));
                    } else {
                      setValue([...value, item]);
                    }
                  }}>
                  <CustomText
                    label={item?._id ? item.title : item}
                    fontSize={12}
                    color={COLORS.black}
                  />
                  {value?.includes(item) && (
                    <Icons
                      family="AntDesign"
                      name="checkcircle"
                      color={COLORS.primaryColor}
                      size={22}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <CustomButton
              title="Done"
              onPress={() => setModalVisible(false)}
              marginBottom={15}
              marginTop={15}
              disabled={!value?.length}
            />
          </View>
        </CustomModal>
      </View>
      {error && (
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

export default SelectModalValue;

const styles = StyleSheet.create({
  dropdownMainContainer: {
    width: '100%',
    maxHeight: 200,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    height: 52,
    backgroundColor: COLORS.inputBg,
  },
  list: {
    backgroundColor: COLORS.white,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    padding: 20,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: 40,
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
});
