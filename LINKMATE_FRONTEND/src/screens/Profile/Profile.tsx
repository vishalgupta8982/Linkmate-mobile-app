import { View, Text } from 'react-native'
import React from 'react'
import { AppButton } from '../../components/AppButton'
import { clearToken } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

export default function Profile({navigation}) {
  	const dispatch = useDispatch();
  const handleLogout = () => {
		navigation.replace('Login');
		dispatch(clearToken());
	};
  return (
    <View>
      <AppButton title={"Log out"} onPress={handleLogout} />
    </View>
  )
}