 
export interface Post {
	post: {
		postId: string;
		userId: string;
		content: string ;
		fileUrl: string ;
		fileType: string ;
		createdAt: string;
		comments: string[];
		likedBy: string[];
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
