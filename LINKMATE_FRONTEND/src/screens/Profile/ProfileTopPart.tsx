import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	Animated,
	TouchableOpacity,
} from 'react-native';
import React,{useRef,useState} from 'react';
import { AppButton } from '../../components/AppButton';
import { clearToken } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useCustomTheme } from '../../config/Theme';
import { RootState } from '../../redux/store';
import { fonts } from '../../config/Fonts';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../components/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import ProfilePicSection from './ProfilePicSection';
import ProfileTabBar from './ProfileTabBar';
export default function ProfileTopPart({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const dispatch = useDispatch();
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const handleLogout = () => {
		navigation.replace('Login');
		dispatch(clearToken());
	};
	return (
		<View style={styles.mainCont}>
			{userData ? (
				<View>
					<View style={styles.header}>
						<Text style={styles.username}>
							<MaterialCommunityIcon
								name="account"
								size={22}
								color={colors.TEXT}
							/>{' '}
							{userData.username}
						</Text>
						<TouchableOpacity onPress={()=>navigation.navigate("setting")} activeOpacity={0.4} >
						<AntDesign name="setting" padding={3} size={22} color={colors.TEXT} /></TouchableOpacity>
					</View>
					<ProfilePicSection data={userData} navigation={navigation} />
				</View>
			) : (
				<Loader />
			)}
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
      justifyContent:'space-between'
		},
		username: {
			fontSize: responsiveFontSize(3),
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
		},
        
	});
