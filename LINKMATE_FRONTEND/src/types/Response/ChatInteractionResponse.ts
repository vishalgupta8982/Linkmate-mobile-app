export interface chatInteraction {
	userId: String;
	username: String;
	firstName: String;
	lastName: String;
	profilePicture: String;
	numberOfUnreadMessage: number;
	lastMessage: {
		messageId: string;
		senderId: string;
		receiverId: string;
		messageContent: string;
		createdAt: string;
		messageType: string;
		status: string;
		replyToMessageId: string;
		read: boolean;
	};
}
export interface chatUser{
	interaction:chatInteraction[]
}