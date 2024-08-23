import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from '../../redux/store';
import { getFeed, userDetails } from '../../api/apis';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import { useCustomTheme } from '../../config/Theme';
import HomePageHeader from './HomePageHeader';
import WebSocketService from '../../utils/WebSocketService';
import { selectToken } from '../../redux/slices/authSlice';
import { socketUrl } from '../../api/instance';
import PostCard from '../../components/PostCard';

export default function Home({ navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [feedData, setFeedData] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const token = selectToken(store.getState());
	useEffect(() => {
		WebSocketService.connect(socketUrl, token, dispatch);
		return () => {
			if (WebSocketService.socket) {
				WebSocketService.socket.close();
			}
		};
	}, []);
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
			setFeedData([...feedData, ...newFeedData]);
			setPage(page + 1);
			setHasMore(newFeedData.length > 0);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchFeed();
		fetchUserDetails();
	}, []);

	return (
		<View style={styles.mainCont}>
			{loading && <Loader />}
			<HomePageHeader navigation={navigation} />
			<FlatList
				data={feedData}
				keyExtractor={(item) => item.postId}
				renderItem={({ item }) => (
					 <PostCard navigation={navigation} data={item} />
				)}
				onEndReached={fetchFeed}
				onEndReachedThreshold={0.5}
				ListFooterComponent={<Loader />}
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
