import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
 
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useCustomTheme } from '../config/Theme';
const CustomToast = ({ message, success }) => {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	return (
		<View
			style={[
				styles.mainCont,
				{ backgroundColor: success ? '#4bb543' : '#EB4F44' },
			]}
		>
			<Text style={styles.text}> {message}</Text>
		</View>
	);
};

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			padding: 12,
			paddingHorizontal: 20,
			flexDirection: 'row',
			alignItems: 'flex-start',
            marginBottom:40
		},
		text: {
			fontSize: 14,
			color: '#fff',
			fontWeight: '700',
		},
		icon: {
			marginTop: 2,
		},
	});

export default CustomToast;
