import notifee, {
	AndroidImportance,
	AndroidStyle,
} from '@notifee/react-native';

export const displayNotification = async (remoteMessage:Array) => {
	console.log("remoteMessage",remoteMessage)
	// Create a notification channel
	const channelId = await notifee.createChannel({
		id: 'default',
		name: 'Default Channel',
		importance: AndroidImportance.HIGH,
	});

	// Request notification permissions
	await notifee.requestPermission();

	// Configure Android-specific settings
	const androidConfig = {
		channelId,
		importance: AndroidImportance.HIGH,
 	};
		androidConfig.largeIcon =`${remoteMessage[0].profilePicture}`;
	// Display the notification
	await notifee.displayNotification({
		title: 'New Connection Request!',
		body: `${remoteMessage[0].firstName+" "+remoteMessage[0].lastName} wants to connect with you.`,
		android: androidConfig,
	});
};
