import { sendConnectionRequest } from '../api/apis';
export interface Experience {
	experienceId: string;
	company: string;
	position: string;
	startDate: string;
	endDate: string;
	description: string;
}

export interface Education {
	educationId: string;
	institution: string;
	degree: string;
	startDate: string | null;
	endDate: string;
	description: string;
}
export interface Project{
	name: string;
	startDate: string;
	endDate: string;
	description: string;
	link: string;
	skills: string[];
}

export interface User {
	userId: {
		timestamp: number;
		date: string;
	};
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	profilePicture: string;
	headline: string;
	location: string;
	about: string | null;
	connections: any[];
	experiences: Experience[];
	educations: Education[];
	projects: Project[];
	skills: string[];
	sendConnectionsRequest: string[];
	createdAt: string | null;
	updatedAt: string | null;
}
