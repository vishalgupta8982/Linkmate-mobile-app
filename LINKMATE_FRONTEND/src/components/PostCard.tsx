import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import React, { useEffect, useState } from 'react';
import { useCustomTheme } from '../config/Theme';
import { deletePost, getCommentPost, likedPost } from '../api/apis';
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
import Pdf from 'react-native-pdf';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
} from 'react-native-reanimated';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import {
	removePost,
	setFeedPosts,
	setUserPosts,
	toggleLike,
} from '../redux/slices/PostSlice';
import CustomAlertDialog from './CustomAlertDialog';
import { removePostId, storePostId } from '../redux/slices/UserDetailsSlice';
import { PostDataResponse } from '../types/Response/GetPostResponse';
import { NavigationProp } from '@react-navigation/native';
import { Post } from '../types/Response/PostResponse';

export default function PostCard({
	data,
	navigation,
}: {
	data: Post;
	navigation: NavigationProp<any>;
}) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const userPosts = useSelector((state: RootState) => state.posts.userPosts);
	const feedPosts = useSelector((state: RootState) => state.posts.feedPosts);
	const dispatch = useDispatch();
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [readMore, setReadMore] = useState(false);
	const [imageHeight, setImageHeight] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [commentModalVisible, setCommentModalVisible] = useState(false);
	useEffect(() => {
		if (data.post.fileType == 'image') {
			Image.getSize(data.post.fileUrl, (width, height) => {
				const aspectRatio = height / width;
				setImageHeight(width * aspectRatio);
			});
		}
	}, [data.post.fileUrl, data.post.fileType]);

	const scale = useSharedValue(1);
	const translateY = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }, { translateY: translateY.value }],
		};
	});

	const handlePress = (postId: string, userId: string) => {
		scale.value = withSpring(1.2, { damping: 2, stiffness: 80 });
		translateY.value = withSpring(-15, { damping: 2, stiffness: 80 });

		setTimeout(() => {
			scale.value = withSpring(1);
			translateY.value = withSpring(0);
		}, 200);

		handleLike(postId, userId);
	};

	const handleLike = async (postId: String, userId: String) => {
		try {
			await likedPost(postId);
		} catch (err) {
			dispatch(toggleLike({ postId, userId }));
			Toast.show('Something went wrong', Toast.SHORT);
		}
	};
	const handleDelete = async () => {
		setAlertDialogVisible(false);
		const dltPostId = data.post.postId;
		const deletedUserPost = userPosts.find(
			(post) => post.post.postId === data.post.postId
		);
		const deletedFeedPost = feedPosts.find(
			(post) => post.post.postId === data.post.postId
		);
		dispatch(removePost({ postId: data.post.postId }));
		dispatch(removePostId(data.post.postId));
		try {
			const response = await deletePost(data.post.postId);
		} catch (err) {
			console.error(err);
			Toast.show('Something went wrong', Toast.SHORT);
			if (deletedUserPost) {
				dispatch(setUserPosts([...userPosts, deletedUserPost]));
			}
			if (deletedFeedPost) {
				dispatch(setFeedPosts([...feedPosts, deletedFeedPost]));
			}
			dispatch(storePostId(dltPostId));
		}
	};
	return (
		<View style={styles.mainCont}>
			<TouchableOpacity
				activeOpacity={0.4}
				onPress={() =>
					navigation.navigate(
						userData.username == data.postUserDetail.username
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
						source={{ uri: data.postUserDetail.profilePicture }}
					/>
					<View>
						<Text style={globalStyleSheet.smallerHead}>
							{data.postUserDetail.firstName +
								' ' +
								data.postUserDetail.lastName}
						</Text>
						<Text
							numberOfLines={1}
							ellipsizeMode="tail"
							style={styles.headline}
						>
							{data.postUserDetail.headline}
						</Text>
						<Text style={styles.time}>
							<AntDesign name="clockcircleo" size={10} color={colors.TEXT} />{' '}
							{moment(data.post.createdAt + '+00:00')
								.utcOffset('+05:30')
								.fromNow()}
						</Text>
					</View>
					{userData?.posts.includes(data.post.postId) && (
						<TouchableOpacity
							style={{ marginLeft: 'auto' }}
							activeOpacity={0.4}
							onPress={() => setAlertDialogVisible(true)}
						>
							<MaterialCommunityIcon
								name="dots-vertical"
								color={colors.TEXT}
								style={styles.icon}
								size={24}
							/>
						</TouchableOpacity>
					)}
				</View>
			</TouchableOpacity>
			{data.post.content && (
				<View style={styles.contentCont}>
					{data.post.content.length < 80 ||
					readMore ||
					data.post.fileType == 'content' ? (
						<Text style={globalStyleSheet.description}>
							{' '}
							{data.post.content}{' '}
						</Text>
					) : (
						<Text style={globalStyleSheet.description}>
							{data.post.content.slice(0, 80)}...{'  '}
							<Text onPress={() => setReadMore(true)}> Read more </Text>
						</Text>
					)}
				</View>
			)}
			{data.post.fileType == 'image' && (
				<Image
					style={{ height: imageHeight / 2 }}
					source={{ uri: data.post.fileUrl }}
				/>
			)}

			{data.post.fileType === 'document' && (
				<>
					<Pdf
						source={{
							uri: data.post.fileUrl,
						}}
						trustAllCerts={Platform.OS === 'ios'}
						style={styles.pdf}
						horizontal={true}
						onLoadComplete={(numberOfPages) => {
							setTotalPages(numberOfPages);
						}}
						onPageChanged={(page) => {
							setPageNumber(page);
						}}
					/>
					<View style={styles.pageNumber}>
						<Text style={globalStyleSheet.smallestHead}>
							Page {pageNumber} of {totalPages}
						</Text>
					</View>
				</>
			)}
			<View style={styles.iconCont}>
				<TouchableOpacity
					onPress={() => {
						dispatch(
							toggleLike({ postId: data.post.postId, userId: userData.userId })
						);
						handlePress(data.post.postId, userData.userId);
					}}
				>
					<Animated.View style={animatedStyle}>
						{data.post.likedBy.includes(userData.userId) ? (
							<AntDesign name="like1" size={28} color={colors.RED} />
						) : (
							<AntDesign name="like2" size={28} color={colors.TEXT} />
						)}
					</Animated.View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('comment', { postId: data.post.postId })
					}
				>
					<Octicons
						style={styles.icon}
						name="comment"
						size={24}
						color={colors.TEXT}
					/>
				</TouchableOpacity>
				<Octicons
					style={styles.icon}
					name="share"
					size={24}
					color={colors.TEXT}
				/>
			</View>
			<View style={styles.likesCont}>
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('likes', { postId: data.post.postId })
					}
				>
					<Text style={globalStyleSheet.smallestHead}>
						{data.post.likedBy.length} likes
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() =>
						navigation.navigate('comment', { postId: data.post.postId })
					}
				>
					<Text style={globalStyleSheet.description}>
						{data.post.comments.length < 1
							? 'Write first comment..'
							: `View all ${data.post.comments.length} comments`}
					</Text>
				</TouchableOpacity>
				<CustomAlertDialog
					isOpen={alertDialogVisible}
					onClose={() => setAlertDialogVisible(false)}
					title={'Delete post'}
					message={'Are you sure you want to delete post?'}
					ButtonText={'Delete'}
					onConfirm={handleDelete}
				/>
			</View>
		</View>
	);
}

const getStyles = (colors: any) =>
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
		pdf: {
			flex: 1,
			width: width,
			height: height / 2,
		},
		pageNumber: {
			backgroundColor: colors.BACKGORUND,
			paddingHorizontal: 15,
			padding: 5,
			borderBottomWidth: 0.3,
			borderColor: colors.APP_PRIMARY_LIGHT,
		},
		icon: {
			padding: 4,
		},
	});
