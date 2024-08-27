export interface chatHistoryResponse {
	messageId: String;
	senderId: String;
	receiverId: String;
	messageContent: String;
	createdAt: String;
	messageType: String;
	status: String  ;
	replyToMessageId: String | null;
	read: boolean;
}