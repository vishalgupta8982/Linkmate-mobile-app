import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Education, Experience, Project, User } from '../../types/compoundTypes';

interface UserDetailsState {
	user: User | null;
}

const initialState: UserDetailsState = {
	user: null,
};

const userDetailsSlice = createSlice({
	name: 'userDetails',
	initialState,
	reducers: {
		setUserDetails(state, action: PayloadAction<User>) {
			state.user = action.payload;
		},
		updateReduxUserDetails(state, action: PayloadAction<Partial<User>>) {
			if (state.user) {
				state.user = {
					...state.user,
					...action.payload,
				};
			}
		},
		removeConnections(state, action: PayloadAction<{ userId: string }>) {
			const { userId } = action.payload;
			if (state.user && state.user.connections) {
				state.user.connections = state.user.connections.filter(
					(connection) => connection !== userId
				);
			}
		},
		addConnection(state, action: PayloadAction<{ userId: string }>) {
			const { userId } = action.payload;
			if (state.user && state.user.connections) {
				state.user.connections.push(userId);
				state.user.connectionsRequest = state.user.connectionsRequest.filter(
					(request) => request !== userId
				);
			}
		},
		storeSkill(state, action: PayloadAction<string>) {
			if (state.user) {
				state.user.skills = state.user.skills || [];
				const skillExists = state.user.skills.includes(action.payload);
				if (!skillExists) {
					state.user.skills.push(action.payload);
				}
			}
		},
		removeSkill(state, action: PayloadAction<string>) {
			if (state.user) {
				state.user.skills = state.user.skills.filter(
					(skill) => skill !== action.payload
				);
			}
		},
		addOrUpdateProject(state, action: PayloadAction<Project>) {
			if (state.user) {
				const existingProjectIndex = state.user.projects.findIndex(
					(project) => project.projectId === action.payload.projectId
				);
				if (existingProjectIndex !== -1) {
					state.user.projects[existingProjectIndex] = action.payload;
				} else {
					state.user.projects.unshift(action.payload);
				}
			}
		},
		removeProject(state, action: PayloadAction<string>) {
			if (state.user) {
				state.user.projects = state.user.projects.filter(
					(project) => project.projectId !== action.payload
				);
			}
		},
		addOrUpdateEducation(state, action: PayloadAction<Education>) {
			if (state.user) {
				const existingEducationIndex = state.user.educations.findIndex(
					(edu) => edu.educationId === action.payload.educationId
				);
				if (existingEducationIndex !== -1) {
					state.user.educations[existingEducationIndex] = action.payload;
				} else {
					state.user.educations.unshift(action.payload);
				}
			}
		},
		removeEducation(state, action: PayloadAction<string>) {
			if (state.user) {
				state.user.educations = state.user.educations.filter(
					(edu) => edu.educationId !== action.payload
				);
			}
		},
		addOrUpdateExperience(state, action: PayloadAction<Experience>) {
			if (state.user) {
				const existingExperienceIndex = state.user.experiences.findIndex(
					(exp) => exp.experienceId === action.payload.experienceId
				);
				if (existingExperienceIndex !== -1) {
					state.user.experiences[existingExperienceIndex] = action.payload;
				} else {
					state.user.experiences.unshift(action.payload);
				}
			}
		},
		removeExperience(state, action: PayloadAction<string>) {
			if (state.user) {
				state.user.experiences = state.user.experiences.filter(
					(exp) => exp.experienceId !== action.payload
				);
			}
		},
		storePostId(state, action: PayloadAction<string>) {
			if (state.user) {
				state.user.posts = state.user.posts || [];
				const postExists = state.user.posts.includes(action.payload);
				if (!postExists) {
					state.user.posts.push(action.payload);
				}
			}
		},
		removePostId(state, action: PayloadAction<string>) {
			if (state.user) {
				state.user.posts = state.user.posts.filter(
					(post) => post !== action.payload
				);
			}
		},
		clearUserDetail(state) {
			state.user = null;
		},
	},
});

export const {
	setUserDetails,
	updateReduxUserDetails,
	clearUserDetail,
	removeConnections,
	addConnection,
	storeSkill,
	removeSkill,
	addOrUpdateProject,
	removeProject,
	addOrUpdateEducation,
	removeEducation,
	addOrUpdateExperience,
	removeExperience,
	storePostId,
	removePostId,
} = userDetailsSlice.actions;

export const selectUser = (state: RootState) => state.userDetails.user;

export default userDetailsSlice.reducer;
