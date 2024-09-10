
export interface ChatContent {
	messageId: string;
	senderId: string;
	receiverId: string;
	messageContent: string;
	createdAt: string;  
	messageType: string ;
	status: string ;
	replyToMessageId: string;
	read: boolean;
}

interface Sort {
	empty: boolean;
	sorted: boolean;
	unsorted: boolean;
}

interface Pageable {
	pageNumber: number;
	pageSize: number;
	sort: Sort;
	offset: number;
	paged: boolean;
	unpaged: boolean;
}
 

interface ChatReceiverUserDetail {
	userId: string;
	profilePicture: string;
	firstName: string;
	lastName: string;
	headline: string;
	username: string;
}

export interface ChatHistoryResponse {
	totalPages: number;
	totalElements: number;
	size: number;
	content: ChatContent[];
	number: number;
	sort: Sort;
	first: boolean;
	last: boolean;
	numberOfElements: number;
	pageable: Pageable;
	empty: boolean;
}
