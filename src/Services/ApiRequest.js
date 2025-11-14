import axios from "axios";

const Headers = {
  Header: {
    "Content-Type": "application/json",
  },
  Header2: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
};
export const ApiRequest = async (logindata) => {
  try {
    const result = await axios.post(
      "http://portal.ivmsgroup.com/panache/api.php",
      logindata,
      {
        headers: Headers.Header2,
      }
    );
    return result;
  } catch (error) {
    console.error("Error making API request:", error);
    throw error;
  }
};
