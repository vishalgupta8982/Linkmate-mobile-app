import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	FlatList,
} from 'react-native';
import React from 'react';
import { useCustomTheme } from '../../config/Theme';
import StackHeader from '../../components/StackHeader';
import { deleteNotifications, getAllConnectionRequest, getNotifications, markReadNotifications } from '../../api/apis';
import { useState } from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useEffect } from 'react';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { globalStyles } from '../../StylesSheet';
import ConnectionRequest from './ConnectionRequest';
import Loader from '../../components/Loader';
import NotificationTray from '../../components/NotificationTray';
import CustomAlertDialog from '../../components/CustomAlertDialog';
import Toast from 'react-native-simple-toast';
export default function Notification({ navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [notification, setNotification] = useState<Notification>();
	const [loader, setLoader] = useState(false);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [dltNotificationId, setDltNotificationId] = useState('');
	const fetchNotification = async () => {
		setLoader(true);
		try {
			const response = await getNotifications();
			setNotification(response);
		} catch (err) {
			console.error(err);
		} finally {
			setLoader(false);
		}
	};
	const markRead=async()=>{
		try{
			await markReadNotifications();
		}
		catch(err){
			console.error(err)
		}
	}
	useEffect(() => {
		fetchNotification();
		markRead()
	}, []);
	 const handleDelete = async () => {
		setAlertDialogVisible(false)
		const prevData=notification
		const newData=prevData.filter((item) => item.id !== dltNotificationId);
	  setNotification(newData);
			try {
				const response = await deleteNotifications(dltNotificationId);
			} catch (err) {
				console.error(err);
				setNotification(prevData);
				Toast.show('Something went wrong', Toast.SHORT);
			}finally{
				setDltNotificationId('')
			}
		};
	return (
		<View style={styles.mainCont}>
				{loader && <Loader />}
				<View>
					<StackHeader title="Notifications" navigation={navigation} />
					<ConnectionRequest navigation={navigation} />
				</View>
				<FlatList
					data={notification}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<TouchableOpacity
							activeOpacity={0.4}
							onPress={() =>
								navigation.navigate('viewUserProfile', {
									username: item.userName,
								})
							}
							onLongPress={() => {
								setDltNotificationId(item.id);
								setAlertDialogVisible(true);
							}}
						>
							<NotificationTray navigation={navigation} data={item} />
						</TouchableOpacity>
					)}
				/>
				<CustomAlertDialog
					isOpen={alertDialogVisible}
					onClose={() => setAlertDialogVisible(false)}
					title={'Delete Notification?'}
					message={'Are you sure you want to delete this notification?'}
					ButtonText={'Delete'}
					onConfirm={handleDelete}
				/>
		 
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
			 
		},
	});
