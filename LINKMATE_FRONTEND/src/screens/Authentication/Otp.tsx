import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
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
import { useEffect } from 'react';
export default function Otp() {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [timer, setTimer] = useState(30);
	const [otp, setOtp] = useState('');

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
	};
	return (
		<ScrollView style={[styles.container]}>
			<View style={styles.textCont}>
				<Text style={[styles.verificationText]}>Verification code</Text>
				<Text style={[styles.smallText]}>Enter the code we've sent to +91</Text>

				<OtpInput
					color={colors.TEXT}
					numberOfDigits={4}
					focusColor={colors.PRIMARY}
					focusStickBlinkingDuration={400}
					/*ref={otpRef}
					onTextChange={(text) => setOtp(text)}*/
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
					/*Press={handleSubmit}*/
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
		},
		textCont: {
			padding: 2,
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
