export interface Notification {
	id: string;
	userId: string;
	userProfilePicture: string;
	userName: string;
	post: string | null;
	read: boolean;
	createdAt: string ;
	notificationType: string;
}
