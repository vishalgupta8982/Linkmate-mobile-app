import { View, Text, StyleSheet,ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { searchUser } from '../../api/apis';
import { useEffect } from 'react';
import { useCustomTheme } from '../../config/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons' 

export default function Search({ navigation }) {
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	 
	return (
		<ScrollView style={styles.mainCont}>
    <TouchableOpacity activeOpacity={0.4} onPress={()=>navigation.navigate("searchResult")} >
			<View style={styles.searchCont}>
				<Ionicons name="search" color={colors.PRIMARY} size={15} />
				<Text>{" "}Type here to search...</Text>
			</View></TouchableOpacity>
		</ScrollView>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		searchCont:{
      padding:15,
      backgroundColor:colors.LIGHT_MAIN_BACKGROUND,
      borderWidth:1,
      borderColor:colors.APP_PRIMARY,
      borderRadius:5,
      flexDirection:'row',
      alignItems:'flex-end',
      margin:5
    }
	});
