import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useCustomTheme } from '../config/Theme';
import {
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import { globalStyles } from '../StylesSheet';
import { AppButton } from './AppButton';
import { fonts } from '../config/Fonts';
import OutlineButton from './OutlineButton';
import { revertConnectionRequest, sendConnectionRequest } from '../api/apis';
import Toast from 'react-native-simple-toast';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
export default function UserCard({ userData, navigation }) {
	const data = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [request,setRequest]=useState(false)
	const [loading,setLoading]=useState(false)
	const handleSendRqst=async(id:string)=>{
		setLoading(true)
		try{
			const response=await sendConnectionRequest(id);
			if(response){
			setRequest(true)
			Toast.show('Connection request sent', Toast.SHORT);
			}
		}catch(err){
			console.error(err)
		}
		finally{
			setLoading(false)
		}
	}

	const handleCancelRequest = async (id: string) => {
		setLoading(true);
		try {
			const response = await revertConnectionRequest(id);
			console.log(response)
			if (response) {
				setRequest(false);
				Toast.show('Connection request cancelled', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
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
				style={globalStyleSheet.description}
			>
				{userData.headline}
			</Text>
			{(request ||
				data?.sendConnectionsRequest.includes(userData.userId) ||
				!data?.connections.includes(userData.userId)) && (
				<OutlineButton
					onPress={() =>
						request || data?.sendConnectionsRequest.includes(userData.userId)
							? handleCancelRequest(userData.userId)
							: handleSendRqst(userData.userId)
					}
					title={
						request || data?.sendConnectionsRequest.includes(userData.userId)
							? 'Pending'
							: 'Connect'
					}
					icon={
						(request ||
							data?.sendConnectionsRequest.includes(userData.userId) ||
							loading) && (
							<AntDesign name="clockcircleo" color={colors.TEXT} size={12} />
						)
					}
				/>
			)}
			{data?.connections.includes(userData.userId) && (
				<OutlineButton
					title={'Message'}
					icon={<Feather name="send" color={colors.TEXT} size={12} />}
				/>
			)}
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
