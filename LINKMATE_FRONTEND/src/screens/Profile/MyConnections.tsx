import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { useCustomTheme } from '../../config/Theme';
import { getMyConnections } from '../../api/apis';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from '../../components/Loader';
import StackHeader from '../../components/StackHeader';
export default function MyConnections() {
    const theme = useCustomTheme();
		const { colors } = theme;
		const styles = getStyles(colors);
        const [myConnection,setMyConnnection]=useState([])
        const [loader,setLoader]=useState(false)
        const fetchConnection=async()=>{
            try{
                const response=await getMyConnections();
                setMyConnnection(response)
            }catch(err){
                console.error(err)
            }
        }
        useEffect(()=>{
            setLoader(true)
            fetchConnection()
        },[])
  return (<ScrollView style={styles.mainCont} >
    <View style={styles.mainCont}  >
    {!loader &&(<Loader/>)}
    <StackHeader title="Connections" />

    <
    /View>
  </ScrollView>);
}

const getStyles = (colors) =>
	StyleSheet.create({
		mainCont:{
            flex:1,
            backgroundColor:colors.MAIN_BACKGROUND
        }
	});