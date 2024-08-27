import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useCustomTheme } from '../../config/Theme';
import { fonts } from '../../config/Fonts';
import { useRoute } from '@react-navigation/native';
import { globalStyles } from '../../StylesSheet';
import { getChatHistory } from '../../api/apis';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import { height, width } from '../../config/Dimension';
import { AppButton } from '../../components/AppButton';

export default function UserChatDetail({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const route = useRoute();
	const flatListRef = useRef(null);
	const { data } = route.params;
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [chatHistory, setChatHistory] = useState([]);
	const [initialLoad, setInitialLoad] = useState(true);
	const fetchChat = async () => {
		if (loading || !hasMore) return;
		try {
			const response = await getChatHistory(data.userId, page);
			console.log(response);
			if (response.content.length > 0) {
				setChatHistory((prevChatHistory) => [
					...prevChatHistory,
					...response.content,
				]);
				setPage(page + 1);
				setHasMore(response.content.length > 0);
			} else {
				setHasMore(false);
			}
		} catch (err) {
			console.error(err);
		} finally {
			if (initialLoad) setInitialLoad(false);
		}
	};

	useEffect(() => {
		fetchChat();
	}, []);

	const renderProfileHeader = () => (
		<View style={styles.profileView}>
			<Image
				style={styles.chatProfile}
				source={{ uri: data.profilePicture }} 
			/>
			<Text style={globalStyleSheet.smallHead}>
				{data.firstName + ' ' + data.lastName}
			</Text>
		</View>
	);
	return (
		<View style={styles.mainCont}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.profile}
					activeOpacity={0.4}
					onPress={() => navigation.goBack()}
				>
					<AntDesign name="arrowleft" size={22} color={colors.TEXT} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.profile}
					activeOpacity={0.4}
					onPress={() =>
						navigation.navigate('viewUserProfile', {
							username: data.username,
						})
					}
				>
					<Image style={styles.img} source={{ uri: data.profilePicture }} />
					<View>
						<Text style={globalStyleSheet.smallHead}>
							{data.firstName + ' ' + data.lastName}
						</Text>
						<Text style={globalStyleSheet.smalllestHead}>@{data.username}</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View>
				{!loading && (
					<FlatList
						data={chatHistory}
						style={styles.messageCont}
						keyExtractor={(item) => item.id}
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
								renderProfileHeader
							)
						}
						renderItem={({ item }) => (
							<View
								style={[
									styles.message,
									userData.userId == item.senderId
										? styles.senderMessage
										: styles.recieverMessage,
								]}
							>
								<Text
									style={
										userData.userId == item.senderId
											? styles.senderMessageText
											: styles.recieverMessageText
									}
								>
									{item.messageContent}
								</Text>
							</View>
						)}
					/>
				)}
			</View>
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
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.BACKGROUND,
			padding: 10,
		},
		profile: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		img: {
			height: 50,
			width: 50,
			borderRadius: 25,
			borderWidth: 0.2,
			borderColor: colors.APP_PRIMARY,
			marginHorizontal: 10,
		},
		messageCont: {
			paddingHorizontal: 15,
			marginBottom: responsiveHeight(15),
		},
		message: {
			marginVertical: 3,
			maxWidth: responsiveWidth(70),
		},
		senderMessage: {
			alignSelf: 'flex-end',
		},
		recieverMessage: {
			alignSelf: 'flex-start',
		},
		senderMessageText: {
			backgroundColor: colors.PRIMARY,
			color: colors.TEXT,
			fontSize: responsiveFontSize(2),
			padding: 10,
			borderTopLeftRadius: 25,
			borderTopRightRadius: 25,
			borderBottomLeftRadius: 25,
			textAlign: 'right',
		},
		recieverMessageText: {
			backgroundColor: colors.BACKGROUND,
			color: colors.TEXT,
			fontSize: responsiveFontSize(2),
			padding: 10,
			borderTopLeftRadius: 25,
			borderTopRightRadius: 25,
			borderBottomRightRadius: 25,
		},
		profileView: {
			borderBottomWidth: 0.3,
			borderColor: colors.APP_PRIMARY_LIGHT,
			alignItems: 'center',
			paddingVertical: 5,
            marginTop:responsiveHeight(30)
		},
		chatProfile: {
			height: 100,
			width: 100,
			borderRadius: 50,
			borderWidth: 0.2,
			borderColor: colors.APP_PRIMARY_LIGHT,
			marginBottom: 5,
		},
	});
