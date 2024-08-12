import axios from 'axios';
import { SignUpPayload } from '../types/Payload/SignUpPayload';
import { verifyOtpResponse } from '../types/Response/VerifyOtpResponse';
import { get, post, put } from './instance';
import { LoginPayload } from '../types/Payload/LoginPayload';
import { OtpPayload } from '../types/Payload/OtpPayload';
import { User } from '../types/compoundTypes';
import { UpdatePayload } from '../types/Payload/updatePayload';

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
export const updateProfilePicture = async (payload) => {
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
