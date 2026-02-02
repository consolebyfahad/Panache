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
    // When sending FormData, let axios set Content-Type with boundary
    const isFormData = logindata instanceof FormData;
    const headers = isFormData
      ? { Accept: "application/json" }
      : Headers.Header2;

    const result = await axios.post(
      "http://portal.ivmsgroup.com/panache/api.php",
      logindata,
      { headers }
    );
    return result;
  } catch (error) {
    console.error("Error making API request:", error);
    throw error;
  }
};
