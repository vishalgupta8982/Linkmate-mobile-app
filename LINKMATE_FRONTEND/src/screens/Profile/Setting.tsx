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
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebSocketService from '../../utils/WebSocketService';
import { deleteFcmToken } from '../../api/apis';
import Loader from '../../components/Loader';
export default function Setting({ navigation }) {
	const [loader, setLoader] = useState(false);
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
		setLoader(true);
		try {
			setAlertDialogVisible(false);
			await deleteFcmToken();
			WebSocketService.disconnect();
			dispatch({ type: 'RESET' });
			await AsyncStorage.clear();
			setLoader(false);
			navigation.reset({
				index: 0,
				routes: [{ name: 'Login' }],
			});
		} catch (err) {
			console.error('logout', err);
		}
	};
	return (
		<ScrollView style={styles.mainCont}>
			<StackHeader title="Settings" navigation={navigation} />
			<View style={styles.headCont}>
				{loader && <Loader />}
				<View style={styles.iconName}>
					<FontAwesome name="moon-o" size={16} color={colors.TEXT} />
					<Text style={styles.head}>Dark Mode</Text>
				</View>
				<Switch
					trackColor={{
						true: colors.PRIMARY,
						false: colors.APP_PRIMARY,
					}}
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
				activeOpacity={0.4}
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
const getStyles = (colors: any) =>
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
