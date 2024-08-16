import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
	ScrollView,
	Linking,
} from 'react-native';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import moment from 'moment';
import Loader from '../../components/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	addEducation,
	addProject,
	deleteEducation,
	deleteProject,
	updateEducation,
	updateProject,
} from '../../api/apis';
import Toast from 'react-native-simple-toast';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import {
	responsiveFontSize,
	responsiveHeight,
} from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import AppTextField from '../../components/AppTextField';
import { AppButton } from '../../components/AppButton';
import { EducationPayload } from '../../types/Payload/EducationPayload';
import DateTimePicker from '@react-native-community/datetimepicker';
import AppPickerField from '../../components/AppPickerField';
import { ProjectPayload } from '../../types/Payload/ProjectPayload';
export default function Projects({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [startDateDpShow, setStartDateDpShow] = useState(false);
	const [endDateDpShow, setEndDateDpShow] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editingProjectId, setEditingProjectId] = useState('');
	const [newProject, setNewProject] = useState({
		name: '',
		startDate: new Date(),
		endDate: new Date(),
		link: '',
		description: '',
		skills: '',
	});

	const handleStartDate = (event, selectedDate) => {
		const currentDate = selectedDate || newProject.startDate;
		setStartDateDpShow(!startDateDpShow);
		setNewProject((prevState) => ({
			...prevState,
			startDate: currentDate,
		}));
	};

	const handleEndDate = (event, selectedDate) => {
		const currentDate = selectedDate || newProject.endDate;
		setEndDateDpShow(!endDateDpShow);
		setNewProject((prevState) => ({
			...prevState,
			endDate: currentDate,
		}));
	};

	const handleDltProject = async (id: string) => {
		try {
			setLoader(true);
			const response = await deleteProject(id);
			console.log(response);
			if (response) {
				dispatch(setUserDetails(response));
				Toast.show('Deleted successfully', Toast.SHORT);
				setLoader(false);
			}
		} catch (err) {
			setLoader(false);
			console.error(err);
		}
	};

	const toggleModal = () => {
		setIsModalVisible(!isModalVisible);
	};

	const resetProjectForm = () => {
		setNewProject({
			name: '',
			startDate: new Date(),
			endDate: new Date(),
			link: '',
			description: '',
			skills: '',
		});
		setIsEditing(false);
		setEditingProjectId(null);
	};
	const handleAddProject = async () => {
		const payload: ProjectPayload = newProject;
		console.log(payload);
		setLoader(true);
		if (
			payload.name.length < 1 ||
			payload.skills.length < 1 ||
			payload.description.length < 1
		) {
			setLoader(false);
			Toast.show('All fields are required', Toast.SHORT);
			return;
		}
		toggleModal();
		try {
			const response = await addProject(payload);
			console.log(response);
			if (response) {
				dispatch(setUserDetails(response));
				setLoader(false);
				Toast.show('Project added successfully', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
			setLoader(false);
		} finally {
			setNewProject({
				name: '',
				startDate: new Date(),
				endDate: new Date(),
				link: '',
				description: '',
				skills: '',
			});
		}
	};

	const handleEditProject = (project) => {
		setIsEditing(true);
		setEditingProjectId(project.projectId);
		setNewProject({
			name: project.name,
			startDate: moment(project.startDate).toDate(),
			endDate: moment(project.endDate).toDate(),
			link: project.link,
			description: project.description,
			skills: project.skills,
		});
		toggleModal();
	};

	const handleUpdateProject = async () => {
		const payload: ProjectPayload = {
			...newProject,
			projectId: editingProjectId,
		};
		console.log(payload);
		setLoader(true);
		if (
			payload.name.length < 1 ||
			payload.skills.length < 1 ||
			payload.description.length < 1
		) {
			setLoader(false);
			Toast.show('All fields are required', Toast.SHORT);
			return;
		}
		toggleModal();
		try {
			const response = await updateProject(editingProjectId, payload);
			if (response) {
				dispatch(setUserDetails(response));
				setLoader(false);
				Toast.show('Project updated successfully', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
			setLoader(false);
		} finally {
			setNewProject({
				name: '',
				startDate: new Date(),
				endDate: new Date(),
				link: '',
				description: '',
				skills: '',
			});
			setIsEditing(false);
			setEditingProjectId('');
		}
	};

	return (
		<View style={styles.mainCont}>
			<View style={styles.cont}>
				<Text style={globalStyleSheet.smallHead}> Add Project </Text>
				<TouchableOpacity onPress={toggleModal}>
					<View style={styles.plus}>
						<AntDesign name="plus" size={16} color={colors.WHITE} />
					</View>
				</TouchableOpacity>
			</View>
			{loader && <Loader />}
			{userData?.projects.map((item) => (
				<View style={styles.experienceCard} key={item.projectId}>
					<View style={styles.position}>
					<View style={styles.linkName} >
						<Text style={globalStyleSheet.smallerHead}>{item.name} </Text>
						<TouchableOpacity
							activeOpacity={0.4}
							onPress={() =>
								Linking.openURL('ffv').catch((err) =>
									Toast.show("Couldn't load page", Toast.SHORT)
								)
							}
						>
							<Feather
								name={'link-2'}
								color={colors.PRIMARY}
								padding={5}
								size={16}
							/>
						</TouchableOpacity>
						</View>
						<View style={styles.icon}>
							<TouchableOpacity
								activeOpacity={0.4}
								onPress={() => handleEditProject(item)}
							>
								<Feather
									marginRight={10}
									name="edit-2"
									size={16}
									padding={5}
									color={colors.PRIMARY}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.4}
								onPress={() => handleDltProject(item.projectId)}
							>
								<MaterialCommunityIcon
									name="delete-outline"
									size={20}
									marginRight={10}
									padding={5}
									color={colors.RED}
								/>
							</TouchableOpacity>
						</View>
					</View>
					<Text style={globalStyleSheet.smallestHead}>
						{moment(item.startDate, 'YYYY-MM-DD').format('MMM YYYY')} -{' '}
						{moment(item.endDate, 'YYYY-MM-DD').format('MMM YYYY')}
					</Text>
					<Text style={globalStyleSheet.smallestHead}>{item.skills}</Text>
					<Text style={globalStyleSheet.description}> {item.description} </Text>
				</View>
			))}
			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => {
					toggleModal();
					resetProjectForm();
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						toggleModal();
						resetProjectForm();
					}}
				>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback>
							<View style={styles.modalContainer}>
								<ScrollView style={styles.scroll}>
									<Text style={styles.modalTitle}> Add Project </Text>
									<AppTextField
										label="Project Name"
										value={newProject.name}
										onChangeText={(text) =>
											setNewProject({ ...newProject, name: text })
										}
									/>
									<AppTextField
										label="Project Link"
										value={newProject.link}
										onChangeText={(text) =>
											setNewProject({ ...newProject, link: text })
										}
									/>

									<AppPickerField
										label="Start Date (DD/MM/YYYY)"
										value={moment(newProject.startDate).format('DD/MM/YYYY')}
										onPress={() => setStartDateDpShow(true)}
										icon={'calendar'}
									/>
									<AppPickerField
										label="End Date or expected (DD/MM/YYYY)"
										value={moment(newProject.endDate).format('DD/MM/YYYY')}
										onPress={() => setEndDateDpShow(true)}
										icon={'calendar'}
									/>
									<AppTextField
										label="Skills(used in project)"
										value={newProject.skills}
										onChangeText={(text) =>
											setNewProject({ ...newProject, skills: text })
										}
									/>
									<AppTextField
										label="Description"
										value={newProject.description}
										onChangeText={(text) =>
											setNewProject({ ...newProject, description: text })
										}
									/>
									{startDateDpShow && (
										<DateTimePicker
											value={newProject.startDate}
											mode={'date'}
											display="default"
											onChange={handleStartDate}
										/>
									)}
									{endDateDpShow && (
										<DateTimePicker
											value={newProject.endDate}
											mode={'date'}
											display="default"
											onChange={handleEndDate}
										/>
									)}
									<AppButton
									marginBottom={30}
										title={isEditing ? 'Update Project' : 'Add Project'}
										onPress={isEditing ? handleUpdateProject : handleAddProject}
									/>
								</ScrollView>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		plus: {
			width: 30,
			height: 30,
			backgroundColor: colors.PRIMARY,
			borderRadius: 15,
			alignItems: 'center',
			justifyContent: 'center',
		},
		edit: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		cont: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			backgroundColor: colors.BACKGROUND,
			paddingHorizontal: 15,
			paddingVertical: 10,
			marginBottom: 7,
		},
		experienceCard: {
			backgroundColor: colors.BACKGROUND,
			paddingHorizontal: 15,
			paddingVertical: 10,
			marginBottom: 7,
		},
		linkName:{
			flexDirection:'row',
			alignItems:'center'
		},
		position: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		icon: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		modalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		modalContainer: {
			backgroundColor: colors.MAIN_BACKGROUND,
			borderRadius: 10,
			elevation: 5,
			width: '100%',
			maxHeight: responsiveHeight(60),
		},
		scroll: {
			padding: 20,
			paddingBottom: 100,
		},
		modalTitle: {
			fontSize: responsiveFontSize(2.5),
			fontFamily: fonts.Inter_Medium,
			color: colors.TEXT,
		},
		input: {
			borderWidth: 1,
			borderColor: colors.BORDER,
			borderRadius: 5,
			padding: 10,
			marginBottom: 15,
			color: colors.TEXT,
		},
	});
