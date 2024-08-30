 
export interface Post {
	post: {
		postId: String;
		userId: String;
		content: String | null;
		fileUrl: String | null;
		fileType: String | null;
		createdAt: String;
		comments: String[];
		likedBy: String[];
	},
	postUserDetail: {
		userId: String;
		firstName: string;
		lastName: string;
		username: string ;
		headline: string;
		profilePicture: string;
	};
}
