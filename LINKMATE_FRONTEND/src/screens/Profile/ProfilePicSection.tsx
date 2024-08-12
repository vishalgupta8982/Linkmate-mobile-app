import {
	View,
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import { Avatar } from 'native-base';
import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { fonts } from '../../config/Fonts';
export default function ProfilePicSection({ navigation, data }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [openAS, setOpenAS] = useState(false);
	const [filePath, setFilePath] = useState({});
	return (
		<View style={styles.mainCont}>
			<View style={styles.profile}>
				<Avatar
					bg={colors.PRIMARY}
					alignSelf="left"
					size="xl"
					source={{
						uri:
							data?.profilePicture.length > 0
								? data?.profilePicture
								: null,
					}}
				>
					{data.firstName[0].toUpperCase() + data.lastName[0].toUpperCase()}
				</Avatar>
				<View style={styles.countMainCont}>
					<View style={styles.count}>
						<Text style={styles.countText}>0</Text>
						<Text style={styles.countHead}>Posts</Text>
					</View>
					<View style={styles.count}>
						<Text style={styles.countText}>{data.connections.length}</Text>
						<Text style={styles.countHead}>Mutual</Text>
					</View>
					<View style={styles.count}>
						<Text style={styles.countText}>{data.connections.length}</Text>
						<Text style={styles.countHead}>Connections</Text>
					</View>
				</View>
			</View>
			<View style={styles.headlineCont}>
				<Text style={styles.name}>{data.firstName + ' ' + data.lastName}</Text>
				<Text style={styles.headlineText}>{data.headline}</Text>
				<Text style={styles.locationText}>{data.location}</Text>
			</View>

			<View style={styles.buttonCont}>
				<TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
					<Text style={styles.button}>
						<MaterialCommunityIcon
							name="account-edit-outline"
							size={18}
							color={colors.TEXT}
						/>
						Edit profile
					</Text>
				</TouchableOpacity>
				<Text style={styles.button}>
					<MaterialCommunityIcon name="share" size={18} color={colors.TEXT} />{' '}
					Share profile
				</Text>
			</View>
		</View>
	);
}
const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			padding: 10,
		},
		profile: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		countMainCont: {
			flexDirection: 'row',
			alignItems: 'center',
			marginLeft: 20,
			justifyContent: 'space-between',
		},
		count: {
			alignItems: 'center',
			width: responsiveWidth(20),
		},
		countText: {
			fontSize: 22,
			color: colors.TEXT,
			fontFamily: fonts.Inter_Medium,
		},
		countHead: {
			color: colors.TEXT,
			fontSize: 12,
		},
		headlineCont: {
			marginTop: 10,
		},
		name: {
			fontSize: responsiveFontSize(2.3),
			color: colors.TEXT,
			fontFamily: fonts.Inter_Medium,
			lineHeight: responsiveFontSize(3.2),
		},
		headlineText: {
			fontSize: responsiveFontSize(2),
			color: colors.TEXT,
			fontFamily: fonts.Inter_Regular,
			lineHeight: responsiveFontSize(3.2),
		},
		locationText: {
			fontSize: responsiveFontSize(1.9),
			color: colors.APP_PRIMARY_LIGHT,
			fontFamily: fonts.Inter_Regular,
			lineHeight: responsiveFontSize(2),
			marginTop: 5,
		},
		buttonCont: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			marginTop: 10,
		},
		button: {
			backgroundColor: colors.PRIMARY,
			padding: 7,
			color: colors.TEXT,
			fontFamily: fonts.Inter_Medium,
			fontSize: 14,
			width: responsiveWidth(45),
			textAlign: 'center',
			borderRadius: 5,
		},
	});
