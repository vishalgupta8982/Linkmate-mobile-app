import { NavigationProp } from "@react-navigation/native";

export interface userDetails{
    userId: string;
		firstName: string;
		lastName: string;
		username: string ;
		headline: string;
		profilePicture: string;
}
export interface ChatUserDetailHeaderProps {
	data: userDetails;
	navigation: NavigationProp<any>;
}