import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Modal,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import Loader from '../../components/Loader';
import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import moment from 'moment';
import {
	addExperience,
	deleteExperience,
	updateExperience,
} from '../../api/apis';
import Toast from 'react-native-simple-toast';
import {
	addOrUpdateExperience,
	removeExperience,
	setUserDetails,
} from '../../redux/slices/UserDetailsSlice';
import { useState } from 'react';
import {
	responsiveFontSize,
	responsiveHeight,
} from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import { AppButton } from '../../components/AppButton';
import AppTextField from '../../components/AppTextField';
import AppPickerField from '../../components/AppPickerField';
import { ExperiencePayload } from '../../types/Payload/ExperiencePayload';
export default function Experience({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [startDateDpShow, setStartDateDpShow] = useState(false);
	const [endDateDpShow, setEndDateDpShow] = useState(false);
	const [editingExperienceId, setEditingExperienceId] = useState('');
	const locationTypeOptions = [
		{ label: 'Remote', value: 'REMOTE' },
		{ label: 'Onsite', value: 'ONSITE' },
		{ label: 'Hybrid', value: 'HYBRID' },
	];

	const employmentTypeOptions = [
		{ label: 'Internship', value: 'INTERNSHIP' },
		{ label: 'Full-Time', value: 'FULL-TIME' },
		{ label: 'Part-Time', value: 'PART-TIME' },
	];
	const [isLocationTypeDropdownVisible, setLocationTypeDropdownVisible] =
		useState(false);
	const [isEmploymentTypeDropdownVisible, setEmploymentTypeDropdownVisible] =
		useState(false);
	const [newExperience, setNewExperience] = useState({
		company: '',
		startDate: new Date(),
		endDate: new Date(),
		position: '',
		description: '',
		locationType: 'REMOTE',
		employmentType: 'INTERNSHIP',
	});
	const handleStartDate = (event, selectedDate) => {
		const currentDate = selectedDate || newExperience.startDate;
		setStartDateDpShow(!startDateDpShow);
		setNewExperience((prevState) => ({
			...prevState,
			startDate: currentDate,
		}));
	};

	const handleEndDate = (event, selectedDate) => {
		const currentDate = selectedDate || newExperience.endDate;
		setEndDateDpShow(!endDateDpShow);
		setNewExperience((prevState) => ({
			...prevState,
			endDate: currentDate,
		}));
	};
	const handleDltExp = async (id: string) => {
		const prevData = userData;
		dispatch(removeExperience(id));
		try {
			const response = await deleteExperience(id);
		} catch (err) {
			Toast.show('Something went wrong', Toast.SHORT);
			dispatch(setUserDetails(prevData));
			console.error(err);
		}
	};

	const toggleModal = () => {
		setIsModalVisible(!isModalVisible);
	};

	const resetExperienceForm = () => {
		setNewExperience({
			company: '',
			startDate: new Date(),
			endDate: new Date(),
			position: '',
			description: '',
		});
		setIsEditing(false);
		setEditingExperienceId('');
	};
	const handleEditExperience = (experience) => {
		setIsEditing(true);
		setEditingExperienceId(experience.experienceId);
		setNewExperience({
			company: experience.company,
			startDate: moment(experience.startDate).toDate(),
			endDate: moment(experience.endDate).toDate(),
			position: experience.position,
			description: experience.description,
			locationType: experience.locationType,
			employmentType: experience.employmentType,
		});
		toggleModal();
	};

	const handleAddExperience = async () => {
		const payload = newExperience;
		setLoader(true);
		if (
			payload.company.length < 1 ||
			payload.position.length < 1 ||
			payload.description.length < 1
		) {
			setLoader(false);
			Toast.show('All fields are required', Toast.SHORT);
			return;
		}
		toggleModal();
		try {
			const response = await addExperience(payload);
			if (response) {
				dispatch(addOrUpdateExperience(response[0]));
				setLoader(false);
				Toast.show('Experience added successfully', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
			setLoader(false);
		} finally {
			resetExperienceForm();
		}
	};
	const handleUpdateExperience = async () => {
		const payload: ExperiencePayload = {
			...newExperience,
			experienceId: editingExperienceId,
		};
		if (
			payload.company.length < 1 ||
			payload.position.length < 1 ||
			payload.description.length < 1
		) {
			Toast.show('All fields are required', Toast.SHORT);
			return;
		}
		toggleModal();
		const prevData = userData;
		dispatch(addOrUpdateExperience(payload));
		try {
			const response = await updateExperience(editingExperienceId, payload);
		} catch (err) {
			console.error(err);
			Toast.show('Something went wrong', Toast.SHORT);
			dispatch(setUserDetails(prevData));
		} finally {
			setNewExperience({
				institution: '',
				startDate: new Date(),
				endDate: new Date(),
				degree: '',
				description: '',
				field: '',
			});
			setIsEditing(false);
			setEditingExperienceId('');
		}
	};

	return (
		<View style={styles.mainCont}>
			<View>
				<View style={styles.cont}>
					<Text style={globalStyleSheet.smallHead}>Add Experience</Text>
					<TouchableOpacity onPress={toggleModal}>
						<View style={styles.plus}>
							<AntDesign name="plus" size={16} color={colors.WHITE} />
						</View>
					</TouchableOpacity>
				</View>
				{loader && <Loader />}
				{userData?.experiences.map((item) => (
					<View style={styles.experienceCard}>
						<View style={styles.position}>
							<Text style={globalStyleSheet.smallerHead}>{item.position}</Text>
							<View style={styles.icon}>
								<TouchableOpacity
									activeOpacity={0.4}
									onPress={() => handleEditExperience(item)}
								>
									<Feather
										name="edit-2"
										marginRight={10}
										size={16}
										padding={5}
										color={colors.PRIMARY}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={0.4}
									onPress={() => handleDltExp(item.experienceId)}
								>
									<MaterialCommunityIcon
										name="delete-outline"
										marginRight={10}
										size={20}
										padding={5}
										color={colors.RED}
									/>
								</TouchableOpacity>
							</View>
						</View>
						<Text style={globalStyleSheet.smallestHead}>
							{item.company}
							{' • '}
							{
								employmentTypeOptions.find(
									(option) => option.value === item.employmentType
								)?.label
							}
						</Text>
						<Text style={globalStyleSheet.smallestHead}>
							{moment(item.startDate, 'YYYY-MM-DD').format('MMM YYYY')} -{' '}
							{moment(item.endDate, 'YYYY-MM-DD').format('MMM YYYY')}
							{' • '}
							{moment(item.endDate, 'YYYY-MM-DD').diff(
								moment(item.startDate, 'YYYY-MM-DD'),
								'months'
							)}{' '}
							months
						</Text>
						<Text style={styles.locationTypeText}>
							{
								locationTypeOptions.find(
									(option) => option.value === item.locationType
								)?.label
							}
						</Text>
						<Text style={globalStyleSheet.description}>{item.description}</Text>
					</View>
				))}
			</View>
			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => {
					toggleModal();
					resetExperienceForm();
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						toggleModal();
						resetExperienceForm();
					}}
				>
					<View style={styles.modalOverlay}>
						 
							<TouchableWithoutFeedback>
								<View style={styles.modalContainer}>
									<ScrollView style={styles.scroll}>
										<Text style={styles.modalTitle}>Add Experience</Text>
										<AppTextField
											label="Company"
											value={newExperience.company}
											onChangeText={(text) =>
												setNewExperience({ ...newExperience, company: text })
											}
										/>
										<AppTextField
											label="Position"
											value={newExperience.position}
											onChangeText={(text) =>
												setNewExperience({ ...newExperience, position: text })
											}
										/>

										<AppPickerField
											label="Location Type"
											value={
												locationTypeOptions.find(
													(option) =>
														option.value === newExperience.locationType
												)?.label || 'Select Location Type'
											}
											onPress={() => setLocationTypeDropdownVisible(true)}
											icon={'down'}
										/>
										<Modal
											visible={isLocationTypeDropdownVisible}
											transparent={true}
											animationType="slide"
											onRequestClose={() =>
												setLocationTypeDropdownVisible(false)
											}
										>
											<TouchableWithoutFeedback
												onPress={() => setLocationTypeDropdownVisible(false)}
											>
												<View style={styles.modalOverlay}>
													<View style={styles.dropdownContainer}>
														{locationTypeOptions.map((option) => (
															<TouchableOpacity
																key={option}
																style={styles.dropdownItem}
																onPress={() => {
																	setNewExperience((prevState) => ({
																		...prevState,
																		locationType: option.value,
																	}));
																	setLocationTypeDropdownVisible(false);
																}}
															>
																<Text style={styles.dropdownText}>
																	<MaterialCommunityIcon
																		name="arrow-top-right"
																		color={colors.TEXT}
																		size={16}
																	/>{' '}
																	{option.label}
																</Text>
															</TouchableOpacity>
														))}
													</View>
												</View>
											</TouchableWithoutFeedback>
										</Modal>
										<AppPickerField
											label="Employment Type"
											value={
												employmentTypeOptions.find(
													(option) =>
														option.value === newExperience.employmentType
												)?.label || 'Select Employment Type'
											}
											onPress={() => setEmploymentTypeDropdownVisible(true)}
											icon={'down'}
										/>
										<Modal
											visible={isEmploymentTypeDropdownVisible}
											transparent={true}
											animationType="slide"
											onRequestClose={() =>
												setEmploymentTypeDropdownVisible(false)
											}
										>
											<TouchableWithoutFeedback
												onPress={() => setEmploymentTypeDropdownVisible(false)}
											>
												<View style={styles.modalOverlay}>
													<View style={styles.dropdownContainer}>
														{employmentTypeOptions.map((option) => (
															<TouchableOpacity
																key={option}
																style={styles.dropdownItem}
																onPress={() => {
																	setNewExperience((prevState) => ({
																		...prevState,
																		employmentType: option.value,
																	}));
																	setEmploymentTypeDropdownVisible(false);
																}}
															>
																<Text style={styles.dropdownText}>
																	<MaterialCommunityIcon
																		name="arrow-top-right"
																		color={colors.TEXT}
																		size={16}
																	/>{' '}
																	{option.label}
																</Text>
															</TouchableOpacity>
														))}
													</View>
												</View>
											</TouchableWithoutFeedback>
										</Modal>
										<AppPickerField
											label="Start Date (DD/MM/YYYY)"
											value={moment(newExperience.startDate).format(
												'DD/MM/YYYY'
											)}
											onPress={() => setStartDateDpShow(true)}
											icon={'calendar'}
										/>
										<AppPickerField
											label="End Date (DD/MM/YYYY) - Leave blank if employed"
											value={moment(newExperience.endDate).format('DD/MM/YYYY')}
											onPress={() => setEndDateDpShow(true)}
											icon={'calendar'}
										/>
										<AppTextField
											label="Description"
											value={newExperience.description}
											onChangeText={(text) =>
												setNewExperience({
													...newExperience,
													description: text,
												})
											}
										/>
										{startDateDpShow && (
											<DateTimePicker
												value={newExperience.startDate}
												mode={'date'}
												display="default"
												onChange={handleStartDate}
											/>
										)}
										{endDateDpShow && (
											<DateTimePicker
												value={newExperience.endDate}
												mode={'date'}
												display="default"
												onChange={handleEndDate}
											/>
										)}
										<AppButton
											marginBottom={30}
											title={isEditing ? 'Update Experience' : 'Add Experience'}
											onPress={
												isEditing ? handleUpdateExperience : handleAddExperience
											}
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
			maxHeight: responsiveHeight(70),
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
			marginBottom: 20,
			color: colors.TEXT,
		},
		dropdownContainer: {
			backgroundColor: colors.MAIN_BACKGROUND,
			borderRadius: 10,
			width: '100%',
			padding: 10,
			alignItems: 'center',
			justifyContent: 'flex-start',
		},
		dropdownItem: {
			paddingVertical: 10,
			paddingHorizontal: 20,
			borderBottomWidth: 1,
			borderBottomColor: colors.BACKGROUND,
			width: '100%',
			alignItems: 'flex-start',
		},
		dropdownText: {
			fontSize: responsiveFontSize(2),
			color: colors.TEXT,
		},
		locationTypeText: {
			color: colors.PRIMARY,
			fontFamily: fonts.Inter_Regular,
			fontSize: 14,
		},
	});
