import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Modal,
	TextInput,
	Button,
} from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useCustomTheme } from '../../config/Theme';
import { globalStyles } from '../../StylesSheet';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { fonts } from '../../config/Fonts';
import Loader from '../../components/Loader';
import Toast from 'react-native-simple-toast';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { addSkill, deleteSkill } from '../../api/apis';
import CustomAlertDialog from '../../components/CustomAlertDialog';
import AppTextField from '../../components/AppTextField';
import { AppButton } from '../../components/AppButton';

export default function Overview({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const dispatch = useDispatch();
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [skill, setSkill] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [newSkill, setNewSkill] = useState('');

	const handleDltSkill = async () => {
		setAlertDialogVisible(false);
		try {
			setLoader(true);
			const response = await deleteSkill(skill);
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

	const handleAlertDialog = (skill: string) => {
		setAlertDialogVisible(true);
		setSkill(skill);
	};

	const closeAlertDialog = () => {
		setAlertDialogVisible(false);
		setSkill('');
	};

	const toggleModal = () => {
		setIsModalVisible(!isModalVisible);
	};

	const handleAddSkill = async() => {
		if (newSkill.trim() === '') {
			Toast.show('Please enter a skill', Toast.SHORT);
			return;
		}
		setLoader(true)
		toggleModal();
		try{
			const response=await addSkill([newSkill])
			if(response){
				dispatch(setUserDetails(response))
				setLoader(false);
setNewSkill('');
Toast.show('Skill added successfully', Toast.SHORT);
			}
		}catch(err){
			console.error(err)
			setLoader(false);
		}
	};

	return (
		<View style={styles.mainCont}>
			{userData?.skills?.length > 0 && (
				<View style={styles.Cont}>
					<Text style={globalStyleSheet.smallHead}>Skills</Text>
					<View style={styles.adjustSize}>
						{userData?.skills &&
							userData.skills.map((item, index) => (
								<TouchableWithoutFeedback
									onLongPress={() => handleAlertDialog(item)}
									key={index}
								>
									<View style={styles.skill}>
										<Text style={styles.chip}>{item}</Text>
									</View>
								</TouchableWithoutFeedback>
							))}
						<TouchableOpacity onPress={toggleModal}>
							<View style={styles.plus}>
								<AntDesign name="plus" size={16} color={colors.WHITE} />
							</View>
						</TouchableOpacity>
					</View>
				</View>
			)}
			{userData?.about?.length > 0 && (
				<View style={styles.Cont}>
					<View style={styles.edit}>
						<Text style={globalStyleSheet.smallHead}>About</Text>
						<TouchableOpacity
							onPress={() => navigation.navigate('EditProfile')}
						>
							<Feather
								name="edit-2"
								marginRight={10}
								size={20}
								color={colors.PRIMARY}
							/>
						</TouchableOpacity>
					</View>
					<Text style={globalStyleSheet.description}>{userData?.about}</Text>
				</View>
			)}
			{loader && <Loader />}
			<CustomAlertDialog
				isOpen={alertDialogVisible}
				onClose={closeAlertDialog}
				title={'Delete skill?'}
				message={'Are you sure you want to delete skill?'}
				ButtonText={'Delete'}
				onConfirm={handleDltSkill}
			/>

			<Modal
				visible={isModalVisible}
				transparent={true}
				animationType="slide"
				onRequestClose={toggleModal}
			>
			<TouchableWithoutFeedback onPress={toggleModal}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>Add Skill</Text>
						<AppTextField
							label="Skill"
							value={newSkill}
							onChangeText={setNewSkill}
						/>
						<AppButton onPress={handleAddSkill} title="Save" />
					</View>
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
		adjustSize: {
			alignSelf: 'flex-start',
			flexDirection: 'row',
			flexWrap: 'wrap',
			marginBottom: 15,
		},
		chip: {
			color: colors.WHITE,
			fontSize: responsiveFontSize(2),
			fontFamily: fonts.Inter_Medium,
		},
		skill: {
			padding: 6,
			paddingHorizontal: 20,
			backgroundColor: colors.PRIMARY,
			borderRadius: 30,
			marginRight: 10,
			marginTop: 10,
		},
		about: {
			fontSize: responsiveFontSize(1.8),
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
			textAlign: 'auto',
		},
		plus: {
			width: 30,
			height: 30,
			backgroundColor: colors.PRIMARY,
			borderRadius: 15,
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: 10,
		},
		edit: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		Cont: {
			backgroundColor: colors.BACKGROUND,
			paddingHorizontal: 15,
			paddingVertical: 10,
			marginBottom: 7,
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
			width:'100%'
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
