import { View, Text } from 'react-native';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { userDetails } from '../../api/apis';
import { setUserDetails } from '../../redux/slices/UserDetailsSlice';
import { useEffect } from 'react';

export default function Home() {
	 
	const dispatch = useDispatch();
	const fetchUserDetails = async () => {
		try {
			const response = await userDetails();
			dispatch(setUserDetails(response));
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchUserDetails();
	}, []);  

	return (
		<View>
			<Text>Home</Text>
		</View>
	);
}
