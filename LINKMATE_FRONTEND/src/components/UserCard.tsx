import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useCustomTheme } from '../config/Theme';
import {
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import { globalStyles } from '../StylesSheet';
import OutlineButton from './OutlineButton';
import { revertConnectionRequest, sendConnectionRequest } from '../api/apis';
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { User } from '../types/compoundTypes';
import { NavigationProp } from '@react-navigation/native';
import { addConnectionRequests } from '../redux/slices/ConnectionRequestSlice';
import {
	addSendConnectionRequest,
	removeSendConnectionRequest,
	setUserDetails,
} from '../redux/slices/UserDetailsSlice';
export default function UserCard({
	userData,
	navigation,
}: {
	userData: User;
	navigation: NavigationProp<any>;
}) {
	const data = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const dispatch = useDispatch();
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loading, setLoading] = useState(false);
	const handleSendRqst = async (id: string) => {
		const prevData = data;
		dispatch(addSendConnectionRequest(id));
		try {
			const response = await sendConnectionRequest(id);
		} catch (err) {
			console.error(err);
			Toast.show('Something went wrong', Toast.SHORT);
			dispatch(setUserDetails(prevData));
		}
	};

	const handleCancelRequest = async (id: string) => {
		const prevData=data
		dispatch(removeSendConnectionRequest(id))
		try {
			const response = await revertConnectionRequest(id);
		} catch (err) {
			console.error(err);
			Toast.show('Something went wrong', Toast.SHORT);
			dispatch(setUserDetails(prevData));
		}  
	};
	return (
		<TouchableOpacity
			activeOpacity={0.4}
			onPress={() =>
				navigation.navigate('viewUserProfile', {
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
				style={[globalStyleSheet.description, { height: 40, lineHeight: 20 }]}
			>
				{userData.headline}
			</Text>
			{(data?.sendConnectionsRequest.includes(userData.userId) ||
				!data?.connections.includes(userData.userId)) && (
				<OutlineButton
					onPress={() =>
						data?.sendConnectionsRequest.includes(userData.userId)
							? handleCancelRequest(userData.userId)
							: handleSendRqst(userData.userId)
					}
					title={
						data?.sendConnectionsRequest.includes(userData.userId)
							? 'Pending'
							: 'Connect'
					}
					icon={
						(data?.sendConnectionsRequest.includes(userData.userId)) && (
							<AntDesign name="clockcircleo" color={colors.TEXT} size={12} />
						)
					}
				/>
			)}
			{data?.connections.includes(userData.userId) && (
				<OutlineButton
					onPress={() =>
						navigation.navigate('userChatDetail', { userDetails: userData })
					}
					title={'Message'}
					icon={<Feather name="send" color={colors.TEXT} size={12} />}
				/>
			)}
		</TouchableOpacity>
	);
}

const getStyles = (colors: any) =>
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
