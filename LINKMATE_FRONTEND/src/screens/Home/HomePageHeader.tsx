import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useCustomTheme } from '../../config/Theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Feather from 'react-native-vector-icons/Feather';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import { countUnreadNotifications } from '../../api/apis';
export default function HomePageHeader({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [countUnreadNotification, setCountUnreadNotification] = useState(null);
	const getUnreadNotification = async () => {
		try {
			const response = await countUnreadNotifications();
			console.log(response,"hlo")
	setCountUnreadNotification(response);
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		getUnreadNotification();
	}, []);
	console.log(countUnreadNotification)
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
					{countUnreadNotification != 0 && countUnreadNotification!=null  && (
						<Text style={styles.count}>{countUnreadNotification}</Text>
					)}
					<Feather name="bell" size={24} color={colors.TEXT} />
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
		count: {
			backgroundColor: colors.RED,
			fontSize: 10,
			fontFamily: fonts.Inter_Medium,
			textAlign: 'center',
			borderRadius: 10,
			color: colors.TEXT,
			position: 'absolute',
			zIndex: 4,
			width: 16,
			height: 16,
			left: 15,
			top: -8,
		},
	});
