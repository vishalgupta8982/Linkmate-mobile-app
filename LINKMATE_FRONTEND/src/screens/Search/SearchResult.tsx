import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	TextInput,
	FlatList,
	Image,
} from 'react-native';
import React, { useState } from 'react';
import { searchUser } from '../../api/apis';
import { useEffect, useRef } from 'react';
import Loader from '../../components/Loader';
import { useCustomTheme } from '../../config/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { fonts } from '../../config/Fonts';
import _ from 'lodash';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function SearchResult({ navigation }) {
	const username = useSelector(
		(state: RootState) => state.userDetails.user.username
	);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const [searchResult, setSearchResult] = useState([]);
	const debouncedSearch = useRef(
		_.debounce(async (query: string) => {
			setLoading(true);
			const test = query.length < 1 ? '' : query;
			try {
				const response = await searchUser(test);
				setSearchResult(response);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}, 200)
	).current;
	const handleChangeText = (text) => {
		setQuery(text);
		debouncedSearch(text);
	};

	return (
		<View style={styles.mainCont}>
			{loading && <Loader />}
			<View style={styles.back}>
				<TouchableOpacity
					activeOpacity={0.4}
					onPress={() => navigation.goBack()}
				>
					<AntDesign
						name="arrowleft"
						size={18}
						marginHorizontal={5}
						padfig={5}
						color={colors.TEXT}
					/>
				</TouchableOpacity>
				<View style={styles.searchCont}>
					<Ionicons name="search" color={colors.PRIMARY} size={18} />
					<TextInput
						onChangeText={handleChangeText}
						style={styles.input}
						selectionColor={colors.PRIMARY}
						placeholder="Type here to search..."
						placeholderTextColor={colors.TEXT}
					/>
				</View>
			</View>
			<FlatList
				data={searchResult}
				keyExtractor={(item, index) => item.userId?.timestamp.toString()}
				renderItem={({ item }) => (
					<TouchableOpacity
						activeOpacity={0.4}
						onPress={() =>
							navigation.navigate(
								username == item.username ? 'Profile' : 'searchUserProfile',
								{ username: item.username }
							)
						}
					>
						<View style={styles.list}>
							<Image
								style={styles.profile}
								source={{ uri: item.profilePicture }}
							/>
							<View>
								<Text style={styles.name}>
									{item.firstName} {item.lastName}
								</Text>
								<Text
									style={styles.headline}
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{item.headline}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				)}
			/>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			backgroundColor: colors.MAIN_BACKGROUND,
			flex: 1,
		},
		searchCont: {
			borderWidth: 1,
			borderColor: colors.PRIMARY,
			borderRadius: 5,
			flexDirection: 'row',
			alignItems: 'center',
			margin: 5,
			paddingHorizontal: 10,
			marginBottom: 5,
			width:'87%'
		},
		input: {
			fontSize: 14,
			fontFamily: fonts.Inter_Regular,
			color: colors.TEXT,
			width: '80%',
		},
		 
		back: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		list: {
			marginTop: 5,
			padding: 5,
			paddingHorizontal: 10,
			flexDirection: 'row',
			alignItems: 'center',
			width: responsiveWidth(72),
		},
		profile: {
			width: 50,
			height: 50,
			borderRadius: 25,
			marginRight: 10,
		},
		name: {
			color: colors.TEXT,
			fontFamily: fonts.Inter_Medium,
			fontSize: 16,
		},
		headline: {
			color: colors.APP_PRIMARY_LIGHT,
			fontFamily: fonts.Inter_Medium,
			fontSize: 12,
		},
	});
