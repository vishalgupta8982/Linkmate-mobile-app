import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Feather from 'react-native-vector-icons/Feather';
import { responsiveWidth } from 'react-native-responsive-dimensions';
export default function HomePageHeader({ navigation }) {
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
			<View style={styles.icons}>
				<TouchableOpacity
					onPress={() => navigation.navigate('notification')}
					activeOpacity={0.4}
				>
					<Feather name="bell" size={24} color={colors.TEXT} />
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.4}>
					<Feather name="send" size={24} color={colors.TEXT} />
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
			alignItems:'center'
			 
		},
		img: {
			width: 40,
			height: 40,
			borderRadius: 25,
		},
		icons: {
			flexDirection: 'row',
			width: responsiveWidth(20),
			justifyContent: 'space-between',
			marginRight: 10,
		},
	});
