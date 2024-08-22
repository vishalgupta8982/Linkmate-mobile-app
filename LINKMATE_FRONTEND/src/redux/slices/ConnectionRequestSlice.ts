import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ConnectionRequest {
	userId: string;
	username: string;
	firstName: string;
	lastName: string;
	profilePicture: string;
	headline: string;
}

interface AuthState {
	connectionRequests: ConnectionRequest[];
}

const initialState: AuthState = {
	connectionRequests: [], // Initialize as an empty array
};

export const connectionRequestSlice = createSlice({
	name: 'connectionRqst',
	initialState,
	reducers: {
		addConnectionRequests(state, action: PayloadAction<ConnectionRequest[]>) {
			const newRequests = action.payload;
			newRequests.forEach((newRequest) => {
				const existingRequestIndex = state.connectionRequests.findIndex(
					(req) => req.userId === newRequest.userId
				);
				if (existingRequestIndex === -1) {
					state.connectionRequests.push(newRequest); // Add new request to the array
				}
			});
		},
		updateConnectionRequests(
			state,
			action: PayloadAction<ConnectionRequest[]>
		) {
			const newRequests = action.payload;
			state.connectionRequests.push(...newRequests);
		},
		clearConnectionRequests(state) {
			state.connectionRequests = []; // Clear the array
		},
	},
});

export const {
	addConnectionRequests,
	updateConnectionRequests,
	clearConnectionRequests,
} = connectionRequestSlice.actions;

// Selector to get all connection requests
export const selectConnectionRequests = (state: RootState) =>
	state.connectionRqst.connectionRequests;

export default connectionRequestSlice.reducer;
