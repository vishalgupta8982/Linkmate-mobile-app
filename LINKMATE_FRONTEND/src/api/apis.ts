import axios from "axios";
import { SignUpPayload } from "../types/Payload/SignUpPayload";
import { verifyOtpResponse } from "../types/Response/VerifyOtpResponse";
import { get, post } from "./instance";
import { LoginPayload } from "../types/Payload/LoginPayload";

export const userLogin = async (payload:LoginPayload): Promise<verifyOtpResponse> => {
    console.log(payload)
	const url = '/users/login';
	return post<verifyOtpResponse>(url,payload);
};

 
