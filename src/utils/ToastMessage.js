import Toast from "react-native-simple-toast";
import Snackbar from "react-native-snackbar";
export const ToastMessage = (message) => {
  if (typeof message == "string") {
    Snackbar.show({
      text: message,
      duration: Snackbar.LENGTH_LONG,
    });
  } else return;
};
