import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface CountState {
	notificationCount: number;
}

const initialState: CountState = {
	notificationCount: 0,
};

export const countSlice = createSlice({
	name: 'count',
	initialState,
	reducers: {
		setNotificationCount(state, action: PayloadAction<number>) {
			state.notificationCount += action.payload ?? 1;
		},
		resetNotificationCount(state, action: PayloadAction<number>) {
			state.notificationCount =0;
		},
	},
});

export const { setNotificationCount, resetNotificationCount } = countSlice.actions;

export const selectNotificationCount = (state: RootState) =>
	state.count.notificationCount;

export default countSlice.reducer;
