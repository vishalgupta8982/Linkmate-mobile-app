export interface CommentResponse {
	comment: {
		id: string;
		userId: string;
		content: string;
		postId: string;
		createdAt: string;
	};
	commentUserDetail: {
		userId: string;
		firstName: string;
		lastName: string;
		username: string ;
		headline: string;
		profilePicture: string;
	};
}