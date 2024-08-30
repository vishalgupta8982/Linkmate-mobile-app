export interface CommentResponse {
	comment: {
		id: String;
		userId: String;
		content: string;
		postId: string;
		createdAt: string;
	};
	commentUserDetail: {
		userId: String;
		firstName: string;
		lastName: string;
		username: string ;
		headline: string;
		profilePicture: string;
	};
}