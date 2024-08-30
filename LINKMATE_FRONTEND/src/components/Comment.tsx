import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	TextInput,
	Image,
	TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomTheme } from '../config/Theme';
import { deleteComment, getCommentPost, postComment } from '../api/apis';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { fonts } from '../config/Fonts';
import { useRoute } from '@react-navigation/native';
import { height, width } from '../config/Dimension';
import { globalStyles } from '../StylesSheet';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import Loader from './Loader';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { post } from '../api/instance';
import {
	addCommentToPost,
	removeCommentFromPost,
} from '../redux/slices/PostSlice';

import CustomAlertDialog from './CustomAlertDialog';
import { CommentResponse } from '../types/Response/CommentResponse';
export default function Comment({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const route = useRoute();
	const dispatch = useDispatch();
	const { postId } = route.params || {};
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [content, setContent] = useState('');
	const [comments, setComments] = useState<CommentResponse[]>([]);
	const [loader, setLoader] = useState(false);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [dltCommentId, setDltCommentId] = useState('');
	const fetchComment = async () => {
		setLoader(true);
		try {
			const response = await getCommentPost(postId);
			console.log(response);
			if (response) {
				setComment(response);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoader(false);
		}
	};
	useEffect(() => {
		fetchComment();
	}, []);
	const addComment = async () => {
		setLoader(true);
		if (content.length < 1) {
			Toast.show('Write Something first..', Toast.SHORT);
			setLoader(false);
			return;
		}
		const payload = {
			postId: postId,
			content: content,
		};
		try {
			const response = await postComment(payload);
			if (response) {
				setContent('');
				setComment((prevComments) => [response, ...prevComments]);
				dispatch(addCommentToPost({ postId, commentId: response.comment.id }));
			}
		} catch (err) {
			console.error('Error in addComment:', err);
		} finally {
			setLoader(false);
		}
	};

	const handleDelete = async () => {
		setAlertDialogVisible(false);
		try {
			const previousComments = [...comment];
			setComment((prevComments) =>
				prevComments.filter((comment) => comment.comment.id !== dltCommentId)
			);
			const response = await deleteComment(postId, dltCommentId);
			if (response) {
				dispatch(removeCommentFromPost({ postId, commentId: dltCommentId }));
			}
		} catch (err) {
			Toast.show('Something went wrong', Toast.SHORT);
			setComment(previousComments);
			console.error(err);
		} finally {
			setDltCommentId('');
		}
	};

	return (
		<View style={styles.sheet}>
			{loader && <Loader />}
			<TouchableOpacity activeOpacity={0.4} onPress={() => navigation.goBack()}>
				<AntDesign
					marginLeft={15}
					padding={10}
					name="close"
					size={22}
					color={colors.TEXT}
				/>
			</TouchableOpacity>
			<FlatList
				data={comment}
				initialNumToRender={4}
				maxToRenderPerBatch={10}
				updateCellsBatchingPeriod={50}
				removeClippedSubviews={true}
				keyExtractor={(item) => item.comment.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							navigation.navigate(
								userData.username === item.commentUserDetail.username
									? 'Profile'
									: 'viewUserProfile',
								{ username: item.commentUserDetail.username }
							)
						}
						activeOpacity={0.4}
					>
						<View style={styles.commentBox}>
							<Image
								style={styles.img}
								source={{ uri: item.commentUserDetail.profilePicture }}
							/>
							<View style={styles.userDetail}>
								<View style={styles.nameIcon}>
									<View style={styles.nameCont}>
										<Text style={globalStyleSheet.smallestHead}>
											{item.commentUserDetail.firstName +
												' ' +
												item.commentUserDetail.lastName}
										</Text>
										<Text
											numberOfLines={1}
											ellipsizeMode="tail"
											style={globalStyleSheet.smallFontDescription}
										>
											{item.commentUserDetail.headline}
										</Text>
										<Text style={globalStyleSheet.smallFontDescription}>
											{moment(item.comment.createdAt + '+00:00')
												.utcOffset('+05:30')
												.fromNow()}
										</Text>
									</View>
									{(userData.userId === item.commentUserDetail.userId ||
										userData.posts.includes(item.commment.postId)) && (
										<TouchableOpacity
											onPress={() => {
												setDltCommentId(item.comment.id);
												setAlertDialogVisible(true);
											}}
											activeOpacity={0.4}
										>
											<MaterialCommunityIcon
												marginLeft="auto"
												name="dots-vertical"
												color={colors.TEXT}
												padding={3}
												size={18}
											/>
										</TouchableOpacity>
									)}
								</View>
								<Text style={globalStyleSheet.description}>
									{item.comment.content}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>
			<CustomAlertDialog
				isOpen={alertDialogVisible}
				onClose={() => setAlertDialogVisible(false)}
				title={'Delete comment'}
				message={'Are you sure you want to delete comment?'}
				ButtonText={'Delete'}
				onConfirm={handleDelete}
			/>
			<View style={styles.inputCont}>
				<TextInput
					style={styles.input}
					selectionColor={colors.PRIMARY}
					placeholder="Write a comment..."
					placeholderTextColor={colors.TEXT}
					onChangeText={setContent}
					value={content}
				/>
				<TouchableOpacity activeOpacity={0.4} onPress={addComment}>
					<Feather name="send" padding={3} size={22} color={colors.PRIMARY} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		sheet: {
			backgroundColor: colors.BACKGROUND,
			flex: 1,
		},
		commentBox: {
			paddingHorizontal: 15,
			borderBottomWidth: 0.2,
			borderColor: colors.APP_PRIMARY,
			paddingBottom: 10,
			flexDirection: 'row',
			alignItems: 'flex-start',
			paddingTop: 10,
		},
		userDetail: {
			width: responsiveWidth(75),
		},
		img: {
			height: 50,
			flexDirection: 'row',
			alignItems: 'flex-start',
			width: 50,
			borderRadius: 25,
			marginRight: 10,
		},
		nameCont: {
			width: responsiveWidth(50),
		},
		nameIcon: {
			flexDirection: 'row',
			alignItems: 'flex-start',
			justifyContent: 'space-between',
		},
		inputCont: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 'auto',
			paddingHorizontal: 20,
			backgroundColor: colors.LIGHT_MAIN_BACKGROUND,
			justifyContent: 'space-between',
		},
		input: {
			color: colors.TEXT,
			fontFamily: fonts.Inter_Medium,
			width: responsiveWidth(80),
		},
	});
