import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCustomTheme } from '../config/Theme';
import Home from '../screens/Home/Home';
import CreatePost from '../screens/CreatePost/CreatePost';
import Profile from '../screens/Profile/Profile';
import Search from '../screens/Search/Search';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
	const theme = useCustomTheme();
	const { colors } = theme;
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarStyle: { backgroundColor: colors.BACKGROUND },
				headerShown: false,
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'Home') {
						iconName = focused ? 'home' : 'home-outline';
						return <Ionicons name={iconName} size={size} color={color} />;
					} else if (route.name === 'Post') {
						iconName = focused ? 'add-circle' : 'add-circle-outline';
						return <Ionicons name={iconName} size={size} color={color} />;
					} else if (route.name === 'Search') {
						return <Ionicons name={'search-outline'} size={24} color={color} />;
					} else if (route.name === 'Profile') {
						return (
							<MaterialCommunityIcon
								name={'account'}
								size={size}
								color={color}
							/>
						);
					}
				},
			})}
			tabBarOptions={{
				activeTintColor: colors.PRIMARY,
				inactiveTintColor: colors.TEXT,
			}}
		>
			<Tab.Screen name="Home" component={Home} />
			<Tab.Screen name="Search" component={Search} />
			<Tab.Screen name="Post" component={CreatePost} />
			<Tab.Screen name="Profile" component={Profile} />
		</Tab.Navigator>
	);
};

export default BottomNavigation;

const styles = StyleSheet.create({
	scan: {
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 100,
	},
});
