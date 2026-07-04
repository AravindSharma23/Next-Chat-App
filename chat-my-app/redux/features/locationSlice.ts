import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveLocation } from "@/types";

type LocationState = {
  sharing: boolean;
  liveLocations: LiveLocation[];
};

const initialState: LocationState = {
  sharing: false,
  liveLocations: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSharing: (state, action: PayloadAction<boolean>) => {
      state.sharing = action.payload;
    },

    updateLiveLocation: (state, action: PayloadAction<LiveLocation>) => {
      const index = state.liveLocations.findIndex(
        (loc) => loc.userId === action.payload.userId
      );

      if (index !== -1) {
        state.liveLocations[index] = action.payload;
      } else {
        state.liveLocations.push(action.payload);
      }
    },

    clearLocations: (state) => {
      state.liveLocations = [];
    },
  },
});

export const { setSharing, updateLiveLocation, clearLocations } =
  locationSlice.actions;

export default locationSlice.reducer;