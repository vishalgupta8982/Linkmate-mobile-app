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
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
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
export default function ViewProfileExperience({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const dispatch = useDispatch();
	const { colors } = theme;
	const styles = getStyles(colors);
	const globalStyleSheet = globalStyles(colors);
	const [loader, setLoader] = useState(false);
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
	return (
		<View style={styles.mainCont}>
			<View>
				{loader && <Loader />}
				{userData?.experiences.map((item) => (
					<View style={styles.experienceCard}>
						<View style={styles.position}>
							<Text style={globalStyleSheet.smallerHead}>{item.position}</Text>
							<Text style={styles.locationTypeText}>
								{
									locationTypeOptions.find(
										(option) => option.value === item.locationType
									)?.label
								}
							</Text>
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
						<Text style={globalStyleSheet.description}>{item.description}</Text>
					</View>
				))}
			</View>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
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
		locationTypeText: {
			color: colors.PRIMARY,
			fontFamily: fonts.Inter_Regular,
			fontSize: 14,
		},
	});
