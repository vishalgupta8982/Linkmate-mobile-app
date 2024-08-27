import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
} from 'react-native';
import React from 'react';
import { searchUser } from '../../api/apis';
import { useEffect } from 'react';
import { useCustomTheme } from '../../config/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fonts } from '../../config/Fonts';
import UserCard from '../../components/UserCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useState } from 'react';
import Loader from '../../components/Loader';

export default function Search({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [suggestion, setSuggestion] = useState([]);
	const [loader, setLoader] = useState(true);
	const getSuggestion = async () => {
		const query = `${
			userData?.location.split(' ')[0]
		} or ${userData?.skills.join(' or ')}`;
		try {
			const response = await searchUser(query);
			setSuggestion(response);
		} catch (err) {
			console.error(err);
		} finally {
			setLoader(false);
		}
	};
	useEffect(() => {
		getSuggestion();
	}, [userData]);
	return (
		<View style={styles.mainCont}>
		{loader &&(<Loader/>)}
			<ScrollView>
				<TouchableOpacity
					activeOpacity={0.4}
					onPress={() => navigation.navigate('searchResult')}
				>
					<View style={styles.searchCont}>
						<Ionicons name="search" color={colors.PRIMARY} size={15} />
						<Text style={styles.type}> Type here to search...</Text>
					</View>
				</TouchableOpacity>

				{loader ? (
					<Loader />
				) : (
					<View style={styles.container}>
						{suggestion.map(
							(item, index) =>
								item.username != userData?.username && (
									<UserCard userData={item} navigation={navigation} />
								)
						)}
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
			padding: 10,
			paddingHorizontal: 15,
		},
		searchCont: {
			padding: 15,
			borderWidth: 1,
			borderColor: colors.PRIMARY,
			borderRadius: 5,
			flexDirection: 'row',
			alignItems: 'flex-end',
			width: '100%',
			alignSelf: 'center',
			marginBottom: 5,
		},
		type: {
			color: colors.TEXT,
			fontFamily: fonts.Inter_Regular,
		},
		container: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between', // Ensures cards are spaced evenly
		},
	});
