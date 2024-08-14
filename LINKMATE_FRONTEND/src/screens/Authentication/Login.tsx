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
import Toast from 'react-native-simple-toast';
import { LoginPayload } from '../../types/Payload/LoginPayload';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setToken } from '../../redux/slices/authSlice';
import Loader from '../../components/Loader';
import { RootState } from '../../redux/store';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
export default function Login({ navigation }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStylesSheet = globalStyles(colors);
	 const handleLogin = async () => {
			setLoading(true);

			const payload: LoginPayload = {
				email: email.trim(),
				password: password.trim(),
			};
			if (payload.password.length < 8) {
			 Toast.show('Password must be a 8 character', Toast.SHORT);
				setLoading(false);
				return;
			}

			try {
				const response = await userLogin(payload);

				if (response?.token) {
					dispatch(setToken(response.token));
					Toast.show('Login successfull', Toast.SHORT);
					navigation.replace('BottomNavigation');
				}
			} catch (err) {
				Toast.show(err.message || 'An unexpected error occurred', Toast.SHORT);
			} finally {
				setLoading(false);
			}
		};

	return (
		<View style={styles.mainCont}>
			<ScrollView>
				{loading && <Loader />}
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
						<TouchableOpacity onPress={() => navigation.replace('SignUp')}>
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
