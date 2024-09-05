import { Alert } from 'react-native';
import { updateConnectionRequests } from '../redux/slices/ConnectionRequestSlice';
import {
	addWebSocketMessages,
	deleteStoreMessage,
	markMessagesAsRead,
	updateMessageWithId,
} from '../redux/slices/ChatSlice';
const WebSocketService = {
	chatSocket: null,
	connectionSocket: null,

	connectChat(url:string, token:string, dispatch:any, userId:string) {
		this.chatSocket = new WebSocket(`${url}?token=${token}`);

		this.chatSocket.onopen = () => {
			console.log('Chat WebSocket connection opened');
		};

		this.chatSocket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				switch (data.messageType) {
					case 'MESSAGE_READ':
						dispatch(
							markMessagesAsRead({ userId: data.userId, newMessageCall: false })
						);
						break;

					case 'MESSAGE_TYPE_CHAT':
						if (userId !== data.chat.senderId) {
							dispatch(
								addWebSocketMessages({
									userId: data.chat.senderId,
									messages: [data.chat],
								})
							);
						} else {
							dispatch(
								updateMessageWithId({
									userId: data.chat.receiverId,
									messages: [data.chat],
									tempMessageId: data.tempId,
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
				console.error('Error parsing chat message:', error);
			}
		};

		this.chatSocket.onclose = (event) => {
			console.log('Chat WebSocket connection closed');
			if (!event.wasClean) {
				console.log('Attempting to reconnect chat...');
				this.reconnectChat(url, token, dispatch);
			}
		};

		this.chatSocket.onerror = (error) => {
			console.error('Chat WebSocket error:', error);
		};
	},

	connectConnection(url, token, dispatch, userId) {
		this.connectionSocket = new WebSocket(`${url}?token=${token}`);

		this.connectionSocket.onopen = () => {
			console.log('Connection WebSocket connection opened');
		};

		this.connectionSocket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log('Received connection request:', data);
				dispatch(updateConnectionRequests(data.data));
				this.handleConnectionMessage(data);
			} catch (error) {
				console.error('Error parsing connection request:', error);
			}
		};

		this.connectionSocket.onclose = (event) => {
			console.log('Connection WebSocket connection closed');
			if (!event.wasClean) {
				console.log('Attempting to reconnect connection...');
				this.reconnectConnection(url, token, dispatch);
			}
		};

		this.connectionSocket.onerror = (error) => {
			console.error('Connection WebSocket error:', error);
		};
	},

	reconnectChat(url, token, dispatch) {
		setTimeout(() => {
			this.connectChat(url, token, dispatch);
		}, 5000); 
	},

	reconnectConnection(url, token, dispatch) {
		setTimeout(() => {
			this.connectConnection(url, token, dispatch);
		}, 5000); // Adjust the delay as needed
	},

	handleConnectionMessage(data) {
		if (data.action === 'sendRequest') {
			Alert.alert(data.message);
		}
	},

	sendChatMessage(messageType, messageContent) {
		if (this.chatSocket && this.chatSocket.readyState === WebSocket.OPEN) {
			const message = {
				type: messageType,
				...messageContent,
			};
			this.chatSocket.send(JSON.stringify(message));
		} else {
			console.warn('Chat WebSocket is not open');
		}
	},

	sendConnectionRequest(data) {
		if (
			this.connectionSocket &&
			this.connectionSocket.readyState === WebSocket.OPEN
		) {
			this.connectionSocket.send(JSON.stringify(data));
		} else {
			console.warn('Connection WebSocket is not open');
		}
	},

	disconnect() {
		if (this.chatSocket) {
			this.chatSocket.close();
			console.log('Chat WebSocket connection disconnected');
		}
		if (this.connectionSocket) {
			this.connectionSocket.close();
			console.log('Connection WebSocket connection disconnected');
		}
	},
};

export default WebSocketService;
