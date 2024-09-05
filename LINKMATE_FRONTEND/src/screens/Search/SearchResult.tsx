import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	FlatList,
	Image,
} from 'react-native';
import React, { useState } from 'react';
import {
	revertConnectionRequest,
	searchUser,
	sendConnectionRequest,
} from '../../api/apis';
import { useEffect, useRef } from 'react';
import Loader from '../../components/Loader';
import { useCustomTheme } from '../../config/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { fonts } from '../../config/Fonts';
import _ from 'lodash';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Toast from 'react-native-simple-toast';
import Feather from 'react-native-vector-icons/Feather';
export default function SearchResult({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [query, setQuery] = useState('');
	const [request, setRequest] = useState(false);
	const [loading, setLoading] = useState(false);
	const [searchResult, setSearchResult] = useState([]);
	const debouncedSearch = useRef(
		_.debounce(async (query: string) => {
			setLoading(true);
			const test = query.length < 1 ? '' : query;
			try {
				const response = await searchUser(test);
				setSearchResult(response);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}, 200)
	).current;
	const handleChangeText = (text) => {
		setQuery(text);
		debouncedSearch(text);
	};

	const handelCancelRequest = async (userId) => {
		try {
			const response = await revertConnectionRequest(userId);
			if (response) {
				Toast.show('Connection request cancelled', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
		}
	};
	const handelSendRequest = async (userId) => {
		try {
			const response = await sendConnectionRequest(userId);
			if (response) {
				Toast.show('Connection request sent', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<View style={styles.mainCont}>
			{loading && <Loader />}
			<View style={styles.back}>
				<TouchableOpacity
					activeOpacity={0.4}
					onPress={() => navigation.goBack()}
				>
					<AntDesign
						name="arrowleft"
						size={18}
						marginHorizontal={5}
						padfig={5}
						color={colors.TEXT}
					/>
				</TouchableOpacity>
				<View style={styles.searchCont}>
					<Ionicons name="search" color={colors.PRIMARY} size={18} />
					<TextInput
						onChangeText={handleChangeText}
						style={styles.input}
						selectionColor={colors.PRIMARY}
						placeholder="Type here to search..."
						placeholderTextColor={colors.TEXT}
					/>
				</View>
			</View>
			<FlatList
				data={searchResult}
				keyExtractor={(item, index) => item.userId}
				renderItem={({ item }) => {
					const hasSentRequest = userData?.sendConnectionsRequest.includes(
						item.userId
					);
					const isConnected = userData?.connections.includes(item.userId);
					const isCurrentUser = userData.username === item.username;

					return (
						<TouchableOpacity
							activeOpacity={0.4}
							onPress={() =>
								navigation.navigate(
									isCurrentUser ? 'Profile' : 'viewUserProfile',
									{ username: item.username }
								)
							}
						>
							<View style={styles.list}>
								<Image
									style={styles.profile}
									source={{ uri: item.profilePicture }}
								/>
								<View style={styles.nameCont}>
									<Text style={styles.name}>
										{item.firstName} {item.lastName}
									</Text>
									<Text
										style={styles.headline}
										numberOfLines={1}
										ellipsizeMode="tail"
									>
										{item.headline}
									</Text>
								</View>
								{(request || hasSentRequest) && (
									<TouchableOpacity
										activeOpacity={0.4}
										onPress={() => handelCancelRequest(item.userId)}
									>
										<AntDesign
											name="clockcircleo"
											color={colors.TEXT}
											size={16}
											padding={4}
										/>
									</TouchableOpacity>
								)}
								{!isConnected &&
									!hasSentRequest &&
									!request &&
									!isCurrentUser && (
										<TouchableOpacity
											activeOpacity={0.4}
											onPress={() => handelSendRequest(item.userId)}
										>
											<Ionicons
												name="person-add-outline"
												color={colors.TEXT}
												size={20}
												padding={4}
											/>
										</TouchableOpacity>
									)}
								{isConnected && (
									<TouchableOpacity
										activeOpacity={0.4}
										onPress={() =>
											navigation.navigate('userChatDetail', {
												userDetails: item,
											})
										}
									>
										<Feather
											name="send"
											color={colors.TEXT}
											size={16}
											padding={6}
										/>
									</TouchableOpacity>
								)}
							</View>
						</TouchableOpacity>
					);
				}}
			/>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			backgroundColor: colors.MAIN_BACKGROUND,
			flex: 1,
		},
		searchCont: {
			borderWidth: 1,
			borderColor: colors.PRIMARY,
			borderRadius: 5,
			flexDirection: 'row',
			alignItems: 'center',
			margin: 5,
			paddingHorizontal: 10,
			marginBottom: 5,
			width: '87%',
		},
		input: {
			fontSize: 14,
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
			width: '80%',
		},

		back: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		list: {
			marginTop: 5,
			padding: 5,
			paddingHorizontal: 10,
			flexDirection: 'row',
			alignItems: 'center',
			width: responsiveWidth(90),
			justifyContent: 'space-between',
		},
		profile: {
			width: 50,
			height: 50,
			borderRadius: 25,
			marginRight: 10,
		},
		name: {
			color: colors.TEXT,
			fontFamily: fonts.Inter_Medium,
			fontSize: 16,
		},
		headline: {
			color: colors.APP_PRIMARY_LIGHT,
			fontFamily: fonts.Inter_Medium,
			fontSize: 12,
		},
		nameCont: {
			width: responsiveWidth(62),
			marginRight: responsiveWidth(5),
		},
	});
