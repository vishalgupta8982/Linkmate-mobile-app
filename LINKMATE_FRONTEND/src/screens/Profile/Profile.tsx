import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
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
export default function Profile({ navigation }) {
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
		<ScrollView>
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
							<AntDesign name="setting" size={22} color={colors.TEXT} />
						</View>
						<ProfilePicSection data={userData} navigation={navigation} />
					</View>
				) : (
					<Loader />
				)}
			</View>
			<AppButton title={'Log out'} onPress={handleLogout} />
		</ScrollView>
	);
}
const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
			height:responsiveHeight(100)
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
