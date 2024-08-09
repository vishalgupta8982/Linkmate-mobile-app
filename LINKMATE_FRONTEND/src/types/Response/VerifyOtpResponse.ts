export interface verifyOtpResponse {
	userId: {
		timestamp: number;
		date: string;
	};
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	profilePicture: string ;
	headline: string ;
	location: string ;
	connections: string;
	about: string ;
	experiences: string ;
	educations: string ;
	skills: string ;
	createdAt: string ;
	updatedAt: string ;
	token: string;
}
