import notifee, {
	AndroidImportance,
	AndroidStyle,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { setNotificationCount } from '../redux/slices/CountNotificationMessage';
import { store } from '../redux/store';

export const initMessaging = async () => {
	try {
		await messaging().requestPermission();
		messaging().onMessage(async (remoteMessage) => {
			await displayNotification(remoteMessage.data);
		});

		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			await displayNotification(remoteMessage.data);
		});
	} catch (error) {
		console.error('Error initializing messaging:', error);
	}
};

export const displayNotification = async (remoteMessage: any) => {
	if (remoteMessage.type == 'NOTIFICATION_PAGE'){
		store.dispatch(setNotificationCount(1));
	}
	const channelId = await notifee.createChannel({
		id: 'default',
		name: 'Default Channel',
		importance: AndroidImportance.HIGH,
		sound: 'default',
	});
	await notifee.requestPermission();
	const androidConfig = {
		channelId,
		importance: AndroidImportance.HIGH,
		sound: 'default',
	};
	if (remoteMessage.image) {
		androidConfig.largeIcon = remoteMessage.image;
	}
	await notifee.displayNotification({
		id:remoteMessage.type,
		title: remoteMessage.title,
		body: remoteMessage.body,
		android: androidConfig,
	});
};
