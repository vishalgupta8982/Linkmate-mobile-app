import { Alert } from "react-native";
import { displayNotification } from "./DisplayNotification";
import { addConnectionRequest, mergeConnectionRequests, setConnectionRequest, updateConnectionRequests } from "../redux/slices/ConnectionRequestSlice";
import { useDispatch } from "react-redux";
 
const WebSocketService = {
	socket: null,

	connect(url, token, dispatch) {
		this.socket = new WebSocket(`${url}?token=${token}`);

		this.socket.onopen = () => {
			console.log('WebSocket connection opened');
		};

		(this.socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			dispatch(updateConnectionRequests(data.data));
			displayNotification(data.data);
			this.socket.onclose = () => {
				console.log('WebSocket connection closed');
			};

			this.socket.onerror = (error) => {
				console.error('WebSocket error:', error);
			};
		}),
			(this.socket.onclose = () => {
				console.log('WebSocket connection closed');
			});

		this.socket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};
	},

	handleMessage(message) {
		console.log('Handling message:', message);
		if (message.action === 'sendRequest') {
			Alert.alert(message.message);
		}
	},

	send(data) {
		if (this.socket && this.socket.readyState === WebSocket.OPEN) {
			this.socket.send(JSON.stringify(data));
		} else {
			console.warn('WebSocket is not open');
		}
	},
	disconnect() {
		if (this.socket) {
			this.socket.close();
			console.log('WebSocket connection disconnected');
		}
	},
};

export default WebSocketService;
