import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from '../../redux/store';
import { countUnreadNotifications, getFeed, userDetails } from '../../api/apis';
import {  useRoute } from '@react-navigation/native';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import { useCustomTheme } from '../../config/Theme';
import HomePageHeader from './HomePageHeader';
import WebSocketService from '../../utils/WebSocketService';
import { selectToken } from '../../redux/slices/authSlice';
import {
	chatSocketUrl,
	connectionSocketUrl,
} from '../../api/instance';
import PostCard from '../../components/PostCard';
import {
	setFeedPosts,
} from '../../redux/slices/PostSlice';

export default function Home({ navigation }) {
	const route = useRoute();
	const userData = useSelector((state: RootState) => state.userDetails.user);
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
		WebSocketService.connectConnection(
			connectionSocketUrl,
			token,
			dispatch,
			userData?.userId
		);
		WebSocketService.connectChat(
			chatSocketUrl,
			token,
			dispatch,
			userData?.userId
		);
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
			console.error('User detail', err);
		} finally {
			setLoading(false);
		}
	};
	const fetchFeed = async (page: number, hasMore: boolean) => {
		if (loading || !hasMore) return;
		try {
			const response = await getFeed(page);
			const newFeedData = response.content;
			if (newFeedData) {
				if (page == 0) {
					dispatch(setFeedPosts([...newFeedData]));
				} else {
					dispatch(setFeedPosts([...feedData, ...newFeedData]));
				}
				setPage(page + 1);
				setHasMore(newFeedData.length > 0);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	 
 
	useEffect(() => {
		fetchUserDetails();
		fetchFeed(page, hasMore);
	}, []);

	return (
		<View style={styles.mainCont}>
			{loading && <Loader />}
			<HomePageHeader  navigation={navigation} />
			{!loading && userData && (
				<FlatList
					data={feedData}
					keyExtractor={(item) => item.post.postId}
					renderItem={({ item }) => (
						<PostCard navigation={navigation} data={item} />
					)}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={() => fetchFeed(0, true)}
						/>
					}
					onEndReached={() => fetchFeed(page, hasMore)}
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
