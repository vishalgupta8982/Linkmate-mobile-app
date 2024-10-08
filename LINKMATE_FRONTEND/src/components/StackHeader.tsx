import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useCustomTheme } from '../config/Theme';
import { fonts } from '../config/Fonts';
import { NavigationProp } from '@react-navigation/native';

export default function StackHeader({ title, navigation }:{title:string,navigation:NavigationProp<any>}) {
	const theme = useCustomTheme();
		const { colors } = theme;
		const styles = getStyles(colors);

	return (
		<View
			style={styles.headerCont}
		>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<AntDesign name="arrowleft" style={styles.icon} size={22} color={colors.TEXT} />
			</TouchableOpacity>
			<Text style={styles.headerText}>
				{title}
			</Text>
		</View>
	);
}

const getStyles = (colors: any) =>
	StyleSheet.create({
		headerCont: {
			padding: 10,
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.BACKGROUND,
		},
		headerText: {
			fontFamily: fonts.Inter_Medium,
			fontSize: 22,
			marginLeft: 5,
			color: colors.TEXT,
		},
		icon:{
			padding:4
		}
	});
