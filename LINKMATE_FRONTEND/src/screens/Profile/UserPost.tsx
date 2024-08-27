import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from '../../redux/store';
import { getFeed, getUserPost, getUserPoST, userDetails } from '../../api/apis';
import { useFocusEffect } from '@react-navigation/native';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import { useCustomTheme } from '../../config/Theme';
import WebSocketService from '../../utils/WebSocketService';
import { selectToken } from '../../redux/slices/authSlice';
import { socketUrl } from '../../api/instance';
import PostCard from '../../components/PostCard';
import { setPosts, setUserPosts } from '../../redux/slices/PostSlice';
import StackHeader from '../../components/StackHeader';
export default function UserPost({ navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const token = selectToken(store.getState());
	const userPostData = useSelector((state: RootState) => state.posts.userPosts);
	const fetchFeed = async () => {
		if (loading || !hasMore) return;
		try {
			setLoading(true); 
			const response = await getUserPost(page);
			const newUserPostData = response.content;
			dispatch(setUserPosts([...userPostData, ...newUserPostData]));
			setPage(page + 1);
			setHasMore(newUserPostData.length > 0);
			
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFeed();  
	}, []);

	return (
		<View style={styles.mainCont}>
        <StackHeader title="My Posts" navigation={navigation} />
			<FlatList
				data={userPostData}
				keyExtractor={(item) => item.postId.toString()}
				renderItem={({ item }) => (
					<PostCard navigation={navigation} data={item} />
				)}
				onEndReached={fetchFeed}
				onEndReachedThreshold={0.5}
				ListFooterComponent={
					hasMore && <ActivityIndicator size={32} color={colors.PRIMARY} />
				}
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
	});
