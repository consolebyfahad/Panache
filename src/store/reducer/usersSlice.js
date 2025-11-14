import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    userData: {},
    location: {},
    isCustomer: false,
  },
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setCustomer(state, action) {
      state.isCustomer = action.payload;
    },
  },
});

export const { setUserData, setLocation, setCustomer } = usersSlice.actions;
