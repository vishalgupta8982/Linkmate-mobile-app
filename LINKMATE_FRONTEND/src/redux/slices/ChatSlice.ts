import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatContent } from '../../types/Response/ChatHistoryResponse';
import { RootState } from '../store';
import { chatInteraction } from '../../types/Response/ChatInteractionResponse';
import { getChatInteraction } from '../../api/apis';

type ChatsState = {
	messagesByUser: {
		[userId: string]: {
			messages: ChatContent[];
			page: number;
			hasMore: boolean;
		};
	};
	interactions: chatInteraction[];
	currentUserId: string | null;
};

const initialState: ChatsState = {
	messagesByUser: {},
	currentUserId: null,
	interactions: [],
};

const chatsSlice = createSlice({
	name: 'chats',
	initialState,
	reducers: {
		addInteraction: (
			state,
			action: PayloadAction<
				{
					userId: string;
					lastMessage: ChatContent;
					username: string;
					firstName: string;
					lastName: string;
					profilePicture: string;
					numberOfUnreadMessage: number;
				}[]
			>
		) => {
			const newInteractions = action.payload;

			state.interactions = newInteractions.map((interaction) => {
				const {
					userId,
					lastMessage,
					username,
					firstName,
					lastName,
					profilePicture,
					numberOfUnreadMessage,
				} = interaction;
				return {
					userId,
					username,
					firstName,
					lastName,
					profilePicture,
					numberOfUnreadMessage,
					lastMessage,
				};
			});
		},

		updateInteraction: (
			state,
			action: PayloadAction<{
				userId: string;
				lastMessage: ChatContent;
				numberOfUnreadMessage: number;
				id: string;
			}>
		) => {
			const { userId, lastMessage, numberOfUnreadMessage, id } = action.payload;
			const existingInteractionIndex = state.interactions.findIndex(
				(inter) => inter.userId === userId
			);
			if (existingInteractionIndex !== -1) {
				const existingInteraction =
					state.interactions[existingInteractionIndex];
				const updatedInteraction = {
					...existingInteraction,
					lastMessage,
					numberOfUnreadMessage: numberOfUnreadMessage
						? existingInteraction.numberOfUnreadMessage + 1
						: existingInteraction.numberOfUnreadMessage,
				};
				state.interactions.splice(existingInteractionIndex, 1);
				state.interactions.unshift(updatedInteraction);
			}
		},
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
			if (!state.messagesByUser[userId]) {
				return;
			}
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
			const interactionIndex = state.interactions.findIndex(
				(interaction) => interaction.userId === userId
			);
			if (interactionIndex !== -1) {
				state.interactions[interactionIndex].numberOfUnreadMessage = 0;
				if(!newMessageCall)
				state.interactions[interactionIndex].lastMessage.read=true;
			}
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
	addInteraction,
	updateInteraction,
	addMessages,
	setCurrentUserId,
	addWebSocketMessages,
	deleteStoreMessage,
	markMessagesAsRead,
	deleteChatHistory,
	updateMessageWithId,
	addPendingMessage,
} = chatsSlice.actions;

export const selectInteractions = (state: RootState) => {
	const chatInteraction = state.chats.interactions;
	return chatInteraction ? chatInteraction : [];
};

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
