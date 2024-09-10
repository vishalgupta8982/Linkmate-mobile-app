import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, store } from '../../redux/store';
import { getUserPost } from '../../api/apis';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import { useCustomTheme } from '../../config/Theme';
import PostCard from '../../components/PostCard';
import {  setUserPosts } from '../../redux/slices/PostSlice';
import StackHeader from '../../components/StackHeader';
import { useRoute } from '@react-navigation/native';
export default function UserPost({ navigation }) {
	const theme = useCustomTheme();
	const route=useRoute()
	const {userId}=route.params
	const { colors } = theme;
	const styles = getStyles(colors);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const userPostData = useSelector((state: RootState) => state.posts.userPosts);
	const fetchUserPost = async (page:number,hasMore:boolean) => {
		if ( !hasMore) return;
		try {
			const response = await getUserPost(userId,page);
			const newUserPostData = response.content;
			if (newUserPostData)
				if (page == 0) {
					dispatch(setUserPosts([ ...newUserPostData]));
				} 
				else{
					dispatch(setUserPosts([...userPostData, ...newUserPostData]));
				}
			setPage(page + 1);
			setHasMore(newUserPostData.length > 0);
			
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true)
		fetchUserPost(page,hasMore);  
	}, []);

	return (
		<View style={styles.mainCont}>
			<StackHeader title="Posts" navigation={navigation} />
			{loading && <Loader />}
			{!loading && (
				<FlatList
					data={userPostData}
					keyExtractor={(item) => item.post.postId}
					renderItem={({ item }) => (
						<PostCard navigation={navigation} data={item} />
					)}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={() => fetchUserPost(0, true)}
						/>
					}
					onEndReached={() => fetchUserPost(page, hasMore)}
					onEndReachedThreshold={0.5}
					ListFooterComponent={
						hasMore && userPostData.length>1 && <ActivityIndicator size={32} color={colors.PRIMARY} />
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
