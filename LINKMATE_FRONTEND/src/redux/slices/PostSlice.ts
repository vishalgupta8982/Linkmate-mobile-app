import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Post } from '../../types/Response/PostResponse';

type PostsState = {
	userPosts: Post[];
	feedPosts: Post[];
};

const initialState: PostsState = {
	userPosts: [],
	feedPosts: [],
};
const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		setUserPosts: (state, action: PayloadAction<Post[]>) => {
			const newPosts = action.payload;
			const existingPostIds = new Set(
				state.userPosts.map((post) => post.postId)
			);
			state.userPosts = [
				...state.userPosts,
				...newPosts.filter((post) => !existingPostIds.has(post.postId)),
			];
		},
		setFeedPosts: (state, action: PayloadAction<Post[]>) => {
			const newPosts = action.payload;
			const existingPostIds = new Set(
				state.feedPosts.map((post) => post.postId)
			);
			state.feedPosts = [
				...state.feedPosts,
				...newPosts.filter((post) => !existingPostIds.has(post.postId)),
			];
		},
		toggleLike: (
			state,
			action: PayloadAction<{
				postId: string;
				userId: string;
			}>
		) => {
			const { postId, userId } = action.payload;

			state.feedPosts.forEach((post) => {
				if (post.postId === postId) {
					const userIndex = post.likedBy.indexOf(userId);
					if (userIndex === -1) {
						post.likedBy.push(userId);
					} else {
						post.likedBy.splice(userIndex, 1);
					}
				}
			});

			state.userPosts.forEach((post) => {
				if (post.postId === postId) {
					const userIndex = post.likedBy.indexOf(userId);
					if (userIndex === -1) {
						post.likedBy.push(userId);
					} else {
						post.likedBy.splice(userIndex, 1);
					}
				}
			});
		},
		addCommentToPost: (
			state,
			action: PayloadAction<{
				postId: string;
				commentId: string;
			}>
		) => {
			const { postId, commentId } = action.payload;

			state.feedPosts.forEach((post) => {
				if (post.postId === postId) {
					post.comments.push(commentId);
				}
			});

			state.userPosts.forEach((post) => {
				if (post.postId === postId) {
					post.comments.push(commentId);
				}
			});
		},
		removeCommentFromPost: (
			state,
			action: PayloadAction<{
				postId: string;
				commentId: string;
			}>
		) => {
			const { postId, commentId } = action.payload;
			state.feedPosts.forEach((post) => {
				if (post.postId === postId) {
					post.comments = post.comments.filter((id) => id !== commentId);
				}
			});
			state.userPosts.forEach((post) => {
				if (post.postId === postId) {
					post.comments = post.comments.filter((id) => id !== commentId);
				}
			});
		},
		removePost: (state, action: PayloadAction<{ postId: string }>) => {
			const { postId } = action.payload;
			state.userPosts = state.userPosts.filter(
				(post) => post.postId !== postId
			);
			state.feedPosts = state.feedPosts.filter(
				(post) => post.postId !== postId
			);
		},
	},
});

export const {
	setUserPosts,
	setFeedPosts,
	toggleLike,
	addCommentToPost,
	removeCommentFromPost,
	removePost,
} = postsSlice.actions;
export default postsSlice.reducer;
