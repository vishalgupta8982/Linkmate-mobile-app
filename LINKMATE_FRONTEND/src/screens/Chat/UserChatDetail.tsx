import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	TextInput,
} from 'react-native';
import uuid from 'react-native-uuid';
import moment from 'moment-timezone';
import Feather from 'react-native-vector-icons/Feather';
import React, { useEffect, useState, useRef } from 'react';
import { useCustomTheme } from '../../config/Theme';
import { fonts } from '../../config/Fonts';
import { deleteMessageForEveryOne, getChatHistory } from '../../api/apis';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import WebSocketService from '../../utils/WebSocketService';
import { RootState } from '../../redux/store';
import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import notifee from '@notifee/react-native';
import ChatUserDetailHeader from './ChatUserDetailHeader';
import {
	addMessages,
	addPendingMessage,
	deleteChatHistory,
	deleteStoreMessage,
	doesUserExistInChats,
	markMessagesAsRead,
	selectChatPageByUser,
	selectHasMoreByUser,
	selectMessagesByUser,
} from '../../redux/slices/ChatSlice';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MainHeader from './MainHeader';
import CustomAlertDialog from '../../components/CustomAlertDialog';
import { RootStackParamList } from '../../navigation/MainStackNav';
type Tprops = NativeStackScreenProps<RootStackParamList, 'userChatDetail'>;
export default function UserChatDetail({ navigation, route }: Tprops) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { userDetails } = route.params;
	const userId = userDetails.userId;
	const dispatch = useDispatch();
	const flatListRef = useRef(null);
	const { colors } = theme;
	const styles = getStyles(colors);
	const [message, setMessage] = useState('');
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [deleteMessageId, setDeleteMessageId] = useState('');
	const isOnlyEmojis = (text) => {
		const emojiRegex = /^[\p{Emoji}\u200d\s]+$/u;
		return emojiRegex.test(text);
	};

	const userExists = useSelector((state: RootState) =>
		doesUserExistInChats(state, userId)
	);
	const chatHistory = useSelector((state: RootState) =>
		selectMessagesByUser(state, userId)
	);
	const page = useSelector((state: RootState) =>
		selectChatPageByUser(state, userId)
	);
	const hasMore = useSelector((state: RootState) =>
		selectHasMoreByUser(state, userId)
	);
	const [initialLoad, setInitialLoad] = useState(userExists ? false : true);
	const fetchChat = async () => {
		if (!hasMore) return;
		try {
			const response = await getChatHistory(userId, page);
			if (response.content.length > 0) {
				dispatch(
					addMessages({
						userId: userId,
						messages: response.content,
						page: page + 1,
						hasMore: response.content.length > 0,
					})
				);
				if (initialLoad) {
					handleReadMessage();
				}
			} else {
				dispatch(
					addMessages({
						userId: userId,
						messages: [],
						page: page,
						hasMore: false,
					})
				);
			}
		} catch (err) {
			console.error(err);
		} finally {
			if (initialLoad) setInitialLoad(false);
		}
	};
	useEffect(() => {
		const unsubscribe = navigation.addListener('beforeRemove', () => {
			dispatch(markMessagesAsRead({ userId: userId, newMessageCall: true }));
		});
		return unsubscribe;
	}, [navigation, dispatch]);
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', async () => {
			try {
				await notifee.cancelAllNotifications();
			} catch (error) {
				console.error('Error canceling notifications:', error);
			}
		});
		return unsubscribe;
	}, [navigation]);
	useEffect(() => {
		if (!userExists) {
			setInitialLoad(true);
			fetchChat();
		}
	}, []);
	const deleteMessage = async () => {
		setAlertDialogVisible(false);
		const deleteMessage = {
			messageNonRemover: userId,
			messageRemover: userData?.userId,
			messageId: deleteMessageId,
		};
		WebSocketService.sendChatMessage(
			'DELETE_MESSAGE_FOR_EVERYONE',
			deleteMessage
		);
		setDeleteMessageId('')
	};
	const handleReadMessage = () => {
		const readMessage = {
			readerId: userId,
			userId: userData?.userId,
		};
		WebSocketService.sendChatMessage('MESSAGE_TYPE_READ', readMessage);
	};

	const handleSendChatMessage = () => {
		const tempMessageId = uuid.v4();
		const chatMessage = {
			senderId: userData?.userId,
			receiverId: userId,
			messageContent: message,
			messageType: 'TEXT',
			status: 'pending',
		};
		dispatch(
			addPendingMessage({
				userId,
				message: {
					senderId: userData?.userId,
					receiverId: userId,
					messageContent: message,
					messageType: 'TEXT',
					messageId: tempMessageId,
					status: 'pending',
				},
			})
		);
		WebSocketService.sendChatMessage('MESSAGE_TYPE_CHAT', {
			content: chatMessage,
			tempMessageId,
		});
		setMessage('');
	};
	useEffect(() => {
		if (
			chatHistory.length > 0 &&
			chatHistory[0].senderId !== userData?.userId
		) {
			handleReadMessage();
		}
	}, [chatHistory[0]]);
	return (
		<View style={styles.mainCont}>
			{initialLoad && <Loader />}
			<>
				<MainHeader data={userDetails} navigation={navigation} />
				{!initialLoad && (
					<FlatList
						data={chatHistory}
						style={styles.messageCont}
						keyExtractor={(item) => `${item.messageId}-${userId}`}
						initialNumToRender={20}
						onEndReached={() => {
							if (!initialLoad) {
								fetchChat();
							}
						}}
						onEndReachedThreshold={0.1}
						inverted
						ref={(ref) => {
							flatListRef.current = ref;
						}}
						ListFooterComponent={
							hasMore ? (
								<ActivityIndicator size={32} color={colors.PRIMARY} />
							) : (
								<ChatUserDetailHeader
									navigation={navigation}
									data={userDetails}
								/>
							)
						}
						renderItem={({ item }) => {
							return (
								<View>
									{/* {showNewMessageIndicator && (
										<View style={styles.newMessageCont}>
											<View style={styles.borderLine}></View>
											<Text style={styles.newMessageText}>New messages</Text>
											<View style={styles.borderLine}></View>
										</View>
									)} */}
									<View
										style={[
											styles.message,
											userData?.userId === item.senderId
												? styles.senderMessage
												: styles.recieverMessage,
										]}
									>
										<TouchableOpacity
											activeOpacity={1}
											onLongPress={() => {
												if (item.status !== 'pending') {
													if (userData?.userId === item.senderId) {
														setDeleteMessageId(item.messageId);
														setAlertDialogVisible(true);
													}
												}
											}}
										>
											<View style={styles.pendingCont}>
												<View
													style={[
														isOnlyEmojis(item.messageContent)
															? styles.emojiOnlyMessageCont
															: userData?.userId === item.senderId
															? styles.senderMessageCont
															: styles.recieverMessageCont,
													]}
												>
													<Text
														style={[
															isOnlyEmojis(item.messageContent)
																? styles.emojiOnlyMessageText
																: userData?.userId === item.senderId
																? styles.senderMessageText
																: styles.recieverMessageText,
														]}
													>
														{item.messageContent}
													</Text>
													<Text
														style={[
															userData?.userId === item.senderId
																? styles.senderTime
																: styles.recieverTime,
														]}
													>
														{moment
															.parseZone(item.createdAt)
															.tz('Asia/Kolkata')
															.format('hh:mm A')}
													</Text>
												</View>
												{item.status == 'pending' && (
													<View style={styles.pendingIcon}>
														<Feather
															name="clock"
															size={12}
															color={colors.APP_PRIMARY_LIGHT}
														/>
													</View>
												)}
											</View>
											{chatHistory[0].messageId === item.messageId &&
												item.read &&
												userData?.userId === item.senderId && (
													<Text style={styles.seen}>Seen</Text>
												)}
										</TouchableOpacity>
									</View>
								</View>
							);
						}}
					/>
				)}
				<View style={styles.inputCont}>
					<TextInput
						selectionColor={colors.PRIMARY}
						placeholderTextColor={colors.TEXT}
						style={styles.input}
						placeholder="Type message here.."
						value={message}
						onChangeText={setMessage}
					/>

					<TouchableOpacity activeOpacity={1} onPress={handleSendChatMessage}>
						<View style={styles.sendIcon}>
							<Feather name="send" color={colors.WHITE} size={18} />
						</View>
					</TouchableOpacity>
				</View>
			</>
			<CustomAlertDialog
				isOpen={alertDialogVisible}
				onClose={() => setAlertDialogVisible(false)}
				title={'Delete for everyone?'}
				message={'Are you sure you want to delete message for everyone?'}
				ButtonText={'Delete'}
				onConfirm={deleteMessage}
			/>
		</View>
	);
}
const getStyles = (colors: any) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		messageCont: {
			paddingHorizontal: 15,
			marginBottom: responsiveHeight(8),
		},
		message: {
			marginVertical: 6,
			maxWidth: responsiveWidth(70),
		},
		senderMessage: {
			alignSelf: 'flex-end',
		},
		recieverMessage: {
			alignSelf: 'flex-start',
		},
		senderMessageCont: {
			backgroundColor: colors.PRIMARY,
			padding: 8,
			borderTopLeftRadius: 20,
			borderTopRightRadius: 20,
			borderBottomLeftRadius: 20,
		},
		recieverMessageCont: {
			backgroundColor: colors.LIGHT_MAIN_BACKGROUND,
			borderTopLeftRadius: 20,
			borderTopRightRadius: 20,
			borderBottomRightRadius: 20,
			padding: 8,
		},
		emojiOnlyMessageCont: {
			paddingHorizontal: 8,
		},
		senderMessageText: {
			color: colors.WHITE,
			fontSize: responsiveFontSize(2),
			textAlign: 'right',
			fontFamily: fonts.Inter_Regular,
		},
		recieverMessageText: {
			color: colors.TEXT,
			fontSize: responsiveFontSize(2),
			fontFamily: fonts.Inter_Regular,
		},
		emojiOnlyMessageText: {
			fontSize: responsiveFontSize(4),
			fontFamily: fonts.Inter_Regular,
			lineHeight: responsiveFontSize(5),
			color: '#fff',
		},
		recieverTime: {
			fontSize: 8,
			color: colors.APP_PRIMARY_LIGHT,
		},
		senderTime: {
			fontSize: 8,
			color: colors.WHITE,
			textAlign: 'right',
		},
		seen: {
			color: colors.TEXT,
			fontSize: responsiveFontSize(1.4),
			fontFamily: fonts.Inter_Medium,
			textAlign: 'right',
		},
		inputCont: {
			flexDirection: 'row',
			alignItems: 'center',
			position: 'absolute',
			bottom: 10,
			left: 10,
			right: 10,
			justifyContent: 'center',
		},
		input: {
			backgroundColor: colors.LIGHT_MAIN_BACKGROUND,
			padding: 10,
			paddingHorizontal: 20,
			fontSize: 16,
			borderRadius: 30,
			width: '85%',
			marginRight: 5,
			color: colors.TEXT,
		},
		sendIcon: {
			padding: 10,
			backgroundColor: colors.PRIMARY,
			borderRadius: 40,
		},
		newMessageCont: {
			flexDirection: 'row',
			alignItems: 'center',
			marginVertical: 8,
		},
		borderLine: {
			flex: 1,
			backgroundColor: colors.PRIMARY,
			borderWidth: 1,
		},
		newMessageText: {
			marginHorizontal: 15,
			color: colors.TEXT,
			fontSize: responsiveFontSize(1.7),
			fontFamily: fonts.Inter_Medium,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		pendingCont: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		pendingIcon:{
			marginLeft:5
		}
	});
