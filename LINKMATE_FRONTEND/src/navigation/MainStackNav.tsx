import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useCustomTheme } from '../config/Theme';
import SignUp from '../screens/Authentication/SignUp';
import Login from '../screens/Authentication/Login';
import Otp from '../screens/Authentication/Otp';
import BottomNavigation from './BottomNavigation';
import EditProfile from '../screens/Profile/EditProfile';
import ViewProfile from '../screens/Profile/ViewProfile';
import Setting from '../screens/Profile/Setting';
import SearchResult from '../screens/Search/SearchResult';
import ViewUserProfile from '../screens/Search/ViewProfile';
import MyConnections from '../screens/Profile/MyConnections';
import Notification from '../screens/Notification/Notification';
import Comment from '../components/Comment';
import UserPost from '../screens/Profile/UserPost';
import Likes from '../components/Likes';
import UserChatDetail from '../screens/Chat/UserChatDetail';

export type RootStackParamList = {
	Splash: undefined;
	SignUp: undefined;
	Login: undefined;
	Otp: { email: string; firstName: string; lastName: string; password: string };
	EditProfile: undefined;
	setting: undefined;
	searchResult: undefined;
	myConnection: undefined;
	userPosts: undefined;
	notification: undefined;
	profile: undefined;
	BottomNavigation: undefined;
	likes: undefined;
	comment: undefined;
	viewProfile: { image: string };
	userChatDetail: { userId: string };
	viewUserProfile: { username: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainStackNav() {
	const theme = useCustomTheme();
	const MyTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			PRIMARY: theme.colors.PRIMARY,
			LIGHT_PRIMARY: theme.colors.LIGHT_PRIMARY,
			LIGHTER_PRIMARY: theme.colors.LIGHTER_PRIMARY,
			SECONDARY: theme.colors.SECONDARY,
			SKELETON: theme.colors.SKELETON,
			LIGHT_MAIN_BACKGROUND: theme.colors.LIGHT_MAIN_BACKGROUND,
			APP_PRIMARY: theme.colors.APP_PRIMARY,
			APP_SECONDARY: theme.colors.APP_SECONDARY,
			APP_PRIMARY_LIGHT: theme.colors.APP_PRIMARY_LIGHT,
			BACKGROUND: theme.colors.BACKGROUND,
			DARK_BACKGROUND: theme.colors.DARK_BACKGROUND,
			MAIN_BACKGROUND: theme.colors.MAIN_BACKGROUND,
			TEXT: theme.colors.TEXT,
			DARK_PRIMARY: theme.colors.DARK_PRIMARY,
			WHITE: theme.colors.WHITE,
		},
	};
	return (
		<NavigationContainer theme={MyTheme}>
			<Stack.Navigator
				screenOptions={{ headerShown: false }}
				initialRouteName={'Splash'}
			>
				<Stack.Screen name="Splash" component={SplashScreen} />
				<Stack.Screen name="SignUp" component={SignUp} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Otp" component={Otp} />
				<Stack.Screen name="EditProfile" component={EditProfile} />
				<Stack.Screen name="viewProfile" component={ViewProfile} />
				<Stack.Screen name="setting" component={Setting} />
				<Stack.Screen name="searchResult" component={SearchResult} />
				<Stack.Screen name="myConnection" component={MyConnections} />
				<Stack.Screen name="notification" component={Notification} />
				<Stack.Screen name="userPosts" component={UserPost} />
				<Stack.Screen name="likes" component={Likes} />
				<Stack.Screen name="userChatDetail" component={UserChatDetail} />
				<Stack.Screen
					options={{
						presentation: 'modal',
						animation: 'slide_from_bottom',
					}}
					name="comment"
					component={Comment}
				/>
				<Stack.Screen name="viewUserProfile" component={ViewUserProfile} />
				<Stack.Screen name="BottomNavigation" component={BottomNavigation} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default MainStackNav;
