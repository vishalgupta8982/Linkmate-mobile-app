import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
export default function ChatHeader({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	return (
		<View style={styles.header}>
			<TouchableOpacity
				onPress={() => navigation.navigate('Profile')}
				activeOpacity={0.4}
			>
				<Image style={styles.img} source={{ uri: userData?.profilePicture }} />
			</TouchableOpacity>
			<Text style={styles.headingText}>Chats</Text>
			<View style={styles.icons}>
				<TouchableOpacity activeOpacity={0.4}>
					<Ionicons name={'search-outline'} size={24} color={colors.TEXT} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		header: {
			backgroundColor: colors.BACKGROUND,
			padding: 5,
			paddingHorizontal: 15,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		img: {
			width: 40,
			height: 40,
			borderRadius: 25,
		},
		icons: {
			flexDirection: 'row',
			width: responsiveWidth(10),
			justifyContent: 'space-between',
		},
		headingText: {
			fontFamily: fonts.Inter_Medium,
			fontSize: 22,
			marginLeft: 5,
			color: colors.TEXT,
		},
	});
