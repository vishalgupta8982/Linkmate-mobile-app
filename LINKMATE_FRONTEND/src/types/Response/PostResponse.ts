import { userDetails } from '../../api/apis';

type UserDetail = {
  firstName: string;
  lastName: string;
  username: string | null;
  headline: string;
  profilePicture: string;
  userId: string;
};
export interface Post {
	postId: String;
	userDetail: UserDetail;
	content: String | null;
	fileUrl: String | null;
	fileType: String | null;
	createdAt: String;
	comments: String[];
	likedBy: String[];
}
