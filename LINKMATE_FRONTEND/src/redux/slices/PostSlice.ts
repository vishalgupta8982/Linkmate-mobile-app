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
			 state.userPosts=action.payload
		},
		setFeedPosts: (state, action: PayloadAction<Post[]>) => {
			state.feedPosts = action.payload;
		},
		setCreatePost: (state, action: PayloadAction<Post>) => {
			const newPost = action.payload;
			const existingPostIds = new Set(
				state.feedPosts.map((post) => post.post.postId)
			);
			if (!existingPostIds.has(newPost.post.postId)) {
				state.feedPosts = [newPost, ...state.feedPosts];
			}
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
				if (post.post.postId === postId) {
					const userIndex = post.post.likedBy.indexOf(userId);
					if (userIndex === -1) {
						post.post.likedBy.push(userId);
					} else {
						post.post.likedBy.splice(userIndex, 1);
					}
				}
			});

			state.userPosts.forEach((post) => {
				if (post.post.postId === postId) {
					const userIndex = post.post.likedBy.indexOf(userId);
					if (userIndex === -1) {
						post.post.likedBy.push(userId);
					} else {
						post.post.likedBy.splice(userIndex, 1);
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
				if (post.post.postId === postId) {
					post.post.comments.push(commentId);
				}
			});

			state.userPosts.forEach((post) => {
				if (post.post.postId === postId) {
					post.post.comments.push(commentId);
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
				if (post.post.postId === postId) {
					post.post.comments = post.post.comments.filter(
						(id) => id !== commentId
					);
				}
			});
			state.userPosts.forEach((post) => {
				if (post.post.postId === postId) {
					post.post.comments = post.post.comments.filter(
						(id) => id !== commentId
					);
				}
			});
		},
		removePost: (state, action: PayloadAction<{ postId: string }>) => {
			const { postId } = action.payload;
			state.userPosts = state.userPosts.filter(
				(post) => post.post.postId !== postId
			);
			state.feedPosts = state.feedPosts.filter(
				(post) => post.post.postId !== postId
			);
		},
		clearFeedPosts: (state) => {
			state.feedPosts = [];
		},
		clearUserPosts: (state) => {
			state.userPosts = [];
		},
	},
});

export const {
	setUserPosts,
	setFeedPosts,
	setCreatePost,
	toggleLike,
	addCommentToPost,
	removeCommentFromPost,
	removePost,
	clearFeedPosts,
	clearUserPosts,
} = postsSlice.actions;
export default postsSlice.reducer;
