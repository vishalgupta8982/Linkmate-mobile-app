import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Post } from '../../types/Response/PostResponse';

type PostsState = {
	posts: Post[];
};

const initialState: PostsState = {
	posts: [],
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {
		setPosts: (state, action: PayloadAction<Post[]>) => {
			state.posts = action.payload;
		},
		toggleLike: (
			state,
			action: PayloadAction<{ postId: string; userId: string }>
		) => {
			const { postId, userId } = action.payload;
			const post = state.posts.find((post) => post.postId === postId);
			if (post) {
				const userIndex = post.likedBy.indexOf(userId);
				if (userIndex === -1) {
					post.likedBy.push(userId);
				} else {
					post.likedBy.splice(userIndex, 1);
				}
			}
		},
		addCommentToPost: (
			state,
			action: PayloadAction<{ postId: string; commentId: string }>
		) => {
			const { postId, commentId } = action.payload;
			const post = state.posts.find((post) => post.postId === postId);
			if (post) {
				post.comments.push(commentId);
			}
		},
		removeCommentFromPost: (
			state,
			action: PayloadAction<{ postId: string; commentId: string }>
		) => {
			const { postId, commentId } = action.payload;
			const post = state.posts.find((post) => post.postId === postId);
			if (post && post.comments.includes(commentId)) {
				post.comments = post.comments.filter((id) => id !== commentId);
			}
		},
	},
});

export const { setPosts, toggleLike, addCommentToPost, removeCommentFromPost } =
	postsSlice.actions;
export default postsSlice.reducer;
