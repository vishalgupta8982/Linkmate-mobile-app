import { getChatInteraction } from '../api/apis';
import {
	addInteraction,
	addWebSocketMessages,
	deleteStoreMessage,
	markMessagesAsRead,
	updateInteraction,
	updateMessageWithId,
} from '../redux/slices/ChatSlice';
import { setUnreadMessageCount } from '../redux/slices/CountNotificationMessage';
export const handleWebSocketChatMessage = (data: any, userId: string) => {
	return async (dispatch: any, getState: any) => {
		const state = getState();
		const { interactions } = state.chats;

		try {
			switch (data.messageType) {
				case 'MESSAGE_READ':
					dispatch(
						markMessagesAsRead({ userId: data.userId, newMessageCall: false })
					);
					break;

				case 'MESSAGE_TYPE_CHAT':
					const existingInteraction = interactions.find(
						(inter: any) => inter.userId === data.chat.senderId
					);
					if (userId !== data.chat.senderId) {
						if (existingInteraction) {
							dispatch(
								updateInteraction({
									userId: data.chat.senderId,
									lastMessage: data.chat,
									numberOfUnreadMessage: data.chat.read ? 0 : 1,
									id: userId,
								})
							);
							dispatch(
								addWebSocketMessages({
									userId: data.chat.senderId,
									messages: [data.chat],
								})
							);
						} else {
							const response = await fetchAndAddInteraction(data.chat.senderId);
							dispatch(response);
						}
						if (
							existingInteraction &&
							existingInteraction.numberOfUnreadMessage < 1
						) {
							dispatch(setUnreadMessageCount(1));
						}
					} else {
						dispatch(
							updateInteraction({
								userId: data.chat.receiverId,
								lastMessage: data.chat,
								numberOfUnreadMessage: 0,
								id: userId,
							})
						);
						dispatch(
							updateMessageWithId({
								userId: data.chat.receiverId,
								tempMessageId: data.tempId,
								messages: [data.chat],
							})
						);
					}
					break;
				case 'DELETE_MESSAGE_FOR_EVERYONE':
					if (data.status === 'Message deleted') {
						dispatch(
							deleteStoreMessage({
								userId:
									userId === data.messageRemover
										? data.messageNonRemover
										: data.messageRemover,
								messageId: data.messageId,
							})
						);
					}
					break;
				default:
					console.warn('Unknown message type:', data.messageType);
			}
		} catch (error) {
			console.error('Error handling WebSocket message:', error);
		}
	};
};

const fetchAndAddInteraction = (id) => {
	return async (dispatch) => {
		try {
			const response = await getChatInteraction();
			dispatch(addInteraction(response));
		const interaction=response.find((item) => item.userId === id);
		if(interaction.numberOfUnreadMessage>0){
			dispatch(setUnreadMessageCount(1))
		}
		} catch (error) {
			console.error('Error fetching interaction:', error);
		}
	};
};
