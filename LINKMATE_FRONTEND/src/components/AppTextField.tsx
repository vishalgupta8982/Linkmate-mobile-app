import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	TextInput,
	Animated,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import { useCustomTheme } from '../config/Theme';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { width } from '../config/Dimension';
import { fonts } from '../config/Fonts';

const AppTextField = ({
	label,
	value,
	onChangeText,
	Width,
	readOnly,
	...props
}) => {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors, width);
	const [isFocused, setIsFocused] = useState(false);
	const [inputValue, setInputValue] = useState(value || '');
	const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

	useEffect(() => {
		Animated.timing(animatedIsFocused, {
			toValue: isFocused || inputValue !== '' ? 1 : 0,
			duration: 200,
			useNativeDriver: false,
		}).start();
	}, [isFocused, inputValue]);

	const handleFocus = () => {
		setIsFocused(true);
		if (props.onFocus) {
			props.onFocus(); // Ensure external onFocus handler is called
		}
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	const handleChangeText = (text) => {
		setInputValue(text);
		if (onChangeText) {
			onChangeText(text);
		}
	};

	const labelStyle = {
		left: 0,
		marginTop: animatedIsFocused.interpolate({
			inputRange: [0, 10],
			outputRange: [0, 20],
		}),
		top: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: [32, 10],
		}),
		fontSize: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: [14, 12],
		}),
		color: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: ['#a6a6a6', '#a6a6a6'],
		}),
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity activeOpacity={0.4} onPress={handleFocus}>
				<Animated.Text style={labelStyle}>{label}</Animated.Text>
			</TouchableOpacity >
			<TextInput
				{...props}
				style={[
					styles.input,
					{ width: Width ? responsiveWidth(Width) : width - 40 },
				]}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onChangeText={handleChangeText}
				editable={!readOnly}
				value={inputValue}
				selectionColor={colors.APP_PRIMARY_LIGHT}
				multiline
				numOfLine={20}
				
			/>
		</View>
	);
};

const getStyles = (colors, width) =>
	StyleSheet.create({
		container: {
			// Preserved original styling if any
		},
		input: {
			fontSize: 14,
			color: colors.TEXT,
			borderBottomWidth: 1,
			borderBottomColor: colors.PRIMARY,
			fontFamily: fonts.Inter_Regular,
			paddingBottom: -10,
		},
		label: {
			marginTop: 20,
		},
	});

export default AppTextField;