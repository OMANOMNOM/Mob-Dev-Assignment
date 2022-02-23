import React, {useState} from "react";
import {View, Text, TextInput, Button} from "react-native"

const LoginScreen = ({navigation}) =>{
    return(
        <View>
            <Text>Login Screen</Text>
            <TextInput placeholder="Email"></TextInput>
            <TextInput placeholder="Password"/>
            <Button title="Sign in" onPress={()=>{navigation.navigate("Home")}}></Button>
            <Button title="Create Account" onPress={()=>{
                navigation.navigate("CreateAccount")}}></Button>
        </View>
    );
}

export default LoginScreen;