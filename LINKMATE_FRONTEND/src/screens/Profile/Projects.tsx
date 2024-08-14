import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TouchableWithoutFeedback,
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
import { deleteEducation, deleteExperience } from '../../api/apis';
import Toast from 'react-native-simple-toast';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { useState } from 'react';
export default function Projects({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);
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
	return (
		<View style={styles.mainCont}>
			{userData?.experiences?.length > 0 && (
				<View>
					<View style={styles.cont}>
						<Text style={globalStyleSheet.smallHead}>Add Education</Text>
						<View style={styles.plus}>
							<AntDesign name="plus" size={16} color={colors.TEXT} />
						</View>
					</View>
					{loader && <Loader />}
					{userData?.educations.map((item) => (
						<View style={styles.experienceCard}>
							<View style={styles.position}>
								<Text style={globalStyleSheet.smallerHead}>
									{item.institution}
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
										onPress={() => handleDltEdu(item.educationId)}
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
							<Text style={globalStyleSheet.description}>
								{item.description}
							</Text>
						</View>
					))}
				</View>
			)}
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
	});
