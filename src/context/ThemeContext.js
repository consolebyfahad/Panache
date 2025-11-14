import React, { useState, createContext, useContext } from "react";
import { COLORS, DARK_COLORS } from "../utils/COLORS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { useEffect } from "react";

// Create the ThemeContext
export const ThemeContext = createContext();

// ThemeProvider component that will wrap the app
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = async () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode((prevMode) => !prevMode);
    try {
      await AsyncStorage.setItem("theme", newTheme); // Save new theme
    } catch (error) {
      console.log("Failed to save theme:", error);
    }
  };
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme"); // Get saved theme
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === "dark"); // Apply saved theme if it exists
        } else {
          const deviceTheme = Appearance.getColorScheme(); // Check device theme
          setIsDarkMode(deviceTheme === "dark");
        }
      } catch (error) {
        console.log("Failed to load theme:", error);
      }
    };

    loadTheme();

    // Add listener for device theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem("theme").then((storedTheme) => {
        if (!storedTheme) {
          setIsDarkMode(colorScheme === "dark");
        }
      });
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colors: isDarkMode ? DARK_COLORS : COLORS,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);
