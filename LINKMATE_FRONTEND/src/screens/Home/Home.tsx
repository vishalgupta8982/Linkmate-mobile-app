import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { userDetails } from '../../api/apis';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import { useCustomTheme } from '../../config/Theme';
import HomePageHeader from './HomePageHeader';

export default function Home({ navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const dispatch = useDispatch();
	const [loader, setLoader] = useState(false);
	const fetchUserDetails = async () => {
		try {
			const response = await userDetails();
			console.log(response);
			dispatch(setUserDetails(response));
		} catch (err) {
			console.error(err);
		} finally {
			setLoader(false);
		}
	};

	useEffect(() => {
		setLoader(true);
		fetchUserDetails();
	}, []);

	return (
		<View style={styles.mainCont}>
			{loader && <Loader />}
			<ScrollView>
				<HomePageHeader navigation={navigation} />
			</ScrollView>
		</View>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
	});
