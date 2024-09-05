import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useCustomTheme } from '../config/Theme';
import { fonts } from '../config/Fonts';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import moment from 'moment';
export default function NotificationTray({ navigation, data }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
  const createdAt = moment(data.createdAt + '+00:00')
					.utcOffset('+05:30')
					.fromNow(true);
	const now = moment();
  const duration = moment.duration(now.diff(createdAt));
  let formattedTime;
	if (duration.asHours() >= 1) {
		formattedTime = `${Math.floor(duration.asHours())}h`;
	} else if (duration.asMinutes() >= 1) {
		formattedTime = `${Math.floor(duration.asMinutes())}m`;
	} else if (duration.asSeconds() >= 1) {
		formattedTime = `${Math.floor(duration.asSeconds())}s`;
	} else {
		formattedTime = 'just now';  
	}

	return (
		<View
			style={[
				styles.notificationCont,
				{
					backgroundColor: data.read
						? colors.BACKGROUND
						: colors.LIGHT_MAIN_BACKGROUND,
				},
			]}
		>
			<Image
				style={styles.profileImg}
				source={{ uri: data.userProfilePicture }}
			/>
			<View>
				{data.notificationType == 'CONNECTED' && (
					<Text style={styles.notificationText}>
						You are now connected with{' '}
						<Text style={styles.userName}>{data.userName}</Text>
					</Text>
				)}
			</View>
			<Text style={styles.time}>{formattedTime}</Text>
		</View>
	);
}
const getStyles = (colors: any) =>
	StyleSheet.create({
		notificationCont: {
			marginVertical: 5,
			padding: 10,
			flexDirection: 'row',
			alignItems: 'flex-start',
		},
		profileImg: {
			height: 50,
			width: 50,
			borderRadius: 25,
			marginRight: 10,
		},
		notificationText: {
			fontSize: 14,
			fontFamily: fonts.Inter_Medium,
			color: colors.APP_PRIMARY_LIGHT,
			flexWrap: 'wrap',
			width: responsiveWidth(63),
		},
		userName: {
			color: colors.TEXT,
		},
		time: {
			fontSize: 13,
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
		},
		icon: {
			padding: 4,
		},
	});
