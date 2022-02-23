import React, {useState} from "react";
import {View, Text, TextInput, Button, StyleSheet} from "react-native"

const HomeScreen = (props) =>{
    return(
        <View>
            <Text>Home Screen</Text>
            <View style={{flexDirection:"row"}}>
                <Button title="Search"/>
                <Button title="Home"/>
                <Button title="Notifications"/>
            </View>
        </View>
    );
}
/*
const style = StyleSheet.create({
    nav: {
        flex: 1,
    }
})*/
export default HomeScreen;