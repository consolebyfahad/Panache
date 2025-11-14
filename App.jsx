import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { RootSiblingParent } from "react-native-root-siblings";
import { PersistGate } from "redux-persist/integration/react";
import messaging from "@react-native-firebase/messaging";
import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { StatusBar } from "react-native";
import { Provider, useSelector } from "react-redux";
import "intl-pluralrules";
import 'text-encoding';

import BrainBox from "./src/components/BrainBox";

import Notification from "./Notification";

import { getToken } from "./src/utils/constants";
import { persistor, store } from "./src/store";
import { COLORS } from "./src/utils/COLORS";
import Navigation from "./src/navigation";
import i18n from "./src/Language/i18n";
import { ThemeProvider } from "./src/context/ThemeContext";
import DatePopup from "./DatePopup";

const App = () => {
  const [isVisible, setVisible] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      setNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
      });
      setVisible(true);
    });

    return unsubscribe;
  }, []);
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setVisible(false);
      }, 4000);
    }
  }, [isVisible]);
  useEffect(() => {
    getToken();
  }, []);

  return (
    <RootSiblingParent>
      <ThemeProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.primaryColor}
        />
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <BrainBox>
                <NavigationContainer>
                  <Navigation />
                  <DatePopup />
                  {isVisible && (
                    <Notification
                      isVisible={isVisible}
                      title={notification?.title}
                      desc={notification?.body}
                    />
                  )}
                </NavigationContainer>
              </BrainBox>
            </PersistGate>
          </Provider>
        </I18nextProvider>
      </ThemeProvider>
    </RootSiblingParent>
  );
};

export default App;
