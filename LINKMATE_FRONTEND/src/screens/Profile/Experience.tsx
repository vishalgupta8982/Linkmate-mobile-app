import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Modal,
} from 'react-native';
import Loader from '../../components/Loader';
import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import moment from 'moment';
import { deleteExperience } from '../../api/apis';
import Toast from 'react-native-simple-toast';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { useState } from 'react';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import { AppButton } from '../../components/AppButton';
import AppTextField from '../../components/AppTextField';
export default function Experience({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newExperience, setNewExperience] = useState({
		company: '',
		startDate: '',
		endDate: '',
		position: '',
		description: '',
	});
	const handleDltExp = async (id: string) => {
		try {
			setLoader(true);
			const response = await deleteExperience(id);
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
	const handleAddExperience = () => {
		// Add logic to save the new education entry
		// Example:
		// dispatch(addEducation(newEducation));
		console.log(newExperience);
		setNewExperience({
			institution: '',
			startDate: '',
			endDate: '',
			degree: '',
			description: '',
		});
		toggleModal();
		Toast.show('Education added successfully', Toast.SHORT);
	};
	return (
		<View style={styles.mainCont}>
			{userData?.experiences?.length > 0 && (
				<View>
					<View style={styles.cont}>
						<Text style={globalStyleSheet.smallHead}>Add Experience</Text>
						<TouchableOpacity onPress={toggleModal}>
						<View style={styles.plus}>
							<AntDesign name="plus" size={16} color={colors.WHITE} />
						</View></TouchableOpacity>
					</View>
					{loader && <Loader />}
					{userData?.experiences.map((item) => (
						<View style={styles.experienceCard}>
							<View style={styles.position}>
								<Text style={globalStyleSheet.smallerHead}>
									{item.position}
								</Text>
								<View style={styles.icon}>
									<Feather
										name="edit-2"
										marginRight={10}
										size={16}
										padding={5}
										color={colors.PRIMARY}
									/>
									<TouchableWithoutFeedback
										onPress={() => handleDltExp(item.experienceId)}
									>
										<MaterialCommunityIcon
											name="delete-outline"
											marginRight={10}
											size={20}
											padding={5}
											color={colors.RED}
										/>
									</TouchableWithoutFeedback>
								</View>
							</View>
							<Text style={globalStyleSheet.smallestHead}>{item.company}</Text>
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
							<Text style={globalStyleSheet.description}>
								{item.description}
							</Text>
						</View>
					))}
				</View>
			)}
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
								<AppTextField
									label="Start Date (YYYY-MM-DD)"
									value={newExperience.startDate}
									onChangeText={(text) =>
										setNewExperience({ ...newExperience, startDate: text })
									}
								/>
								<AppTextField
									label="End Date (YYYY-MM-DD)"
									value={newExperience.endDate}
									onChangeText={(text) =>
										setNewExperience({ ...newExperience, endDate: text })
									}
								/>
								<AppTextField
									label="Description"
									value={newExperience.description}
									onChangeText={(text) =>
										setNewExperience({ ...newExperience, description: text })
									}
								/>
								<AppButton title="Save" onPress={handleAddExperience} />
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
			marginBottom: 20,
			color: colors.TEXT,
		},
	});
