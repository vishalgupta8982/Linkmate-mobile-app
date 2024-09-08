import axios from 'axios';
import { SignUpPayload } from '../types/Payload/SignUpPayload';
import { verifyOtpResponse } from '../types/Response/VerifyOtpResponse';
import { del, get, post, put } from './instance';
import { LoginPayload } from '../types/Payload/LoginPayload';
import { OtpPayload } from '../types/Payload/OtpPayload';
import { User } from '../types/compoundTypes';
import { UpdatePayload } from '../types/Payload/updatePayload';
import { EducationPayload } from '../types/Payload/EducationPayload';
import { ExperiencePayload } from '../types/Payload/ExperiencePayload';
import { ProjectPayload } from '../types/Payload/ProjectPayload';
import { Search } from '../types/Response/SearchReponse';
import { Post } from '../types/Response/PostResponse';
import { PostDataResponse } from '../types/Response/GetPostResponse';
import { CommentPayload } from '../types/Payload/CommentPayload';
import { chatInteraction } from '../types/Response/ChatInteractionResponse';
import { ChatHistoryResponse } from '../types/Response/ChatHistoryResponse';
import { CommentResponse } from '../types/Response/CommentResponse';
import { Notification } from '../types/Response/NotificationResponse';
export const userLogin = async (
	payload: LoginPayload
): Promise<verifyOtpResponse> => {
	const url = '/users/login';
	return await post<verifyOtpResponse>(url, payload);
};

export const userRegister = async (payload: SignUpPayload) => {
	const url = '/users/register';
	return await post<verifyOtpResponse>(url, payload);
};

export const verifyOtp = async (payload: OtpPayload) => {
	const url = `/users/verify-otp?otp=${payload.otp}`;
	return await post<verifyOtpResponse>(url, payload);
};
export const saveFcmToken = async (fcmToken: string) => {
	const url = `/fcmToken/save?fcmToken=${fcmToken}`;
	return await post<string>(url);
};
export const deleteFcmToken = async () => {
	const url = `/fcmToken/delete`;
	return await del<string>(url);
};
export const userDetails = async () => {
	const url = '/users/user-details';
	return await get<User>(url);
};
export const updateUserDetails = async (payload: UpdatePayload) => {
	const url = '/users/update';
	return await put<String>(url, payload);
};
export const updateProfilePicture = async (payload: any) => {
	const formData = new FormData();
	formData.append('profilePicture', {
		uri: payload,
		name: 'image.png',
		fileName: 'image',
		type: 'image/png',
	});
	const url = '/users/update/profile';
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	};

	return await put<User>(url, formData, config);
};

export const deleteExperience = async (id: string) => {
	const url = `/users/delete/experience?experienceId=${id}`;
	return await del<User>(url);
};
export const deleteEducation = async (id: string) => {
	const url = `/users/delete/education?educationId=${id}`;
	return await del<User>(url);
};
export const deleteProject = async (id: string) => {
	const url = `/users/delete/project?projectId=${id}`;
	return await del<User>(url);
};
export const deleteSkill = async (skill: string) => {
	const url = `/users/delete/skill?skill=${skill}`;
	return await del<User>(url);
};
export const addSkill = async (skill: string[]) => {
	const url = '/users/update/skills';
	return await put<User>(url, skill);
};
export const addEducation = async (payload: EducationPayload) => {
	const url = '/users/update/education';
	return await put<User>(url, [payload]);
};
export const addExperience = async (payload: ExperiencePayload) => {
	const url = '/users/update/experience';
	return await put<User>(url, [payload]);
};
export const addProject = async (payload: ProjectPayload) => {
	const url = '/users/update/project';
	return await put<User>(url, [payload]);
};
export const updateEducation = async (
	educationId: string,
	payload: EducationPayload
) => {
	const url = `/users/update/education`;
	return await put<User>(url, [payload]);
};
export const updateExperience = async (
	experienceId: string,
	payload: ExperiencePayload
) => {
	const url = `/users/update/experience`;
	return await put<User>(url, [payload]);
};
export const updateProject = async (
	projectId: string,
	payload: ProjectPayload
) => {
	const url = `/users/update/project`;
	return await put<User>(url, [payload]);
};
export const searchUser = async (query: string) => {
	const url = `/users/search?query=${query}`;
	return await get<Search>(url);
};
export const getSearchUserDetail = async (username: string) => {
	const url = `/users/search-user-details?username=${username}`;
	return await get<User>(url);
};
export const getMyConnections = async (userId:string) => {
	const url = `/connections/my-connections/${userId}`;
	return await get<Search>(url);
};
export const sendConnectionRequest = async (recieverId: String) => {
	const url = `/connections/${recieverId}`;
	return await post<Search>(url);
};
export const getAllConnectionRequest = async () => {
	const url = `/connections/received`;
	return await get<Search>(url);
};
export const acceptConnectionRequest = async (senderId: stringtring) => {
	const url = `/connections/${senderId}/accept`;
	return await post<Search>(url);
};
export const rejectConnectionRequest = async (senderId: string) => {
	const url = `/connections/${senderId}/decline`;
	return await post<Search>(url);
};
export const revertConnectionRequest = async (senderId: string) => {
	const url = `/connections/${senderId}/cancel`;
	return await post<Search>(url);
};
export const removeConnection = async (removerId: string) => {
	const url = `/connections/${removerId}/remove`;
	return await post<Search>(url);
};
export const createPost = async (
	file: Object[],
	content: String,
	fileType: String,
) => {
	const formData = new FormData();
	if (fileType == 'image') {
		formData.append('file', {
			uri: file.path,
			name: 'image.png',
			fileName: 'image',
			type: 'image/jpeg',
		});
	}
	if (fileType == 'document') {
		formData.append('file', {
			uri: file[0].uri,
			name: file[0].name,
			fileName: 'pdf',
			type: 'application/pdf',
		});
	}
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	};
	if (file == null) {
		const url = `/posts?content=${content}&fileType=${fileType}`;
		return await post<Post>(url);
	} else {
		const url = `/posts?content=${content}&fileType=${fileType}`;
		return await post<Post>(url, formData, config);
	}
};
export const getFeed = async (page: number) => {
	const url = `/posts/feed?page=${page}&size=5`;
	return await get<PostDataResponse>(url);
};
export const likedPost = async (postId: String) => {
	const url = `/posts/like/${postId}`;
	return await post<String>(url);
};
export const getCommentPost = async (postId: String) => {
	const url = `/posts/comment/${postId}`;
	return await get<CommentResponse>(url);
};
export const postComment = async (payload: CommentPayload) => {
	const url = `/posts/comment`;
	return await post<CommentResponse>(url, payload);
};
export const deleteComment = async (postId: String, commentId: String) => {
	const url = `/posts/comment/delete?postId=${postId}&commentId=${commentId}`;
	return await del<CommentResponse>(url);
};
export const getUserPost = async (userId:string,page: number) => {
	const url = `/posts/userPosts/${userId}?page=${page}&size=5`;
	return await get<PostDataResponse>(url);
};
export const deletePost = async (postId: String) => {
	const url = `/posts/delete/${postId}`;
	return await del<String>(url);
};
export const getPostLikedUserDetail = async (postId: String) => {
	const url = `/posts/likedUserDetail/${postId}`;
	return await get<Search>(url);
};
export const getChatInteraction = async () => {
	const url = `/chat/all-interactions`;
	return await get<chatInteraction>(url);
};
export const getChatHistory = async (userId: String, page: number) => {
	const url = `/chat/history?connectionUserId=${userId}&page=${page}&size=10`;
	return await get<ChatHistoryResponse>(url);
};
export const deleteMessageForEveryOne = async (messageId: String) => {
	const url = `/chat/delete/${messageId}`;
	return await del<String>(url);
};
export const getNotifications = async () => {
	const url = `/notification`;
	return await get<Notification>(url);
};
export const deleteNotifications = async (id:string) => {
	const url = `/notification/${id}`;
	return await del<string>(url);
};
export const markReadNotifications = async () => {
	const url = `/notification/read`;
	return await put<string>(url);
};
export const countUnreadNotifications = async () => {
	const url = `/notification/count/unread`;
	return await get<string>(url);
};
