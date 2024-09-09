import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useCustomTheme } from '../../config/Theme';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, store } from '../../redux/store';
import Feather from 'react-native-vector-icons/Feather';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import { countUnreadNotifications } from '../../api/apis';
import {
	selectNotificationCount,
	setUnreadMessageCount,
	setUnreadNotificationCount,
} from '../../redux/slices/CountNotificationMessage';
import { selectChatPageByUser } from '../../redux/slices/ChatSlice';
export default function HomePageHeader({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const count = useSelector(
		(state: RootState) => state.count.unreadNotificationCount
	);
	const getUnreadNotification = async () => {
		
		try {
			const response = await countUnreadNotifications();
			if (response) {
				dispatch(
					setUnreadNotificationCount(parseInt(response.unreadNotification))
				);
				dispatch(setUnreadMessageCount(parseInt(response.unreadMessage)));
			}
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		getUnreadNotification();
	}, []);
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
					{count != 0 && count != null && (
						<Text style={styles.count}>{count}</Text>
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
			color: colors.WHITE,
			position: 'absolute',
			zIndex: 4,
			width: 16,
			height: 16,
			left: 15,
			top: -8,
			justifyContent: 'center',
			alignItems: 'center',
		},
	});
