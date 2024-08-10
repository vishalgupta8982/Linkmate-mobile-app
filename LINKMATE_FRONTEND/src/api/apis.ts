import axios from "axios";
import { SignUpPayload } from "../types/Payload/SignUpPayload";
import { verifyOtpResponse } from "../types/Response/VerifyOtpResponse";
import { get, post } from "./instance";
import { LoginPayload } from "../types/Payload/LoginPayload";
import { OtpPayload } from "../types/Payload/OtpPayload"

export const userLogin = async (payload:LoginPayload): Promise<verifyOtpResponse> => {
   const url = '/users/login';
		try {
			return await post<verifyOtpResponse>(url, payload);
		} catch (error) {
			throw error; 
		}
};

export const userRegister=async(payload:SignUpPayload)=>{
	const url='/users/register';
 return await post<verifyOtpResponse>(url, payload);
}

export const verifyOtp=async(payload:OtpPayload)=>{
	const url = `/users/verify-otp?otp=${payload.otp}`;
	 return await post<verifyOtpResponse>(url, payload);
}

 
