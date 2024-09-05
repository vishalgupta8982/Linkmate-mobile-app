import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	Animated,
	TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { AppButton } from '../../components/AppButton';
import { clearToken } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useCustomTheme } from '../../config/Theme';
import { RootState } from '../../redux/store';
import { fonts } from '../../config/Fonts';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../components/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
	responsiveFontSize,
	responsiveHeight,
} from 'react-native-responsive-dimensions';
import ViewProfilePicSection from './ViewProfilePicSection';
import ProfileTabBar from './ProfileTabBar';
import { getSearchUserDetail } from '../../api/apis';
export default function ViewProfileTopPart({ navigation, userName }) {
	const dispatch = useDispatch();
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const[userDetails,setUserDetail]=useState([])
	const[loader,setLoader]=useState(true)
	const searchUserDetail=async()=>{
		try{
			const response=await getSearchUserDetail(userName)
			setUserDetail(response)
		}catch(err){
			console.error(err)
		}
		finally{
			setLoader(false)
		}
	}
	useEffect(() => {
		searchUserDetail();
	}, [userName]);
	return (
		<View style={styles.mainCont}>
			<View>
				<View style={styles.header}>
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() => navigation.goBack()}
					>
						<AntDesign
							name="arrowleft"
							padding={3}
							size={22}
							color={colors.TEXT}
						/>
					</TouchableOpacity>
					<Text style={styles.username}> {userName}</Text>
				</View>
				{!loader ? (
					<ViewProfilePicSection
						searchUserData={userDetails}
						navigation={navigation}
					/>
				) : (
					<Loader />
				)}
			</View>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		header: {
			backgroundColor: colors.BACKGROUND,
			padding: 10,
			paddingHorizontal: 20,
			flexDirection: 'row',
			alignItems: 'center',
		},
		username: {
			fontSize: responsiveFontSize(3),
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
		},
	});
