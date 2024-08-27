import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import React from 'react';
import Toast from 'react-native-simple-toast';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from './Loader';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import StackHeader from './StackHeader';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useRoute } from '@react-navigation/native';
import { useCustomTheme } from '../config/Theme';
import { globalStyles } from '../StylesSheet';
import { getPostLikedUserDetail } from '../api/apis';
export default function Likes({ navigation }) {
	const theme = useCustomTheme();
	const route = useRoute();
	const { postId } = route.params || {};
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(true);
	const [likedUser, setLikedUser] = useState([]);
	const fetchLikedUser = async () => {
		try {
			const response = await getPostLikedUserDetail(postId);
			setLikedUser(response);
		} catch (err) {
			console.error(err);
		} finally {
			setLoader(false);
		}
	};
	useEffect(() => {
		fetchLikedUser();
	}, []);

	const renderItem = ({ item }) => (
		<TouchableOpacity
			activeOpacity={0.4}
			onPress={() =>
				navigation.navigate('viewUserProfile', {
					username: item.username,
				})
			}
		>
			<View style={styles.list}>
				<Image source={{ uri: item.profilePicture }} style={styles.img} />
				<View style={styles.nameCont}>
					<Text style={globalStyleSheet.smallerHead}>
						{item.firstName} {item.lastName}
					</Text>
					<Text
						numberOfLines={1}
						ellipsizeMode="tail"
						style={globalStyleSheet.description}
					>
						{item.headline}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
	return (
		<View style={styles.mainCont}>
			{loader && <Loader />}
			<StackHeader navigation={navigation} title="Likes" />
			<FlatList
				data={likedUser}
				renderItem={renderItem}
				keyExtractor={(item) => item.username}
			/>
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
			backgroundColor: colors.BACKGROUND,
			paddingHorizontal: 15,
			paddingVertical: 5,
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 5,
		},
		img: {
			width: 60,
			height: 60,
			borderRadius: 30,
			marginRight: 10,
		},
		nameCont: {
			width: responsiveWidth(63),
			marginRight: 10,
		},
	});
