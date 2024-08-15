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
export type RootStackParamList = {
	Otp:{email:string,firstName:string,lastName:string,password:string},
	profile:undefined;
	viewProfile:{image:string}
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainStackNav({ navigation }) {
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
				<Stack.Screen name="BottomNavigation" component={BottomNavigation} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default MainStackNav;
