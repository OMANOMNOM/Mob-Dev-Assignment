import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../AuthContext';

let isSignedIn = false;
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false)
  const { signIn } = React.useContext(AuthContext);

  const ValidateCredentials = (pEmail, pPassword) => {
    return fetch(
      'http://localhost:3333/api/1.0.0/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: pEmail,
          password: pPassword,
        }),
      },
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("is this code even being executed");
        if (responseJson.id !== null) {
          console.log(responseJson);
          storeData('id', responseJson.id);
          storeData('token', responseJson.token);
          console.log(responseJson.id);
          console.log("This hsould be false")
          setIsSignedIn(true)
        } else {
          //Throw error or inform user
          console.log("Error signing in");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  if (isSignedIn){
    signIn({ email, password });
  }
  
  return (
    <View>
      <Text>Login Screen</Text>
      <TextInput placeholder="Email" onChangeText={(text) => setEmail(text)} />
      <TextInput placeholder="Password" onChangeText={(text) => setPassword(text)} />
      <Button
        title="Sign in"
        onPress={() => {
          ValidateCredentials(email, password);
        }}
      />
      <Button
        title="Create Account"
        onPress={() => {
          navigation.navigate('CreateAccount');
        }}
      />
    </View>
  );
};

export default LoginScreen;
