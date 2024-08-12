import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	TextInput,
	Animated,
	TouchableWithoutFeedback,
	StyleSheet,
} from 'react-native';
import { useCustomTheme } from '../config/Theme';
import { width } from '../config/Dimension';
 

const AppTextField = ({ label, value, onChangeText, readOnly, ...props }) => {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [isFocused, setIsFocused] = useState(false);
	const [inputValue, setInputValue] = useState(value || '');
	const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

	useEffect(() => {
		Animated.timing(animatedIsFocused, {
			toValue: isFocused || inputValue !== '' ? 1 : 0,
			duration: 200,
			useNativeDriver: false,
		}).start();
	}, [isFocused, inputValue, animatedIsFocused]);

	const handleFocus = () => {
		setIsFocused(true);
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
			inputRange: [0, 1],
			outputRange: [0, 20], 
		}),
		top: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: [32, 5],
		}),
		fontSize: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: [14, 12],
		}),
		color: animatedIsFocused.interpolate({
			inputRange: [0, 1],
			outputRange: ['#aaa', '#aaa'],
		}),
	};

	return (
		<View style={styles.container}>
			<TouchableWithoutFeedback onPress={handleFocus}>
				<Animated.Text style={labelStyle}>{label}</Animated.Text>
			</TouchableWithoutFeedback>
			<TextInput
				{...props}
				style={styles.input}
				onFocus={handleFocus}
				onBlur={handleBlur}
				scrollEnabled={true}
				horizontal={true}
				onChangeText={handleChangeText}
				readOnly={readOnly}
				value={inputValue}
				selectionColor={colors.APP_PRIMARY_LIGHT}
			/>
		</View>
	);
};

const getStyles = (colors) =>
	StyleSheet.create({
		input: {
			height: 40,
			fontSize: 16,
			color: colors.TEXT,
			borderBottomWidth: 1,
			borderBottomColor: colors.PRIMARY,
			width: width - 40,
		},
		label:{
            marginTop:20
        }
	});

export default AppTextField;
