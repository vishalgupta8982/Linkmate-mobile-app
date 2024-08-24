import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	TextInput,
	ScrollView,
	FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomTheme } from '../config/Theme';
import { getCommentPost, likedPost } from '../api/apis';
import { globalStyles } from '../StylesSheet';
import { fonts } from '../config/Fonts';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { height, width } from '../config/Dimension';
import {
	responsiveFontSize,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleLike } from '../redux/slices/PostSlice';
import Comment from './Comment';
 

export default function PostCard({ data, navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const dispatch = useDispatch();
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [readMore, setReadMore] = useState(false);
	const [imageHeight, setImageHeight] = useState(0);
	const [commentModalVisible, setCommentModalVisible] = useState(false);
	useEffect(() => {
		if (data.fileType == 'image') {
			Image.getSize(data.fileUrl, (width, height) => {
				const aspectRatio = height / width;
				setImageHeight(width * aspectRatio);
			});
		}
	}, [data.fileUrl, data.fileType]);

	const scale = useSharedValue(1);
	const translateY = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }, { translateY: translateY.value }],
		};
	});

	const handlePress = (postId, userId) => {
		scale.value = withSpring(1.2, { damping: 2, stiffness: 80 });
		translateY.value = withSpring(-15, { damping: 2, stiffness: 80 });

		setTimeout(() => {
			scale.value = withSpring(1);
			translateY.value = withSpring(0);
		}, 200);

		handleLike(postId, userId);
	};

	const handleLike = async (postId: String, userId: String) => {
		dispatch(toggleLike({ postId, userId }));
		try {
			await likedPost(postId);
		} catch (err) {
			dispatch(toggleLike({ postId, userId }));
			Toast.show('Something went wrong', Toast.SHORT);
		}
	};
	return (
		<View style={styles.mainCont}>
			<TouchableOpacity
				activeOpacity={0.4}
				onPress={() =>
					navigation.navigate(
						userData.username == data.userDetail.username
							? 'Profile'
							: 'viewUserProfile',
						{
							username: data.username,
						}
					)
				}
			>
				<View style={styles.imgCont}>
					<Image
						style={styles.img}
						source={{ uri: data.userDetail.profilePicture }}
					/>
					<View>
						<Text style={globalStyleSheet.smallerHead}>
							{data.userDetail.firstName + ' ' + data.userDetail.lastName}
						</Text>
						<Text
							numberOfLines={1}
							ellipsizeMode="tail"
							style={styles.headline}
						>
							{data.userDetail.headline}
						</Text>
						<Text style={styles.time}>
							<AntDesign name="clockcircleo" size={10} color={colors.TEXT} />{' '}
							{moment(data.createdAt + '+00:00')
								.utcOffset('+05:30')
								.fromNow()}
						</Text>
					</View>
					<MaterialCommunityIcon
						marginLeft="auto"
						name="dots-vertical"
						color={colors.TEXT}
						padding={3}
						size={24}
					/>
				</View>
			</TouchableOpacity>
			{data.content && (
				<View style={styles.contentCont}>
					{data.content.length < 80 ||
					readMore ||
					data.fileType == 'content' ? (
						<Text style={globalStyleSheet.description}> {data.content} </Text>
					) : (
						<Text style={globalStyleSheet.description}>
							{data.content.slice(0, 80)}...{'  '}
							<Text onPress={() => setReadMore(true)}> Read more </Text>
						</Text>
					)}
				</View>
			)}
			{data.fileType == 'image' && (
				<Image
					style={[styles.mainfile, { height: imageHeight / 2 }]}
					source={{ uri: data.fileUrl }}
				/>
			)}
			<View style={styles.iconCont}>
				<TouchableOpacity
					onPress={() => handlePress(data.postId, userData.userId)}
				>
					<Animated.View style={animatedStyle}>
						{data.likedBy.includes(userData.userId) ? (
							<AntDesign name="like1" size={28} color={colors.RED} />
						) : (
							<AntDesign name="like2" size={28} color={colors.TEXT} />
						)}
					</Animated.View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate("comment",{postId:data.postId})}>
					<Octicons padding={3} name="comment" size={24} color={colors.TEXT} />
				</TouchableOpacity>
				<Octicons padding={3} name="share" size={24} color={colors.TEXT} />
			</View>
			<View style={styles.likesCont}>
				<Text style={globalStyleSheet.smallestHead}>
					{data.likedBy.length} likes
				</Text>
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('comment', { postId: data.postId })
					}
				>
				<Text  style={globalStyleSheet.description}>
					{data.comments.length < 1
						? 'Write first comment..'
						: `View all ${data.comments.length} comments`}
				</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			backgroundColor: colors.BACKGROUND,
			marginVertical: 5,
		},
		imgCont: {
			flexDirection: 'row',
			alignItems: 'flex-start',
			marginVertical: 5,
			paddingHorizontal: 10,
		},
		img: {
			height: 60,
			width: 60,
			borderRadius: 30,
			marginRight: 10,
		},
		time: {
			fontSize: 12,
			color: colors.APP_PRIMARY_LIGHT,
			fontFamily: fonts.Inter_Medium,
		},
		headline: {
			fontSize: 13,
			fontFamily: fonts.Inter_Medium,
			color: colors.APP_PRIMARY_LIGHT,
			width: responsiveWidth(50),
		},
		contentCont: {
			paddingHorizontal: 10,
			marginBottom: 5,
		},
		content: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			textAlign: 'justify',
		},
		iconCont: {
			padding: 10,
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 15,
			width: responsiveWidth(45),
			justifyContent: 'space-between',
		},
		likesCont: {
			paddingHorizontal: 15,
			padding: 5,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			borderBottomWidth: 0.2,
			borderTopWidth: 0.2,
			borderColor: colors.APP_PRIMARY,
		},
		overlay: {
			flex: 1,
			justifyContent: 'flex-end',
			backgroundColor: 'rgba(0,0,0,0.3)',
		},
		modalContent: {
			width: '100%',  
			borderRadius: 16,
		},
	});
