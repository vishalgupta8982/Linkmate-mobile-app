import axios, { AxiosRequestConfig } from 'axios';
import { store } from '../redux/store';
import { selectToken } from '../redux/slices/authSlice';

const baseURL = 'https://linkmate.onrender.com/';
console.log('Backend URL:', baseURL);

const axiosInstance = axios.create({
	baseURL: baseURL,
	headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const token = selectToken(store.getState());
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

const apiCall = async <T>(apiFunc: () => Promise<any>): Promise<T> => {
	try {
		const response = await apiFunc();
		return response;
	} catch (error) {
		let errorMessage = 'An unexpected error occurred';
		if (axios.isAxiosError(error)) {
			  errorMessage =
					error.response?.data?.message ||
					error.response?.data ||
					error.message;
			console.error('Axios error:', errorMessage);
		} else {
			console.error('Unexpected error:', error);
		}
		throw new Error(errorMessage);
	}
};

const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
	return apiCall<T>(() => axiosInstance.get(url, config));
};

const post = async <T>(
	url: string,
	data: any,
	config?: AxiosRequestConfig
): Promise<T> => {
	return apiCall<T>(() => axiosInstance.post(url, data, config));
};

const put = async <T>(
	url: string,
	data?: any,
	config?: AxiosRequestConfig
): Promise<T> => {
	return apiCall<T>(() => axiosInstance.put(url, data, config));
};
const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
	return apiCall<T>(() => axiosInstance.delete(url, config));
};

export { get, post, put, del };
