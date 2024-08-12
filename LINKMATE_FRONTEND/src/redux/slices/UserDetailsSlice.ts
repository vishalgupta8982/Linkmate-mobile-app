import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '../../types/compoundTypes';

interface UserDetailsState {
	user: User | null;
}

const initialState: UserDetailsState = {
	user: null,
};

const userDetailsSlice = createSlice({
	name: 'userDetails',
	initialState,
	reducers: {
		setUserDetails(state, action: PayloadAction<User>) {
			state.user = action.payload;
		},
	},
});

export const { setUserDetails } = userDetailsSlice.actions;

export const selectUser = (state: RootState) => state.userDetails.user;

export default userDetailsSlice.reducer;
