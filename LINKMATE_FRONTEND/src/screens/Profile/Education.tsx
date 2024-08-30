import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
	ScrollView,
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
import { addEducation, deleteEducation, updateEducation } from '../../api/apis';
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
export default function Education({ navigation }) {
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
	const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active
	const [editingEducationId, setEditingEducationId] = useState(''); // Track the education being edited
	const [newEducation, setNewEducation] = useState({
		institution: '',
		startDate: new Date(),
		endDate: new Date(),
		degree: '',
		description: '',
		field: '',
	});

	const handleStartDate = (event, selectedDate) => {
		const currentDate = selectedDate || newEducation.startDate;
		setStartDateDpShow(!startDateDpShow);
		setNewEducation((prevState) => ({
			...prevState,
			startDate: currentDate,
		}));
	};

	const handleEndDate = (event, selectedDate) => {
		const currentDate = selectedDate || newEducation.endDate;
		setEndDateDpShow(!endDateDpShow);
		setNewEducation((prevState) => ({
			...prevState,
			endDate: currentDate,
		}));
	};

	const handleDltEdu = async (id: string) => {
		try {
			setLoader(true);
			const response = await deleteEducation(id);
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

	const resetEducationForm = () => {
		setNewEducation({
			institution: '',
			degree: '',
			field: '',
			startDate: new Date(),
			endDate: new Date(),
			description: '',
		});
		setIsEditing(false);
		setEditingEducationId(null);
	};
	const handleAddEducation = async () => {
		const payload: EducationPayload = newEducation;
		setLoader(true);
		if (
			payload.institution.length < 1 ||
			payload.degree.length < 1 ||
			payload.field.length < 1 ||
			payload.description.length < 1
		) {
			setLoader(false);
			Toast.show('All fields are required', Toast.SHORT);
			return;
		}
		toggleModal();
		try {
			const response = await addEducation(payload);
			console.log(response);
			if (response) {
				dispatch(setUserDetails(response));
				setLoader(false);
				Toast.show('Education added successfully', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
			setLoader(false);
		} finally {
			setNewEducation({
				institution: '',
				startDate: new Date(),
				endDate: new Date(),
				degree: '',
				description: '',
				field: '',
			});
		}
	};

	const handleEditEducation = (education) => {
		setIsEditing(true);
		setEditingEducationId(education.educationId);
		setNewEducation({
			institution: education.institution,
			startDate: moment(education.startDate).toDate(),
			endDate: moment(education.endDate).toDate(),
			degree: education.degree,
			description: education.description,
			field: education.field,
		});
		toggleModal();
	};

	const handleUpdateEducation = async () => {
		const payload: EducationPayload = {
			...newEducation,
			educationId: editingEducationId,
		};
		setLoader(true);
		if (
			payload.institution.length < 1 ||
			payload.degree.length < 1 ||
			payload.field.length < 1 ||
			payload.description.length < 1
		) {
			setLoader(false);
			Toast.show('All fields are required', Toast.SHORT);
			return;
		}
		toggleModal();
		try {
			const response = await updateEducation(editingEducationId, payload);
			if (response) {
				dispatch(setUserDetails(response));
				setLoader(false);
				Toast.show('Education updated successfully', Toast.SHORT);
			}
		} catch (err) {
			console.error(err);
			setLoader(false);
		} finally {
			setNewEducation({
				institution: '',
				startDate: new Date(),
				endDate: new Date(),
				degree: '',
				description: '',
				field: '',
			});
			setIsEditing(false);
			setEditingEducationId('');
		}
	};

	return (
		<View style={styles.mainCont}>
			<View style={styles.cont}>
				<Text style={globalStyleSheet.smallHead}>Education</Text>
				<TouchableOpacity onPress={toggleModal}>
					<View style={styles.plus}>
						<AntDesign name="plus" size={16} color={colors.WHITE} />
					</View>
				</TouchableOpacity>
			</View>
			{loader && <Loader />}
			{userData?.educations.map((item) => (
				<View style={styles.experienceCard} key={item.educationId}>
					<View style={styles.position}>
						<Text style={globalStyleSheet.smallerHead}>{item.institution}</Text>
						<View style={styles.icon}>
							<TouchableOpacity
								activeOpacity={0.4}
								onPress={() => handleEditEducation(item)}
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
								onPress={() => handleDltEdu(item.educationId)}
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
						{item.degree},{item.field}
					</Text>
					<Text style={globalStyleSheet.smallestHead}>
						{moment(item.startDate, 'YYYY-MM-DD').format('MMM YYYY')} -{' '}
						{moment(item.endDate, 'YYYY-MM-DD').format('MMM YYYY')}
					</Text>
					<Text style={globalStyleSheet.description}>{item.description}</Text>
				</View>
			))}
			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={() => {
					toggleModal();
					resetEducationForm();
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						toggleModal();
						resetEducationForm();
					}}
				>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback>
							<View style={styles.modalContainer}>
								<ScrollView style={styles.scroll}>
									<Text style={styles.modalTitle}>Add Education</Text>
									<AppTextField
										label="Institution"
										value={newEducation.institution}
										onChangeText={(text) =>
											setNewEducation({ ...newEducation, institution: text })
										}
									/>
									<AppTextField
										label="Degree"
										value={newEducation.degree}
										onChangeText={(text) =>
											setNewEducation({ ...newEducation, degree: text })
										}
									/>
									<AppTextField
										label="Field of study"
										value={newEducation.field}
										onChangeText={(text) =>
											setNewEducation({ ...newEducation, field: text })
										}
									/>
									<AppPickerField
										label="Start Date (DD/MM/YYYY)"
										value={moment(newEducation.startDate).format('DD/MM/YYYY')}
										onPress={() => setStartDateDpShow(true)}
										icon={'calendar'}
									/>
									<AppPickerField
										label="End Date or expected (DD/MM/YYYY)"
										value={moment(newEducation.endDate).format('DD/MM/YYYY')}
										onPress={() => setEndDateDpShow(true)}
										icon={'calendar'}
									/>
									<AppTextField
										label="Description"
										value={newEducation.description}
										onChangeText={(text) =>
											setNewEducation({ ...newEducation, description: text })
										}
									/>
									{startDateDpShow && (
										<DateTimePicker
											value={newEducation.startDate}
											mode={'date'}
											display="default"
											onChange={handleStartDate}
										/>
									)}
									{endDateDpShow && (
										<DateTimePicker
											value={newEducation.endDate}
											mode={'date'}
											display="default"
											onChange={handleEndDate}
										/>
									)}
									<AppButton
										title={isEditing ? 'Update Education' : 'Add Education'}
										onPress={
											isEditing ? handleUpdateEducation : handleAddEducation
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
			maxHeight: responsiveHeight(68),
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
