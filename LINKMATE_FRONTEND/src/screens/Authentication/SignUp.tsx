import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import React from 'react';
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
export default function SignUp({ navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStylesSheet = globalStyles(colors);
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
					<Text style={globalStylesSheet.head}>Signup</Text>
					<AppTextField label="First Name" />
					<AppTextField label="Last Name" />
					<AppTextField label="Email" />
					<AppTextField label="Password" secureTextEntry={true} />
					<AppButton title="Signup" />
					<View style={styles.registerCont}>
						<Text style={styles.not}>Don't have a account? </Text>
						<TouchableOpacity onPress={() => navigation.navigate('Login')}>
							<Text style={styles.register}>Login here</Text>
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
