import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
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
import { addEducation, deleteEducation } from '../../api/apis';
import Toast from 'react-native-simple-toast';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import AppTextField from '../../components/AppTextField';
import { AppButton } from '../../components/AppButton';
import { EducationPayload } from '../../types/Payload/EducationPayload';

export default function Education({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newEducation, setNewEducation] = useState({
		institution: '',
		startDate: '',
		endDate: '',
		degree: '',
		description: '',
	});

	const handleDltEdu = async (id: string) => {
		try {
			setLoader(true);
			const response = await deleteEducation(id);
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

	const handleAddEducation = async () => {
		const payload: EducationPayload = newEducation;
		setLoader(true);
		toggleModal();
		try {
			const response = await addEducation(payload);
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
				startDate: '',
				endDate: '',
				degree: '',
				description: '',
			});
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
							<Feather
								marginRight={10}
								name="edit-2"
								size={16}
								padding={5}
								color={colors.PRIMARY}
							/>
							<TouchableWithoutFeedback
								onPress={() => handleDltEdu(item.educationId)}
							>
								<MaterialCommunityIcon
									name="delete-outline"
									size={20}
									marginRight={10}
									padding={5}
									color={colors.RED}
								/>
							</TouchableWithoutFeedback>
						</View>
					</View>
					<Text style={globalStyleSheet.smallestHead}>{item.degree}</Text>
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
					<Text style={globalStyleSheet.description}>{item.description}</Text>
				</View>
			))}
			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={toggleModal}
			>
				<TouchableWithoutFeedback onPress={toggleModal}>
					<View style={styles.modalOverlay}>
						<TouchableWithoutFeedback>
							<View style={styles.modalContainer}>
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
									label="Start Date (YYYY-MM-DD)"
									value={newEducation.startDate}
									onChangeText={(text) =>
										setNewEducation({ ...newEducation, startDate: text })
									}
								/>
								<AppTextField
									label="End Date (YYYY-MM-DD)"
									value={newEducation.endDate}
									onChangeText={(text) =>
										setNewEducation({ ...newEducation, endDate: text })
									}
								/>
								<AppTextField
									label="Description"
									value={newEducation.description}
									onChangeText={(text) =>
										setNewEducation({ ...newEducation, description: text })
									}
								/>
								<AppButton title="Save" onPress={handleAddEducation} />
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
			padding: 20,
			elevation: 5,
			width: '100%',
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
