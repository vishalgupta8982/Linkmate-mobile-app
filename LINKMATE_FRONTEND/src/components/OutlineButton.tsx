import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react'
import { useCustomTheme } from '../config/Theme';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { fonts } from '../config/Fonts';
import { width } from '../config/Dimension';

export default function OutlineButton({
	title,
	onPress,
	width,
	icon,
}: {
	onPress: any;
	title: string;
	icon: any;
	width?:number;
}) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	return (
		<TouchableOpacity activeOpacity={0.4} onPress={onPress}>
			<Text
				style={[
					styles.outlineButton,
					{ width: width ? width : responsiveWidth(38) },
				]}
			>
				{title} {icon && icon}
			</Text>
		</TouchableOpacity>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		outlineButton: {
			padding: 5,
			borderWidth: 1,
			borderColor: colors.PRIMARY,
			color: colors.TEXT,
			fontFamily: fonts.Inter_Medium,
			textAlign: 'center',
			borderRadius: 30,
			marginTop: 10,
		},
	});