import React, {useState} from "react";
import {View, Text, TextInput, Button} from "react-native"

const CreateAccountScreen = (props) =>{
    return(
        <View>
            <Text>Create Account screen</Text>
            <TextInput placeholder="Email"></TextInput>
            <TextInput placeholder="Password"/>
            <TextInput placeholder="First name"></TextInput>
            <TextInput placeholder="Surname"></TextInput>
            <Button title="Create Account"></Button>
        </View>
    );
}

export default CreateAccountScreen;