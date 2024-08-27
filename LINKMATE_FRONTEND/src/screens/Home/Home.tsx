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
import { getFeed, userDetails } from '../../api/apis';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import { useCustomTheme } from '../../config/Theme';
import HomePageHeader from './HomePageHeader';
import WebSocketService from '../../utils/WebSocketService';
import { selectToken } from '../../redux/slices/authSlice';
import { socketUrl } from '../../api/instance';
import PostCard from '../../components/PostCard';
import { setFeedPosts, setPosts } from '../../redux/slices/PostSlice';

export default function Home({ navigation }) {
	const route = useRoute();
	const { fromCreatePost } = route.params || false;
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const token = selectToken(store.getState());
	const feedData = useSelector((state: RootState) => state.posts.feedPosts);
	useEffect(() => {
		WebSocketService.connect(socketUrl, token, dispatch);
		return () => {
			if (WebSocketService.socket) {
				WebSocketService.socket.close();
			}
		};
	}, [navigation]);
	const fetchUserDetails = async () => {
		try {
			const response = await userDetails();
			dispatch(setUserDetails(response));
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const fetchFeed = async () => {
		if (loading || !hasMore) return;
		try {
			const response = await getFeed(page);
			const newFeedData = response.content;
			dispatch(setFeedPosts([...feedData, ...newFeedData]));
			setPage(page + 1);
			setHasMore(newFeedData.length > 0);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFeed();
		fetchUserDetails();
	}, []);
 
	return (
		<View style={styles.mainCont}>
			<HomePageHeader navigation={navigation} />
			{loading &&(<Loader/>)}
			{!loading && (
				<FlatList
					data={feedData}
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
	});
