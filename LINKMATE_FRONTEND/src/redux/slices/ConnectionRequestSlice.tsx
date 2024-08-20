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
	connectionRequests: Record<string, ConnectionRequest>;  
}

const initialState: AuthState = {
	connectionRequests: {},  
};

export const connectionRequestSlice = createSlice({
	name: 'connectionRqst',
	initialState,
	reducers: {
		addConnectionRequest(state, action: PayloadAction<ConnectionRequest>) {
			const newRequest = action.payload;
			state.connectionRequests[newRequest.userId] = newRequest;
		},
		clearConnectionRequests(state) {
			state.connectionRequests = {};
		},
	},
});

export const {
	addConnectionRequest,
	setConnectionRequests,
	clearConnectionRequests,
} = connectionRequestSlice.actions;

// Selector to get all connection requests
export const selectConnectionRequests = (state: RootState) =>
	Object.values(state.connectionRqst.connectionRequests);

export default connectionRequestSlice.reducer;
