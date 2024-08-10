import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect} from 'react';
import { useCustomTheme } from '../config/Theme';
import {
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import {  globalStyles } from '../StylesSheet';
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
export default function SplashScreen({ navigation }) {
	const token = useSelector((state: RootState) => selectToken(state))
	console.log(token)
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	useEffect(() => {
		  setTimeout(() => {
				const initialRouteName = token ? 'BottomNavigation' : 'Login';
				navigation.replace(initialRouteName)
			}, 1000)
	}, []);
	const globalStylesSheet = globalStyles(colors);
	return (
		<View style={[styles.mainCont, { backgroundColor: colors.BACKGROUND }]}>
			<View style={[styles.design]} />
			<View style={styles.contentCont}>
				<Image
					style={styles.logo}
					source={require('../assets/Images/logo.png')}
				/>
				<Text style={[styles.appName, globalStylesSheet.link]}>
					Link
					<Text style={[styles.appName, globalStylesSheet.mate]}>mate</Text>
				</Text>
			</View>
			<View style={[styles.bottomDesign]} />
		</View>
	);
}
const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
		},
		design: {
			height: 200,
			width: 200,
			borderBottomRightRadius: 200,
			position: 'absolute',
			borderBottomWidth: 7,
			borderEndWidth: 7,
			backgroundColor: colors.PRIMARY,
			borderColor: colors.LIGHT_PRIMARY,
		},
		contentCont: {
			height: '95%',
			justifyContent: 'center',
			alignItems: 'center',
		},
		logo: {
			height: responsiveHeight(25),
			width: responsiveWidth(40),
		},
		appName: {
			fontSize: 30,
		},
		bottomDesign: {
			width: '50%',
			height: 5,
			alignSelf: 'center',
			backgroundColor: colors.PRIMARY,
		},
	});
