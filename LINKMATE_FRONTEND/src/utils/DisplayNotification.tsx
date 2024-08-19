import notifee, {
	AndroidImportance,
	AndroidStyle,
} from '@notifee/react-native';

export const displayNotification = async (remoteMessage) => {
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
		androidConfig.largeIcon =
			'https://res.cloudinary.com/dytlgwywf/image/upload/v1724069808/v1mfgsv3mroie0s18b6n.jpg';
            androidConfig.picture='https://res.cloudinary.com/dytlgwywf/image/upload/v1724069808/v1mfgsv3mroie0s18b6n.jpg'
	// Display the notification
	await notifee.displayNotification({
		title: '📩 New Connection Request!',
		body: '👤 John Doe wants to connect with you.',
		android: androidConfig,
	});
};
