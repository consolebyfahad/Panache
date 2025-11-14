import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  View,
  Text,
  Platform,
} from 'react-native';

import CustomButton from './CustomButton';
import CustomInput from './CustomInput';
import CustomModal from './CustomModal';
import CustomText from './CustomText';
import Icons from './Icons';

import {languages} from '../utils/Languages';
import {COLORS} from '../utils/COLORS';
import fonts from '../assets/fonts';

const LanguagePicker = ({
  values = [],
  setValues,
  placeholder = 'Select Languages',
  error,
  withLabel,
  isRequired,
  singleSelect = false,
}) => {
  const [isModal, setModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleToggleLanguage = language => {
    const isSelected = values?.some(lang => lang.name === language.name);

    if (singleSelect) {
      setValues(isSelected ? [] : [language]);
      setModal(false);
    } else {
      if (isSelected) {
        const filteredLanguages = values?.filter(
          lang => lang.name !== language.name,
        );
        setValues(filteredLanguages);
      } else {
        setValues([...values, language]);
      }
    }
  };

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {withLabel && (
        <Text style={styles.withLabelStyle}>
          {withLabel}
          {isRequired && <Text style={{color: COLORS.red}}> *</Text>}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.mainContainer,
          {
            marginBottom: error ? 5 : 20,
            borderColor: error ? COLORS.red : COLORS.lightGray,
          },
        ]}
        onPress={() => setModal(true)}>
        <CustomText
          label={
            values.length
              ? values?.map(lang => lang.name).join(', ')
              : placeholder
          }
          color={values?.length ? COLORS.black : COLORS.authText}
          textTransform="capitalize"
        />
      </TouchableOpacity>
      {error && (
        <CustomText label={error} color={COLORS.red} marginBottom={20} />
      )}
      <CustomModal isVisible={isModal} onDisable={() => setModal(false)}>
        <View style={styles.modalContainer}>
          <CustomInput
            placeholder="Search Language"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredLanguages.map(item => (
              <TouchableOpacity
                key={item.name}
                style={styles.item}
                onPress={() => handleToggleLanguage(item)}>
                <CustomText
                  label={item.name}
                  numberOfLines={1}
                  fontFamily={fonts.semiBold}
                />
                {values?.some(lang => lang.name === item.name) && (
                  <Icons
                    family="AntDesign"
                    name="checkcircle"
                    size={22}
                    style={{position: 'absolute', right: 15}}
                    color={COLORS.primaryColor}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          {!singleSelect && (
            <CustomButton
              title="Done"
              disabled={!values?.length}
              onPress={() => setModal(false)}
              marginBottom={isKeyboardVisible ? -100 : 20}
            />
          )}
        </View>
      </CustomModal>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: Platform.OS == 'android' ? 30 : 70,
    width: '100%',
    height: '100%',
  },
  item: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.white,
    borderBottomWidth: 0.6,
    borderBottomColor: COLORS.lightGray,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    position: 'relative',
  },
  withLabelStyle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: COLORS.black,
    marginBottom: 5,
  },
});

export default LanguagePicker;
