import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
import messaging from '@react-native-firebase/messaging';
import { saveFcmToken, userLogin } from '../../api/apis';
import Toast from 'react-native-simple-toast';
import { LoginPayload } from '../../types/Payload/LoginPayload';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, setToken } from '../../redux/slices/authSlice';
import Loader from '../../components/Loader';

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
		try {
			const response = await userLogin(payload);
			if (response?.token) {
				dispatch(setToken(response.token));
				await saveFcmToken(await messaging().getToken());
				Toast.show('Login successful', Toast.SHORT);
				navigation.replace('BottomNavigation');
			}
		} catch (err) {
			console.log(err);
			Toast.show('Incorrect email or password', Toast.SHORT);
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.mainCont}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<View style={styles.mainCont}>
				{loading && <Loader />}
				<ScrollView
					style={styles.scroll}
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"  
				>
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
							marginBottom={10}
						/>
						<AppButton
							title="Login"
							onPress={handleLogin}
							disabled={email.length < 1 || password.length < 1}
						/>
						<View style={styles.registerCont}>
							<Text style={styles.not}>Don't have an account? </Text>
							<TouchableOpacity onPress={() => navigation.replace('SignUp')}>
								<Text style={styles.register}>Register</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
}

const getStyles = (colors: any) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.BACKGROUND,
		},
		scroll: {
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
