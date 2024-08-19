const WebSocketService = {
	socket: null,

	connect(url, token) {
		this.socket = new WebSocket(`${url}?token=${token}`);

		this.socket.onopen = () => {
			console.log('WebSocket connection opened');
		};

		this.socket.onmessage = (event) => {
			console.log('Message received:', event.data);
			const message = JSON.parse(event.data);
			this.handleMessage(message);
		};

		this.socket.onclose = () => {
			console.log('WebSocket connection closed');
		};

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
};

export default WebSocketService;
