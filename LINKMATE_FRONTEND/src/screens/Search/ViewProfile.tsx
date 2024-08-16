import { View, StyleSheet, ListRenderItem, ScrollView } from 'react-native';
import React from 'react';
import { clearToken } from '../../redux/slices/authSlice';
import { useCustomTheme } from '../../config/Theme';
import { RootState } from '../../redux/store';
import { fonts } from '../../config/Fonts';

import {
	responsiveFontSize,
	responsiveHeight,
	responsiveWidth,
} from 'react-native-responsive-dimensions';
 
import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view';
import ViewProfileTopPart from './ViewProfileTopPart';
import ViewProfileOverview from './ViewProfileOverview';
import ViewProfileEducation from './ViewProfileEducation';
import ViewProfileProjects from './ViewProfileProjects';
import ViewProfileExperience from './ViewProfileExperience';
const HEADER_HEIGHT = 250;

const ViewProfile: React.FC = ({ navigation,route }) => {
    const {userId}=route.params
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const renderItem: ListRenderItem<number> = React.useCallback(({ index }) => {
		return (
			<View style={[styles.box, index % 2 === 0 ? styles.boxB : styles.boxA]} />
		);
	}, []);

	return (
		<View style={styles.cont}>
			<Tabs.Container
				renderHeader={(props) => <ViewProfileTopPart navigation={navigation} />}
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
						<ViewProfileOverview navigation={navigation} />
					</Tabs.ScrollView>
				</Tabs.Tab>
				<Tabs.Tab name="Projects">
					<Tabs.ScrollView style={styles.bg}>
						<ViewProfileProjects navigation={navigation} />
					</Tabs.ScrollView>
				</Tabs.Tab>
				<Tabs.Tab name="Experience">
					<Tabs.ScrollView style={styles.bg}>
						<ViewProfileExperience navigation={navigation} />
					</Tabs.ScrollView>
				</Tabs.Tab>
				<Tabs.Tab name="Education">
					<Tabs.ScrollView style={styles.bg}>
						<ViewProfileEducation navigation={navigation} />
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

export default ViewProfile;
