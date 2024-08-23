import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { useCustomTheme } from '../config/Theme';
import { userDetails } from '../api/apis';
import { globalStyles } from '../StylesSheet';
import { fonts } from '../config/Fonts';
import moment from 'moment';
export default function PostCard({ data, navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	return (
		<View style={styles.mainCont}>
			<View style={styles.imgCont}>
				<Image
					style={styles.img}
					source={{ uri: data.userDetail.profilePicture }}
				/>
				<View>
					<Text style={globalStyleSheet.smallerHead}>
						{data.userDetail.username}
					</Text>
					<Text style={styles.time}>
						{moment(`${data.createdAt}+00:00`).utcOffset('+05:30').fromNow()}
					</Text>
				</View>
			</View>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			backgroundColor: colors.BACKGROUND,
			padding: 10,
			margin: 10,
			borderRadius: 20,
		},
		imgCont: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		img: {
			height: 50,
			width: 50,
			borderRadius: 25,
			marginRight: 10,
		},
		time: {
			fontSize: 10,
			color: colors.LIGHT_TEXT,
			fontFamily: fonts.Inter_Medium,
		},
	});
