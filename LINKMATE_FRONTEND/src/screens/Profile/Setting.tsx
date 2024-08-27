import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Switch,
	TouchableOpacity,
} from 'react-native';
import React from 'react';
import StackHeader from '../../components/StackHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCustomTheme } from '../../config/Theme';
import { fonts } from '../../config/Fonts';
import CustomAlertDialog from '../../components/CustomAlertDialog';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/ThemeSlice';
import { useState } from 'react';
import { clearToken } from '../../redux/slices/authSlice';
import { persistor } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUserDetail } from '../../redux/slices/UserDetailsSlice';
import WebSocketService from '../../utils/WebSocketService';
export default function Setting({ navigation }) {
	const dispatch = useDispatch();
	const currentTheme = useSelector((state) => state.theme.theme);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const handleToggle = () => {
		dispatch(toggleTheme());
	};
	const handleLogout = async () => {
		dispatch(clearToken());
		WebSocketService.disconnect();
		await navigation.replace('Login');
	};
	return (
		<ScrollView style={styles.mainCont}>
			<StackHeader title="Settings" navigation={navigation} />
			<View style={styles.headCont}>
				<View style={styles.iconName}>
					<FontAwesome name="moon-o" size={16} color={colors.TEXT} />
					<Text style={styles.head}>Dark Mode</Text>
				</View>
				<Switch
					trackColor={{
						true: colors.PRIMARY,
						false: colors.APP_PRIMARY,
					}}
					ml={'auto'}
					thumbColor={
						currentTheme === 'dark' ? colors.PRIMARY : colors.APP_PRIMARY_LIGHT
					}
					onChange={handleToggle}
					value={currentTheme === 'dark' ? true : false}
				/>
			</View>
			<TouchableOpacity
				style={styles.headCont}
				onPress={() => setAlertDialogVisible(true)}
				activeOpaceity={0.4}
			>
				<View style={styles.iconName}>
					<MaterialIcons name="logout" size={16} color={colors.TEXT} />
					<Text style={styles.head}>Logout</Text>
				</View>
			</TouchableOpacity>
			<CustomAlertDialog
				isOpen={alertDialogVisible}
				onClose={() => setAlertDialogVisible(false)}
				title={'Logout'}
				message={'Are you sure you want to logout?'}
				ButtonText={'Logout'}
				onConfirm={handleLogout}
			/>
		</ScrollView>
	);
}
const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		headCont: {
			padding: 10,
			backgroundColor: colors.BACKGROUND,
			marginTop: 5,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		head: {
			color: colors.TEXT,
			fontFamily: fonts.Inter_Regular,
			fontSize: responsiveFontSize(2.2),
			marginLeft: 4,
		},
		iconName: {
			flexDirection: 'row',
			alignItems: 'center',
		},
	});
