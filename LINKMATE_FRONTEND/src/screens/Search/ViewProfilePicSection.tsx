import {
	View,
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	TouchableOpacity,
	ScrollView,
	Image,
} from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';

import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import Toast from 'react-native-simple-toast';
import { fonts } from '../../config/Fonts';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { revertConnectionRequest, sendConnectionRequest } from '../../api/apis';
export default function ViewProfilePicSection({ navigation, searchUserData }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [request, setRequest] = useState(false);
	const handelCancelRequest = async (userId) => {
		try {
			const response = await revertConnectionRequest(userId);
			if (response) {
				Toast.show('Connection request cancelled', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
		}
	};
	const handelSendRequest = async (userId) => {
		try {
			const response = await sendConnectionRequest(userId);
			if (response) {
				Toast.show('Connection request sent', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
		}
	};
	console.log(searchUserData)
	return (
		<View style={styles.mainCont}>
			<View style={styles.profile}>
				<Image
					style={styles.pic}
					source={{
						uri:
							searchUserData?.profilePicture?.length > 0
								? searchUserData?.profilePicture
								: null,
					}}
				/>
				<View style={styles.countMainCont}>
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() =>
							navigation.navigate('userPosts', {
								userId: searchUserData.userId,
							})
						}
					>
						<View style={styles.count}>
							<Text style={styles.countText}>
								{searchUserData.posts.length}
							</Text>
							<Text style={styles.countHead}>Posts</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() =>
							navigation.navigate('myConnection', {
								userId: searchUserData.userId,
							})
						}
					>
						<View style={styles.count}>
							<Text style={styles.countText}>
								{searchUserData.connections?.length}
							</Text>
							<Text style={styles.countHead}>Connections</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<View style={styles.headlineCont}>
				<Text style={styles.name}>
					{searchUserData.firstName + ' ' + searchUserData.lastName}
				</Text>
				{searchUserData.headline && (
					<Text style={styles.headlineText}>{searchUserData.headline}</Text>
				)}
				{searchUserData.location && (
					<Text style={styles.locationText}>{searchUserData.location}</Text>
				)}
			</View>

			<View style={styles.buttonCont}>
				{(userData?.sendConnectionsRequest.includes(searchUserData.userId) ||
					request) && (
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() => handelCancelRequest(searchUserData.userId)}
					>
						<Text style={styles.button}>
							<AntDesign name="clockcircleo" color={colors.WHITE} size={14} />{' '}
							Pending
						</Text>
					</TouchableOpacity>
				)}
				{userData?.connections.includes(searchUserData.userId) && (
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() =>
							navigation.navigate('userChatDetail', {
								userDetails: searchUserData,
							})
						}
					>
						<Text style={styles.button}>
							<Feather name="send" size={14} color={colors.WHITE} /> Message
						</Text>
					</TouchableOpacity>
				)}
				{!userData?.connections.includes(searchUserData.userId) &&
					!request &&
					!userData?.sendConnectionsRequest.includes(searchUserData.userId) && (
						<TouchableOpacity
							activeOpacity={0.4}
							onPress={() => handelSendRequest(searchUserData.userId)}
						>
							<Text style={styles.button}>
								<Ionicons
									name="person-add-outline"
									color={colors.WHITE}
									size={14}
								/>{' '}
								Connect
							</Text>
						</TouchableOpacity>
					)}

				<Text style={styles.button}>
					<MaterialCommunityIcon name="share" size={18} color={colors.WHITE} />{' '}
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
			justifyContent: 'space-between',
		},
		pic: {
			width: 100,
			height: 100,
			borderRadius: 50,
		},
		countMainCont: {
			flexDirection: 'row',
			alignItems: 'center',
			marginHorizontal: 20,
			justifyContent: 'space-between',
		},
		count: {
			alignItems: 'center',
			width: responsiveWidth(25),
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
			color: colors.APP_PRIMARY,
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
			color: colors.WHITE,
			fontFamily: fonts.Inter_Medium,
			fontSize: 14,
			width: responsiveWidth(45),
			textAlign: 'center',
			borderRadius: 5,
		},
	});
