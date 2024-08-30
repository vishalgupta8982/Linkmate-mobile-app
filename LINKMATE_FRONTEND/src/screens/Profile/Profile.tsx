import { View, StyleSheet, ListRenderItem, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { clearToken } from '../../redux/slices/authSlice';
import { useCustomTheme } from '../../config/Theme';
import { RootState } from '../../redux/store';
import { fonts } from '../../config/Fonts';

import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
import ProfilePicSection from './ProfilePicSection';
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import ProfileTopPart from './ProfileTopPart';
import Overview from './Overview';
import Education from './Education';
import Experience from './Experience';
import Projects from './Projects';
import { useEffect } from 'react';
import { userDetails } from '../../api/apis';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import Loader from '../../components/Loader';
import UserPost from './UserPost';
const HEADER_HEIGHT = 250;

const DATA = [0, 1, 2, 3, 4];
const identity = (v: unknown): string => v + '';

const Header = () => {
	return <View style={styles.header} />;
};

const Profile: React.FC = ({ navigation }) => {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const dispatch = useDispatch();
	const [loader, setLoader] = useState(false);

	const renderItem: ListRenderItem<number> = React.useCallback(({ index }) => {
		return (
			<View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
		);
	}, []);
	const fetchUserDetails = async () => {
		setLoader(true);
		try {
			const response = await userDetails();
			dispatch(setUserDetails(response));
		} catch (err) {
			console.error(err);
		} finally {
			setLoader(false);
		}
	};
	useEffect(() => {
		fetchUserDetails();
	}, []);

	return (
		<View style={styles.cont}>
			{!loader && <Loader />}
			<Tabs.Container
				renderHeader={(props) => <ProfileTopPart navigation={navigation} />}
				headerHeight={HEADER_HEIGHT}
				renderTabBar={(props) => (
					<MaterialTabBar
						{...props}
						scrollEnabled={true}
						labelStyle={styles.labelStyle}
						tabStyle={styles.tabStyle}
						indicatorStyle={[
							styles.indicatorStyle,
							{ backgroundColor: colors.PRIMARY },
						]}
						activeColor={colors.PRIMARY}
						inactiveColor={colors.TEXT}
						style={styles.bg}
					/>
				)}
			>
				<Tabs.Tab name="Overview">
					<Tabs.ScrollView style={styles.bg}>
						<Overview navigation={navigation} />
					</Tabs.ScrollView>
				</Tabs.Tab>
				<Tabs.Tab name="Projects">
					<Tabs.ScrollView style={styles.bg}>
						<Projects navigation={navigation} />
					</Tabs.ScrollView>
				</Tabs.Tab>
				<Tabs.Tab name="Experience">
					<Tabs.ScrollView style={styles.bg}>
						<Experience navigation={navigation} />
					</Tabs.ScrollView>
				</Tabs.Tab>
				<Tabs.Tab name="Education">
					<Tabs.ScrollView style={styles.bg}>
						<Education navigation={navigation} />
					</Tabs.ScrollView>
				</Tabs.Tab>
			</Tabs.Container>
		</View>
	);
};

const getStyles = (colors) =>
	StyleSheet.create({
		tabStyle: {
			width: responsiveWidth(38),
			borderBottomWidth: 1,
			borderBottomColor: 'grey',
		},
		labelStyle: {
			fontSize: responsiveFontSize(2),
			fontFamily: fonts.Inter_Medium,
			textTransform: 'capitalize',
		},
		bg: {
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		cont: {
			flex: 1,
			backgroundColor: colors.MAIN_BACKGROUND,
		},
	});

export default Profile;
