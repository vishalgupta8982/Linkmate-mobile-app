import React, { useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity
} from 'react-native';
import { useCustomTheme } from '../config/Theme';
import {
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import { width } from '../config/Dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { fonts } from '../config/Fonts';

const AppPickerField = ({ label, value, Width, onPress, icon }) => {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [inputValue, setInputValue] = useState(value || '');

	useEffect(() => {
		setInputValue(value);
	}, [value]);
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<TouchableOpacity activeOpacity={0.4} onPress={onPress}>
				<View
					style={[
						styles.input,
						{ width: Width ? responsiveWidth(Width) : width - 40 },
					]}
				>
					<Text style={styles.value}>{inputValue}</Text>
					<AntDesign name={icon} color={colors.APP_PRIMARY_LIGHT} size={16} />
				</View>
			</TouchableOpacity >
		</View>
	);
};

const getStyles = (colors) =>
	StyleSheet.create({
		container: {
			marginTop: 20,
		},
		input: {
			height: 40,
			color: colors.TEXT,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			borderBottomWidth: 1,
			borderBottomColor: colors.PRIMARY,
			height: responsiveHeight(4.5),
		},
		label: {
			color: colors.APP_PRIMARY_LIGHT,
			fontSize: 12,
		},
		value: {
			fontSize: 14,
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
		},
	});

export default AppPickerField;
