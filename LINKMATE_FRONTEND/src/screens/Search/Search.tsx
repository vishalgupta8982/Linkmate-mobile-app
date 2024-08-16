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

export default function Search({ navigation }) {
	const userData = useSelector((state: RootState) => state.userDetails.user);
	const theme = useCustomTheme();
	const { colors } = theme;
	const styles = getStyles(colors);
	const[suggestion,setSuggestion]=useState([])
	const[loader,setLoader]=useState(true)
	const getSuggestion=async()=>{
		try{
			const response=await searchUser();
			setSuggestion(response)

		}catch(err){
			console.error(err)
		}
		finally{
			setLoader(false)
		}
	}
	useEffect(()=>{
		getSuggestion()
	},[])
	return (
		<ScrollView style={styles.mainCont}>
			<TouchableOpacity
				activeOpacity={0.4}
				onPress={() => navigation.navigate('searchResult')}
			>
				<View style={styles.searchCont}>
					<Ionicons name="search" color={colors.PRIMARY} size={15} />
					<Text style={styles.type}> Type here to search...</Text>
				</View>
			</TouchableOpacity>

			<UserCard userData= />
		</ScrollView>
	);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont: {
			backgroundColor: colors.MAIN_BACKGROUND,
		},
		searchCont: {
			padding: 15,
			borderWidth: 1,
			borderColor: colors.PRIMARY,
			borderRadius: 5,
			flexDirection: 'row',
			alignItems: 'flex-end',
			margin: 5,
			width: '95%',
			alignSelf: 'center',
		},
		type: {
			color: colors.TEXT,
			fontFamily: fonts.Inter_Regular,
		},
	});
