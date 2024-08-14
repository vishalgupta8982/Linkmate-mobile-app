import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	BackHandler,
	TouchableWithoutFeedback,
	Modal,
	Image,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from '../../components/Loader';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../components/StackHeader';
import Toast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppButton } from '../../components/AppButton';
import { RootState } from '../../redux/store';
import { useCustomTheme } from '../../config/Theme';
import { fonts } from '../../config/Fonts';
import AppTextField from '../../components/AppTextField';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { updateProfilePicture, updateUserDetails } from '../../api/apis';
import { UpdatePayload } from '../../types/Payload/updatePayload';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { setToken } from '../../redux/slices/authSlice';
import CustomAlertDialog from '../../components/CustomAlertDialog';

export default function EditProfile({ navigation }) {
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const [loader, setLoader] = useState(false);
	const [isImageModalVisible, setImageModalVisible] = useState(false);
	const [firstName, setFirstName] = useState(userData?.firstName);
	const [lastName, setLastName] = useState(userData?.lastName);
	const [userName, setUserName] = useState(userData?.username);
	const [location, setLocation] = useState(userData?.location);
	const [about, setAbout] = useState(userData?.about);
	const [headline, setHeadline] = useState(userData?.headline);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [isModalVisible, setModalVisible] = useState(false);

	const chooseImage = () => {
		setImageModalVisible(false);
		ImagePicker.openPicker({
			cropping: false,
			compressImageMaxWidth: 800,
			compressImageMaxHeight: 800,
		})
			.then((image) => {
				console.log(image);
				uploadImg(image.path);
			})
			.catch((e) => console.log(e));
	};

	const handleUpdate = async () => {
		setLoader(true);
		if (firstName.length < 1) {
			Toast.show('Firstname is required', Toast.SHORT);
			setLoader(false);
			return;
		}
		if (lastName.length < 1) {
			Toast.show('Lastname is required', Toast.SHORT);
			setLoader(false);
			return;
		}
		const payload: Partial<UpdatePayload> = {};

		const fieldsToUpdate = {
			username: userName,
			firstName: firstName,
			lastName: lastName,
			location: location,
			headline: headline,
			about: about,
		};
		Object.entries(fieldsToUpdate).forEach(([key, value]) => {
			if (userData?.[key] !== value) {
				payload[key] = value;
			}
		});
		try {
			const response = await updateUserDetails(payload);
			Toast.show('Updated successfully', Toast.SHORT);
			setLoader(false);
			if (response?.token != null) {
				dispatch(setToken(response?.token));
			}
			dispatch(setUserDetails(response));
		} catch (err) {
			Toast.show(err.message, Toast.SHORT);
			setLoader(false);
			console.error(err);
		}
	};

	const deleteProfile = async () => {
		setLoader(true);
		const payload: UpdatePayload = {
			profilePicture: '',
		};
		setImageModalVisible(false);
		if (userData?.profilePicture == '') {
			setLoader(false);
			Toast.show('Profile not exist', Toast.SHORT);
			return;
		}
		try {
			const response = await updateUserDetails(payload);
			Toast.show('Deleted successfully', Toast.SHORT);
			setLoader(false);
			dispatch(setUserDetails(response));
		} catch (err) {
			Toast.show(err.message, Toast.SHORT);
			setLoader(false);
			console.error(err);
		}
	};

	const uploadImg = async (uri) => {
		setLoader(true);
		try {
			const response = await updateProfilePicture(uri);
			console.log(response);
			dispatch(setUserDetails(response));
			Toast.show('Updated successfully', Toast.SHORT);
			setLoader(false);
		} catch (err) {
			setLoader(false);
			console.error(err);
		}
	};

	useEffect(() => {
		if (
			firstName !== userData?.firstName ||
			lastName !== userData?.lastName ||
			headline !== userData?.headline ||
			location !== userData?.location ||
			userName !== userData?.username || 
			about !== userData?.about
		) {
			const backAction = () => {
				setAlertDialogVisible(true);
				return true;
			};
			const backHandler = BackHandler.addEventListener(
				'hardwareBackPress',
				backAction
			);
			return () => {
				backHandler.remove();
			};
		}
	}, [firstName, lastName, headline, location, userName, userData,about]);

	return (
		<ScrollView style={styles.mainCont}>
			<StackHeader navigation={navigation} title={'Edit Profile'} />
			{loader && <Loader />}
			<View style={styles.contentCont}>
				<TouchableWithoutFeedback
					onPress={() => {
						if (
							userData?.profilePicture &&
							userData.profilePicture.length > 1
						) {
							navigation.navigate('viewProfile', {
								image: userData?.profilePicture,
							});
						}
					}}
				>
					<Image
						style={styles.pic}
						source={{
							uri:
								userData?.profilePicture.length > 0
									? userData?.profilePicture
									: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8XHcngVONWqKATB8hOuO0GhItmIXIfGflTKqMuLSt6dV73i3caFKmfLcGUGUI5oC1658&usqp=CAU',
						}}
					/>
				</TouchableWithoutFeedback>
				<TouchableOpacity onPress={() => setImageModalVisible(true)}>
					<Text style={styles.editText}>Edit Picture</Text>
				</TouchableOpacity>
				<AppTextField
					label="First Name"
					value={firstName}
					onChangeText={setFirstName}
				/>
				<AppTextField
					label="Last Name"
					value={lastName}
					onChangeText={setLastName}
				/>
				<AppTextField
					label="Username"
					value={userName}
					onChangeText={setUserName}
				/>
				<AppTextField
					label="Headline"
					value={headline}
					onChangeText={setHeadline}
				/>
				<AppTextField
					label="Location"
					value={location}
					onChangeText={setLocation}
				/>
				<AppTextField
					label="About"
					value={about}
					onChangeText={setAbout}
				/>
			</View>
			<Modal
				transparent={true}
				animationType="slide"
				visible={isImageModalVisible}
				onRequestClose={() => setImageModalVisible(false)}
			>
				<TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
					<View style={styles.modalOverlay} />
				</TouchableWithoutFeedback>
				<View style={styles.modalContainer}>
					<TouchableOpacity style={styles.modalButton} onPress={chooseImage}>
						<AntDesign name="picture" size={20} color={colors.TEXT} />
						<Text style={styles.modalButtonText}>New Picture</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.modalButton} onPress={deleteProfile}>
						<AntDesign name="delete" size={20} color="#FF474C" />
						<Text style={[styles.modalButtonText, { color: '#FF474C' }]}>
							Remove Picture
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
			<CustomAlertDialog
				isOpen={alertDialogVisible}
				onClose={() => setAlertDialogVisible(false)}
				title={'Discard changes'}
				message={'Are you sure you want to discard your changes?'}
				ButtonText={'Discard'}
				onConfirm={() => navigation.goBack()}
			/>
			<AppButton onPress={handleUpdate} title="Save" />
		</ScrollView>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		contentCont: {
			padding: 15,
		},
		pic: {
			width: 120,
			height: 120,
			borderRadius: 60,
			alignSelf: 'center',
			marginVertical: 20,
		},
		editText: {
			color: colors.PRIMARY,
			fontSize: 14,
			textAlign: 'center',
			marginVertical: 10,
		},
		modalOverlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.3)',
		},
		modalContainer: {
			backgroundColor: colors.BACKGROUND,
			borderTopLeftRadius: 15,
			borderTopRightRadius: 15,
			paddingVertical: 20,
			paddingHorizontal: 25,
			position: 'absolute',
			bottom: 0,
			width: '100%',
		},
		modalButton: {
			flexDirection: 'row',
			alignItems: 'center',
			marginVertical: 10,
		},
		modalButtonText: {
			marginLeft: 10,
			fontSize: 14,
			color: colors.APP_PRIMARY,
		},
	});
