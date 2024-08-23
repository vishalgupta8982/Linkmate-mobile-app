import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useCustomTheme } from '../config/Theme';
import { userDetails } from '../api/apis';
import { globalStyles } from '../StylesSheet';
import { fonts } from '../config/Fonts';
import moment from 'moment';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { height, width } from '../config/Dimension';
import {
	responsiveFontSize,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
export default function PostCard({ data, navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [readMore, setReadMore] = useState(false);
	const [imageHeight, setImageHeight] = useState(0);

	useEffect(() => {
		Image.getSize(data.fileUrl, (width, height) => {
			const aspectRatio = height / width;
			setImageHeight(width * aspectRatio);
		});
	}, []);
	return (
		<View style={styles.mainCont}>
			<TouchableOpacity
				activeOpacity={0.4}
				onPress={() =>
					navigation.navigate(userData.username==data.userDetail.username ? 'Profile' : 'viewUserProfile', {
						username: data.username,
					})
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
					{data.content.length < 80 || readMore ? (
						<Text style={globalStyleSheet.description}>{data.content}</Text>
					) : (
						<Text style={globalStyleSheet.description}>
							{data.content.slice(0, 80)}...{'  '}
							<Text onPress={() => setReadMore(true)}> Read more</Text>
						</Text>
					)}
				</View>
			)}
			<Image
				style={[styles.mainfile, { height: imageHeight / 2 }]}
				source={{ uri: data.fileUrl }}
			/>
			<View style={styles.iconCont}>
				{data.likedBy.includes(userData.userId) ? (
					<AntDesign name="like1" size={28} color={colors.RED} />
				) : (
					<AntDesign name="like2" size={28} color={colors.TEXT} />
				)}
				<Octicons name="comment" size={24} color={colors.TEXT} />
				<Octicons name="share" size={24} color={colors.TEXT} />
			</View>
			<View style={styles.likesCont}>
				<Text style={globalStyleSheet.smallestHead}>
					{data.likedBy.length} likes
				</Text>
				<Text style={globalStyleSheet.description}>
					{data.comments.length < 1
						? 'Write first comment..'
						: `View all ${data.comments.length} comments`}
				</Text>
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
	});
