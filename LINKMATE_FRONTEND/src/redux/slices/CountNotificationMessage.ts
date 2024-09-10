import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface CountState {
	unreadNotificationCount: number;
	unreadMessageCount:number
}

const initialState: CountState = {
	unreadNotificationCount: 0,
	unreadMessageCount: 0,
};

export const countSlice = createSlice({
	name: 'count',
	initialState,
	reducers: {
		setUnreadNotificationCount(state, action: PayloadAction<number>) {
			state.unreadNotificationCount += action.payload ?? 1;
		},
		resetUnreadNotificationCount(state) {
			state.unreadNotificationCount = 0;
		},
		setUnreadMessageCount(state, action: PayloadAction<number>) {
			state.unreadMessageCount += action.payload ?? 1;
		},
		resetUnreadMessageCount(state) {
			state.unreadMessageCount = 0;
		},
	},
});

export const { setUnreadNotificationCount, resetUnreadNotificationCount,setUnreadMessageCount,resetUnreadMessageCount } =
	countSlice.actions;

export const selectNotificationCount = (state: RootState) =>
	state.count.unreadNotificationCount;

export default countSlice.reducer;
