import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useCustomTheme } from '../config/Theme';
import {
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import { globalStyles } from '../StylesSheet';
import { AppButton } from './AppButton';
import { fonts } from '../config/Fonts';
import OutlineButton from './OutlineButton';

export default function UserCard({ userData, navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	return (
		<TouchableOpacity
			activeOpacity={0.4}
			onPress={() =>
				navigation.navigate('searchUserProfile', {
					username: userData.username,
				})
			}
			style={styles.card}
		>
			<Image style={styles.img} source={{ uri: userData.profilePicture }} />
			<Text style={globalStyleSheet.smallerHead}>
				{userData.firstName} {userData.lastName}
			</Text>
			<Text
				numberOfLines={2}
				ellipsizeMode="tail"
				style={globalStyleSheet.description}
			>
				{userData.headline}
			</Text>
            <OutlineButton title="Connect" />
            
		</TouchableOpacity>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		card: {
			backgroundColor: colors.LIGHT_MAIN_BACKGROUND,
			width: responsiveWidth(45),
			height: responsiveHeight(37),
			marginTop: 5,
			paddingVertical: 20,
			paddingHorizontal: 10,
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: 10,
			elevation: 3,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.2,
		},
		img: {
			width: 100,
			height: 100,
			borderRadius: 50,
			marginBottom: 10,
		},
		 
	});
