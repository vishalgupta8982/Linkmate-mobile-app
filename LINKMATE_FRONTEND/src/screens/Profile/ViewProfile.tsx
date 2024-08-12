import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { responsiveHeight } from 'react-native-responsive-dimensions';
export default function ViewProfile({ navigation }) {
	const route = useRoute();
	const { image } = route.params || {};
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	return (
		<View style={styles.mainCont}>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<AntDesign name="arrowleft" color={colors.TEXT} size={22} />
			</TouchableOpacity>
			<View style={styles.Content}>
				<Image source={{ uri: image }} style={styles.largeImage} />
			</View>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
			padding: 20,
		},
		Content: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		largeImage: {
			width: '100%',
			height: responsiveHeight(43),
			resizeMode: 'contain',
		},
	});
