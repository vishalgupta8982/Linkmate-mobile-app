import { Actionsheet, Avatar } from 'native-base';
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
	const [openAS, setOpenAS] = useState(false);
	const [firstName, setFirstName] = useState(userData?.firstName);
	const [lastName, setLastName] = useState(userData?.lastName);
	const [userName, setUserName] = useState(userData?.username);
	const [location, setLocation] = useState(userData?.location);
	const [about, setAbout] = useState(userData?.about);
	const [headline, setHeadline] = useState(userData?.headline);
	const [alertDialogVisible, setAlertDialogVisible] = useState(false);
	const [isModalVisible, setModalVisible] = useState(false);
	const chooseImage = () => {
		setOpenAS(false);
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
			about:about
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
		setOpenAS(false);
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
			userName !== userData?.username
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
	}, [firstName, lastName, headline, location, userName, userData]);

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
					<Avatar
						alignSelf={'center'}
						size={'2xl'}
						source={{
							uri:
								userData?.profilePicture.length > 0
									? userData?.profilePicture
									: null,
						}}
						bg={colors.PRIMARY}
					>
						{userData?.firstName?.charAt(0).toUpperCase() +
							userData?.lastName?.charAt(0).toUpperCase()}
					</Avatar>
				</TouchableWithoutFeedback>
				<TouchableOpacity onPress={() => setOpenAS(!openAS)}>
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
				<AppTextField label="About" value={about} onChangeText={setAbout} />
				<AppTextField
					label="Location"
					value={location}
					onChangeText={setLocation}
				/>
				<Actionsheet
					isOpen={openAS}
					onClose={() => setOpenAS(!openAS)}
					size="full"
				>
					<Actionsheet.Content bg={colors.BACKGROUND}>
						<Actionsheet.Item
							onPress={() => chooseImage('photo')}
							bg={colors.BACKGROUND}
							_pressed={{ bg: colors.MAIN_BACKGROUND }}
							startIcon={
								<AntDesign name="picture" color={colors.TEXT} size={22} />
							}
						>
							<Text fontFamily={fonts.Inter_Medium} color={colors.TEXT}>
								New Picture
							</Text>
						</Actionsheet.Item>
						<Actionsheet.Item
							bg={colors.BACKGROUND}
							onPress={deleteProfile}
							_pressed={{ bg: colors.MAIN_BACKGROUND }}
							startIcon={
								<AntDesign name="delete" color={'#FF474C'} size={22} />
							}
						>
							<Text fontFamily={fonts.Inter_Medium} color="#ff0000">
								Remove Picture
							</Text>
						</Actionsheet.Item>
					</Actionsheet.Content>
				</Actionsheet>
			</View>
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
		editText: {
			fontFamily: fonts.Inter_Medium,
			color: colors.PRIMARY,
			textAlign: 'center',
			marginVertical: 10,
		},
	});
