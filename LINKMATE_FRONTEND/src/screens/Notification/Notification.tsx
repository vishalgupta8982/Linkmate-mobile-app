import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
} from 'react-native';
import React from 'react'
import { useCustomTheme } from '../../config/Theme';
import StackHeader from '../../components/StackHeader';
import { getAllConnectionRequest } from '../../api/apis';
import { useState } from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useEffect } from 'react';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { globalStyles } from '../../StylesSheet';
import ConnectionRequest from './ConnectionRequest';
export default function Notification({navigation}) {
    const theme = useCustomTheme();
		const { colors } = theme;
		const styles = getStyles(colors);
        const globalStyleSheet = globalStyles(colors);
  return (
		<View style={styles.mainCont}>
			<ScrollView>
				<StackHeader title="Notifications" navigation={navigation} />
				 <ConnectionRequest navigation={navigation} />
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