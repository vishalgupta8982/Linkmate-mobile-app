import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import React from 'react';

import {
	responsiveHeight,
	responsiveWidth,
	responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { globalStyles } from '../../StylesSheet';
import AppTextField from '../../components/AppTextField';
import { AppButton } from '../../components/AppButton';
import { fonts } from '../../config/Fonts';
import { useCustomTheme } from '../../config/Theme';
import { useState } from 'react';
import { SignUpPayload } from '../../types/Payload/SignUpPayload';
import { userLogin } from '../../api/apis';
import { LoginPayload } from '../../types/Payload/LoginPayload';
export default function Login({ navigation }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStylesSheet = globalStyles(colors);
	 const handleLogin=async()=>{
		 const payload: LoginPayload = {
				email: email.trim(),
				password: password.trim(),
			};
		try{
			const response = await userLogin(payload);
			console.log(response)

		}catch(err){
			console.error(err)
		}
	 }
	return (
		<View style={styles.mainCont}>
			<ScrollView>
				<View>
					<Image
						style={styles.logo}
						source={require('../../assets/Images/logo.png')}
					/>
					<Text style={[styles.appName, globalStylesSheet.link]}>
						Link
						<Text style={[styles.appName, globalStylesSheet.mate]}>mate</Text>
					</Text>
				</View>
				<View style={styles.textFieledCont}>
					<Text style={globalStylesSheet.head}>Login</Text>
					<AppTextField
						label="Email"
						value={email}
						readOnly={false}
						onChangeText={setEmail}  
					/>
					<AppTextField
						label="Password"
						readOnly={false}
						secureTextEntry={true}
						value={password}
						onChangeText={setPassword} 
					/>
					<AppButton title="Login" onPress={handleLogin} />
					<View style={styles.registerCont}>
						<Text style={styles.not}>Don't have a account? </Text>
						<TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
							<Text style={styles.register}>Register</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.BACKGROUND,
			padding: responsiveWidth(5),
		},

		logo: {
			height: responsiveHeight(20),
			width: responsiveWidth(40),
			alignSelf: 'center',
			marginTop: responsiveHeight(3),
		},
		appName: {
			fontSize: responsiveFontSize(4),
			textAlign: 'center',
		},
		textFieledCont: {
			flex: 1,
			alignItems: 'flex-start',
			justifyContent: 'center',
			alignContent: 'center',
			height: responsiveHeight(60),
		},
		registerCont: {
			alignItems: 'center',
			flexDirection: 'row',
			alignContent: 'center',
			alignSelf: 'center',
			marginTop: responsiveHeight(2),
		},
		not: {
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
		},
		register: {
			fontFamily: fonts.Inter_Regular,
			color: colors.PRIMARY,
		},
	});
