import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	ChatContent,
} from '../../types/Response/ChatHistoryResponse';
import { RootState } from '../store';

type ChatsState = {
	messagesByUser: {
		[userId: string]: {
			messages: ChatContent[];
			page: number;
			hasMore: boolean;
		};
	};
	currentUserId: string | null;
};

const initialState: ChatsState = {
	messagesByUser: {},
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
				page: number;
				hasMore: boolean;
			}>
		) => {
			const { userId, messages, page, hasMore } = action.payload;
			if (!state.messagesByUser[userId]) {
				state.messagesByUser[userId] = { messages: [], page: 0, hasMore: true };
			}
			state.messagesByUser[userId].messages.push(...messages);
			state.messagesByUser[userId].page = page;
			state.messagesByUser[userId].hasMore = hasMore;
		},
		addPendingMessage: (
			state,
			action: PayloadAction<{
				userId: string;
				message: ChatContent;
			}>
		) => {
			const { userId, message } = action.payload;
			console.log(userId, message);
			if (!state.messagesByUser[userId]) {
				state.messagesByUser[userId] = { messages: [], page: 0, hasMore: true };
			}
			state.messagesByUser[userId].messages.unshift(message);
		},
		addWebSocketMessages: (
			state,
			action: PayloadAction<{
				userId: string;
				messages: ChatContent[];
			}>
		) => {
			const { userId, messages } = action.payload;
			state.messagesByUser[userId].messages.unshift(...messages);
		},
		updateMessageWithId: (
			state,
			action: PayloadAction<{
				userId: string;
				tempMessageId: string;
				messages: ChatContent;
			}>
		) => {
			const { userId, tempMessageId, messages } = action.payload;
			console.log(userId, tempMessageId, messages);
			if (state.messagesByUser[userId]) {
				const index = state.messagesByUser[userId].messages.findIndex(
					(msg) => msg.messageId === tempMessageId
				);
				if (index !== -1) {
					state.messagesByUser[userId].messages[index] = {
						...state.messagesByUser[userId].messages[index],
						...messages,
						status: 'sent',
					};
				}
			}
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
		markMessagesAsRead: (
			state,
			action: PayloadAction<{ userId: string; newMessageCall: boolean }>
		) => {
			const { userId, newMessageCall } = action.payload;
			if (state.messagesByUser[userId]) {
				state.messagesByUser[userId].messages = state.messagesByUser[
					userId
				].messages.map((message) => {
					if (message.senderId !== userId && !newMessageCall) {
						return { ...message, read: true };
					} else if (message.senderId == userId && newMessageCall) {
						return { ...message, read: true };
					}
					return message;
				});
			}
		},
		deleteChatHistory: (state, action: PayloadAction<{ userId: string }>) => {
			const { userId } = action.payload;
			delete state.messagesByUser[userId];
		},
	},
});

export const {
	addMessages,
	setCurrentUserId,
	addWebSocketMessages,
	deleteStoreMessage,
	markMessagesAsRead,
	deleteChatHistory,
	updateMessageWithId,
	addPendingMessage,
} = chatsSlice.actions;

export const selectMessagesByUser = (state: RootState, userId: string) => {
	const chat = state.chats.messagesByUser[userId];
	return chat ? chat.messages : [];
};


export const selectChatPageByUser = (state: RootState, userId: string) => {
	return state.chats.messagesByUser[userId]?.page || 0;
};

export const selectHasMoreByUser = (state: RootState, userId: string) => {
	return state.chats.messagesByUser[userId]?.hasMore ?? true;
};
export const doesUserExistInChats = (
	state: RootState,
	userId: string
): boolean => {
	return !!state.chats.messagesByUser[userId];
};
export default chatsSlice.reducer;
