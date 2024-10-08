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
import React, { useState } from 'react';
import { useCustomTheme } from '../../config/Theme';
import {
	responsiveHeight,
	responsiveWidth,
	responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { globalStyles } from '../../StylesSheet';
import AppTextField from '../../components/AppTextField';
import { AppButton } from '../../components/AppButton';
import { fonts } from '../../config/Fonts';
import Toast from 'react-native-simple-toast';
import { SignUpPayload } from '../../types/Payload/SignUpPayload';
import { userRegister } from '../../api/apis';
import Loader from '../../components/Loader';

export default function SignUp({ navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStylesSheet = globalStyles(colors);
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSignUp = async () => {
		setLoading(true);
		if (password.length < 8) {
			Toast.show('Password must be at least 8 characters', Toast.SHORT);
			setLoading(false);
			return;
		}
		const payload: SignUpPayload = {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: email.trim(),
			password: password.trim(),
		};
		try {
			const response = await userRegister(payload);
			if (response) {
				Toast.show('OTP sent successfully', Toast.SHORT);
				navigation.replace('Otp', { email, firstName, lastName, password });
			}
		} catch (err) {
			Toast.show(err.message || 'An unexpected error occurred', Toast.SHORT);
		} finally {
			setLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.mainCont}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
		>
			<ScrollView
				style={styles.mainCont}
				contentContainerStyle={{ flexGrow: 1 }}
				keyboardShouldPersistTaps="handled"  
			>
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
					<Text style={globalStylesSheet.head}>Signup</Text>
					<AppTextField onChangeText={setFirstName} label="First Name" />
					<AppTextField onChangeText={setLastName} label="Last Name" />
					<AppTextField onChangeText={setEmail} label="Email" />
					<AppTextField
						label="Password"
						secureTextEntry={true}
						value={password}
						onChangeText={setPassword}
						marginBottom={10}
					/>
					<AppButton
						onPress={handleSignUp}
						disabled={
							email.length < 1 ||
							password.length < 1 ||
							firstName.length < 1 ||
							lastName.length < 1
						}
						title="Signup"
					/>
					<View style={styles.registerCont}>
						<Text style={styles.not}>Already have an account? </Text>
						<TouchableOpacity onPress={() => navigation.replace('Login')}>
							<Text style={styles.register}>Login</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.BACKGROUND,
			padding: responsiveWidth(2),
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
			alignItems: 'flex-start',
			justifyContent: 'center',
			alignContent: 'center',
			flex: 1,
			marginTop: responsiveFontSize(3),
		},
		registerCont: {
			alignItems: 'center',
			flexDirection: 'row',
			alignContent: 'center',
			alignSelf: 'center',
			marginBottom:40
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
