// chatsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	ChatHistoryResponse,
	ChatContent,
} from '../../types/Response/ChatHistoryResponse';
import { RootState } from '../store';

type ChatUserDetail = {
	firstName: string;
	lastName: string;
	username: string | null;
	headline: string;
	profilePicture: string;
};

type ChatsState = {
	messagesByUser: {
		[userId: string]: {
			messages: ChatContent[];
			page: number;
			hasMore: boolean;
		};
	};
	chatUserDetailsById: {
		[userId: string]: ChatUserDetail;
	};
	currentUserId: string | null;
};

const initialState: ChatsState = {
	messagesByUser: {},
	chatUserDetailsById: {},
	currentUserId: null,
};

const chatsSlice = createSlice({
	name: 'chats',
	initialState,
	reducers: {
		addMessages: (
			state,
			action: PayloadAction<{
				userId: string;
				messages: ChatContent[];
				chatUserDetail: ChatUserDetail;
				page: number;
				hasMore: boolean;
			}>
		) => {
			const { userId, messages, chatUserDetail, page, hasMore } =
				action.payload;
			if (!state.messagesByUser[userId]) {
				state.messagesByUser[userId] = { messages: [], page: 0, hasMore: true };
			}
			state.messagesByUser[userId].messages.push(...messages);
			state.messagesByUser[userId].page = page;
			state.messagesByUser[userId].hasMore = hasMore;
			state.chatUserDetailsById[userId] = chatUserDetail;
		},

		addWebSocketMessages: (
			state,
			action: PayloadAction<{
				userId: string;
				messages: ChatContent[];
			}>
		) => {
			const { userId, messages } = action.payload;
			console.log(userId, messages);
			if (!state.messagesByUser[userId]) {
				state.messagesByUser[userId] = { messages: [], page: 0, hasMore: true };
			}
			state.messagesByUser[userId].messages.unshift(...messages);
		},
		setCurrentUserId: (state, action: PayloadAction<string>) => {
			state.currentUserId = action.payload;
		},
		deleteStoreMessage: (
			state,
			action: PayloadAction<{ userId: string; messageId: string }>
		) => {
			const { userId, messageId } = action.payload;
			if (state.messagesByUser[userId]) {
				state.messagesByUser[userId].messages = state.messagesByUser[
					userId
				].messages.filter((message) => message.messageId !== messageId);
			}
		},
		markMessagesAsRead: (state, action: PayloadAction<{ userId: string }>) => {
			const { userId } = action.payload;
			if (state.messagesByUser[userId]) {
				console.log(userId)
				state.messagesByUser[userId].messages = state.messagesByUser[
					userId
				].messages.map((message) => ({ ...message, read: true }));
			}

		},
	},
});

export const {
	addMessages,
	setCurrentUserId,
	addWebSocketMessages,
	deleteStoreMessage,
	markMessagesAsRead,
} = chatsSlice.actions;

export const selectMessagesByUser = (state: RootState, userId: string) => {
	const chat = state.chats.messagesByUser[userId];
	return chat ? chat.messages : [];
};

export const selectChatUserDetailsById = (state: RootState, userId: string) => {
	return state.chats.chatUserDetailsById[userId];
};

export const selectChatPageByUser = (state: RootState, userId: string) => {
	return state.chats.messagesByUser[userId]?.page || 0;
};

export const selectHasMoreByUser = (state: RootState, userId: string) => {
	return state.chats.messagesByUser[userId]?.hasMore ?? true;
};

export default chatsSlice.reducer;
