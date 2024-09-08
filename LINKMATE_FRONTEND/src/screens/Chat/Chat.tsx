import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Image,
	TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomTheme } from '../../config/Theme';
import ChatHeader from './ChatHeader';
import { getChatInteraction } from '../../api/apis';
import { globalStyles } from '../../StylesSheet';
import {
	responsiveFontSize,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import moment from 'moment';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addInteraction, selectInteractions, updateInteraction } from '../../redux/slices/ChatSlice';
export default function Chat({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	 const chatInteraction = useSelector(selectInteractions);
	const theme = useCustomTheme();
	const dispatch=useDispatch()
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);
	const fetchInteraction = async () => {
		try {
			const response = await getChatInteraction();
			dispatch(addInteraction(response))
		} catch (err) {
			console.error(err);
		} finally {
			setLoader(false);
		}
	};
	useEffect(() => {
		if(chatInteraction.length<1){
			setLoader(true)
		fetchInteraction();
		}
	}, []);
	return (
		<View style={styles.mainCont}>
			<ChatHeader navigation={navigation} />
			{loader ? (
				<Loader />
			) : (
				<FlatList
					data={chatInteraction}
					kayExtractor={(item) => item.userId}
					renderItem={({ item }) => (
						<TouchableOpacity
							activeOpacity={0.4}
							onPress={() =>
								navigation.navigate('userChatDetail', { userDetails: item })
							}
						>
							<View style={[styles.list,item.lastMessage.senderId != userData.userId &&
												item.numberOfUnreadMessage > 0 && styles.unreadList]}>
								<Image
									style={styles.img}
									source={{ uri: item.profilePicture }}
								/>
								<View>
									<View style={styles.time}>
										<Text style={globalStyleSheet.smallerHead}>
											{item.firstName + ' ' + item.lastName}
										</Text>
										<Text style={globalStyleSheet.smallFontDescription}>
											{moment(item.lastMessage.createdAt).calendar(null, {
												sameDay: 'h:mm A',
												nextDay: '[Tomorrow] ',
												nextWeek: 'ddd ',
												lastDay: '[Yesterday] ',
												lastWeek: 'ddd ',
												sameElse: 'D MMM',
											})}
										</Text>
									</View>
									<Text
										numberOfLines={1}
										ellipsizeMode={'tail'}
										style={[
											styles.message,
											item.lastMessage.senderId != userData.userId &&
												item.numberOfUnreadMessage > 0 && styles.unread,
										]}
									>
										{item.lastMessage.senderId === userData.userId
											? item.lastMessage.read
												? 'seen'
												: 'sent'
											: item.numberOfUnreadMessage > 0
											? `${item.numberOfUnreadMessage} New messages`
											: item.lastMessage.messageContent}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					)}
				/>
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
		list: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 10,
			paddingVertical: 10,
			width: responsiveWidth(100),
			backgroundColor: colors.BACKGROUND,
			marginVertical: 5,
		},
		img: {
			height: 50,
			width: 50,
			borderRadius: 25,
			borderWidth: 0.2,
			borderColor: colors.APP_PRIMARY,
			marginRight: 10,
		},
		message: {
			fontFamily: fonts.Inter_Medium,
			color: colors.APP_PRIMARY_LIGHT,
			fontSize: responsiveFontSize(1.8),
			width: responsiveWidth(70),
		},
		time: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			width: responsiveWidth(75),
		},
		unreadList: {
			backgroundColor: colors.LIGHT_MAIN_BACKGROUND,
		},
		unread: {
			color: colors.PRIMARY,
		},
	});
