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
	projectId:string;
	name: string;
	startDate: string;
	endDate: string;
	description: string;
	link: string;
	skills: string[];
}

export interface User {
	userId:string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	profilePicture: string;
	headline: string;
	location: string;
	about: string ;
	connections: string[];
	posts: string[];
	experiences: Experience[];
	educations: Education[];
	projects: Project[];
	skills: string[];
	connectionsRequest:string[];
	sendConnectionsRequest: string[];
	createdAt: string ;
	updatedAt: string ;
}
