import { Alert } from 'react-native';
import { updateConnectionRequests } from '../redux/slices/ConnectionRequestSlice';
import { addWebSocketMessages, markMessagesAsRead } from '../redux/slices/ChatSlice';
 
 

const WebSocketService = {
	chatSocket: null,
	connectionSocket: null,

	connectChat(url, token, dispatch, userId) {
		this.chatSocket = new WebSocket(`${url}?token=${token}`);

		this.chatSocket.onopen = () => {
			console.log('Chat WebSocket connection opened');
		};

		this.chatSocket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.messageType == 'MESSAGE_READ') {
					console.log(data)
					 dispatch(
							markMessagesAsRead({ userId: data.userId })
						);
				} else if (data.messageType == 'MESSAGE_TYPE_CHAT') {
					dispatch(
						addWebSocketMessages({
							userId:
								userId == data.chat.senderId
									? data.chat.receiverId
									: data.chat.senderId,
							messages: [data.chat],
						})
					);
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
		}, 5000); // Adjust the delay as needed
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
