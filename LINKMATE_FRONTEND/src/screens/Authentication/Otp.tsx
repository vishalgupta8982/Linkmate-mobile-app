import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import React from 'react';
import {
	responsiveHeight,
	responsiveWidth,
	responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useCustomTheme } from '../../config/Theme';
import { fonts } from '../../config/Fonts';
import { useState } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import Toast from 'react-native-simple-toast';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { RootStackParamList } from '../../navigation/MainStackNav';
import { useRef } from 'react';
import messaging from '@react-native-firebase/messaging';
import { OtpPayload } from '../../types/Payload/OtpPayload';
import { saveFcmToken, userRegister, verifyOtp } from '../../api/apis';
import { setToken } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import { AppButton } from '../../components/AppButton';
import { SignUpPayload } from '../../types/Payload/SignUpPayload';
type Tprops = NativeStackScreenProps<RootStackParamList, 'Otp'>;
export default function Otp({ navigation, route }: Tprops) {
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const { email, firstName, lastName, password } = route.params;
	const styles = getStyles(colors);
	const [timer, setTimer] = useState(30);
	const [otp, setOtp] = useState('');
	const [loading, setLoading] = useState(false);
	const submitOtp = async () => {
		setLoading(true);
		const payload: OtpPayload = {
			email: email,
			otp: otp,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			password: password,
		};
		try {
			const response = await verifyOtp(payload);
			if (response?.token) {
				dispatch(setToken(response.token));
				const fcmToken = await messaging().getToken();
				await saveFcmToken(fcmToken);
				Toast.show('Account created successfull', Toast.SHORT);
				navigation.replace('BottomNavigation');
			}
		} catch (err) {
			Toast.show(err.message || 'An unexpected error occurred', Toast.SHORT);
		} finally {
			setLoading(false);
		}
	};
	const resendCode = async () => {
		setLoading(true);
		if (password.length < 8) {
			Toast.show('Password must be a 8 character', Toast.SHORT);
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
				Toast.show('Resend code successfully', Toast.SHORT);
			}
		} catch (err) {
			Toast.show(err.message || 'An unexpected error occurred', Toast.SHORT);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (timer > 0) {
			const intervalId = setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);

			return () => clearInterval(intervalId);
		}
	}, [timer]);
	const handleResendCode = () => {
		setTimer(30);
		resendCode();
	};
	const otpRef = useRef(null);

	useEffect(() => {
		if (otpRef.current) {
			otpRef.current.setValue(otp);
		}
	}, [otp]);
	return (
		<ScrollView style={[styles.container]}>
			<View style={styles.textCont}>
				{loading && <Loader />}
				<Text style={[styles.verificationText]}>Verification code</Text>
				<Text style={[styles.smallText]}>
					Enter the code we've sent to {email}
				</Text>
				<OtpInput
					color={colors.TEXT}
					numberOfDigits={4}
					focusColor={colors.PRIMARY}
					focusStickBlinkingDuration={400}
					ref={otpRef}
					onTextChange={(text) => setOtp(text)}
					theme={{
						pinCodeContainerStyle: styles.pinCodeContainer,
						pinCodeTextStyle: styles.pinCodeText,
						focusStickStyle: styles.focusStick,
						focusedPinCodeContainerStyle: styles.activePinCodeContainer,
					}}
				/>
				<TouchableOpacity
					style={[
						styles.button,
						{
							backgroundColor:
								otp.length === 4 ? colors.PRIMARY : colors.APP_PRIMARY_LIGHT,
						},
					]}
					onPress={submitOtp}
					disabled={otp.length !== 4}
				>
					<Text style={[styles.buttonText]}>VERIFY OTP</Text>
				</TouchableOpacity>
				<Text style={[styles.resend]}>
					Didn't receive OTP?{' '}
					<Text
						onPress={timer === 0 ? handleResendCode : undefined}
						style={timer === 0 ? styles.resendButton : styles.resend}
					>
						{timer === 0 ? 'Resend OTP' : `Resend OTP in ${timer} seconds`}
					</Text>
				</Text>
			</View>
		</ScrollView>
	);
}
const getStyles = (colors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingHorizontal: 20,
			paddingVertical: 30,
			backgroundColor: colors.BACKGROUND,
			height: responsiveHeight(100),
		},
		textCont: {
			padding: 2,
			height: responsiveHeight(100),
		},
		verificationText: {
			paddingVertical: 2,
			fontSize: 24,
			fontFamily: fonts.Inter_Medium,
			color: colors.TEXT,
		},
		smallText: {
			fontSize: 14,
			marginBottom: 20,
			fontFamily: fonts.Inter_Medium,
			color: colors.APP_PRIMARY_LIGHT,
		},
		resend: {
			fontSize: 14,
			marginTop: 5,
			textAlign: 'center',
			fontFamily: fonts.Inter_Medium,
			color: colors.APP_PRIMARY_LIGHT,
		},
		resendButton: {
			color: colors.PRIMARY,
		},
		button: {
			paddingVertical: 10,
			paddingHorizontal: 30,
			borderRadius: 5,
			alignItems: 'center',
			marginTop: 20,
		},
		buttonText: {
			fontSize: 16,
			fontFamily: fonts.Inter_Medium,
			color: colors.WHITE,
		},
		pinCodeContainer: {
			height: 60,
			width: 55,
		},
		pinCodeText: {
			fontSize: 22,
			fontFamily: fonts.Inter_Medium,
			color: colors.TEXT,
		},
	});
