import React from 'react';
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	KeyboardAvoidingView
} from 'react-native';
import { fonts } from '../config/Fonts';
import { useCustomTheme } from '../config/Theme';
import { responsiveWidth } from 'react-native-responsive-dimensions';

export const AppButton = ({
	onPress,
	title,
	loading,
	disabled,
	icon,
	width,
	marginBottom,
	bg,
}: {
	onPress: () => void;
	title: string;
	loading?: boolean;
	disabled?: boolean;
	icon?: any;
	width?: number;
	marginBottom?: number;
	bg?:any;
}) => {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const backgroundColor = disabled
		? colors.APP_PRIMARY_LIGHT 
		: bg
		? bg 
		: colors.PRIMARY;
	return (
		 
			<TouchableOpacity
				onPress={onPress}
				activeOpacity={0.4}
				disabled={disabled}
				style={[
					styles.appButtonContainer,
					{
						width: width ? responsiveWidth(width) : responsiveWidth(90),
						marginBottom: marginBottom ? marginBottom : 10,
						backgroundColor: backgroundColor,
					},
				]}
			>
				{icon && <View style={styles.icon}>{icon}</View>}
				<Text style={styles.appButtonText}>{title}</Text>
				{loading && <ActivityIndicator size="large" color="white" />}
			</TouchableOpacity>
	);
};
const getStyles = (colors:any) =>
	StyleSheet.create({
		appButtonContainer: {
			backgroundColor: colors.PRIMARY,
			borderRadius: 5,
			paddingVertical: 10,
			paddingHorizontal: 12,
			marginHorizontal: 5,
			alignSelf: 'center',
			marginTop: 10,
		},
		appButtonText: {
			fontSize: 16,
			color: colors.WHITE,
			fontFamily: fonts.Inter_Medium,
			alignSelf: 'center',
			textTransform: 'capitalize',
		},

		icon: {
			marginRight: 5,
		},
	});
