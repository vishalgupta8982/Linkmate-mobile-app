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

export const userLogin = async (
	payload: LoginPayload
): Promise<verifyOtpResponse> => {
	const url = '/users/login';
	try {
		return await post<verifyOtpResponse>(url, payload);
	} catch (error) {
		throw error;
	}
};

export const userRegister = async (payload: SignUpPayload) => {
	const url = '/users/register';
	return await post<verifyOtpResponse>(url, payload);
};

export const verifyOtp = async (payload: OtpPayload) => {
	const url = `/users/verify-otp?otp=${payload.otp}`;
	return await post<verifyOtpResponse>(url, payload);
};

export const userDetails = async () => {
	const url = '/users/user-details';
	return await get<User>(url);
};
export const updateUserDetails = async (payload: UpdatePayload) => {
	const url = '/users/update';
	return await put<User>(url, payload);
};
export const updateProfilePicture = async (payload:any) => {
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

export const deleteExperience=async(id:string)=>{
	const url = `/users/delete/experience?experienceId=${id}`;
	return await del<User>(url);
}
export const deleteEducation=async(id:string)=>{
	const url = `/users/delete/education?educationId=${id}`;
	return await del<User>(url);
}
export const deleteProject=async(id:string)=>{
	const url = `/users/delete/project?projectId=${id}`;
	return await del<User>(url);
}
export const deleteSkill = async (skill: string) => {
	const url = `/users/delete/skill?skill=${skill}`;
	return await del<User>(url);
};
export const addSkill = async (skill: string[]) => {
	const url = '/users/update/skills';
	return await put<User>(url,skill);
};
export const addEducation = async (payload:EducationPayload ) => {
	console.log(payload)
	const url = '/users/update/education';
	return await put<User>(url,[payload]);
};
export const addExperience = async (payload:ExperiencePayload) => {
	const url = '/users/update/experience';
	return await put<User>(url,[payload]);
};
export const addProject = async (payload:ProjectPayload) => {
	const url = '/users/update/project';
	return await put<User>(url,[payload]);
};
export const updateEducation = async (educationId:string,payload: EducationPayload) => {
	const url = `/users/update/education`;
	return await put<User>(url, [payload]);
};
export const updateExperience = async (experienceId:string,payload: ExperiencePayload) => {
	console.log(payload)
	const url = `/users/update/experience`;
	return await put<User>(url, [payload]);
};
export const updateProject = async (projectId:string,payload: ProjectPayload) => {
	const url = `/users/update/project`;
	return await put<User>(url, [payload]);
};
export const searchUser = async (query:string) => {
	const url = `/users/search?query=${query}`;	
	return await get<Search>(url);
};
export const getSearchUserDetail = async (username: string) => {
	const url = `/users/search-user-details?username=${username}`;
	return await get<User>(url);
};
export const getMyConnections = async () => {
	const url = `/users/connections/my-connections`;
	return await get<Search>(url);
};

