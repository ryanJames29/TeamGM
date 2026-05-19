import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { MajorLeague } from '@/mock-data/types/scores';

type ScoresState = {
  selectedLeague: MajorLeague;
};

const initialState: ScoresState = {
  selectedLeague: 'nfl',
};

const scoresSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {
    setSelectedLeague(state, action: PayloadAction<MajorLeague>) {
      state.selectedLeague = action.payload;
    },
  },
});

export const { setSelectedLeague } = scoresSlice.actions;
export const scoresReducer = scoresSlice.reducer;

export const selectSelectedLeague = (state: { scores: ScoresState }) =>
  state.scores.selectedLeague;
