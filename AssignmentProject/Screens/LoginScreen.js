import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Button } from 'react-native-elements';
import AuthContext from '../AuthContext';
import TestIPAddress from '../TestIPAddress';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { signIn } = React.useContext(AuthContext);

  const ValidateCredentials = (pEmail, pPassword) => {
    return fetch(
      `${TestIPAddress.createAddress()}/api/1.0.0/login`,
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
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          throw 'Incorrect username or password';
        } else {
          throw 'Something went wrong :(';
        }
      })
      .then((responseJson) => {
        if (responseJson.id !== null) {
          storeData('id', responseJson.id.toString());
          storeData('token', responseJson.token);
          setIsSignedIn(true);
        } else {
          throw 'Unexpected data returned';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isSignedIn) {
    signIn({ email, password });
  }

  return (
    <View>
      <Card>
        <TextInput placeholder="Email" onChangeText={(text) => setEmail(text)} />
        <TextInput placeholder="Password" onChangeText={(text) => setPassword(text)} />
        <Button
          title="Sign in"
          onPress={() => {
            ValidateCredentials(email, password);
          }}
        />
      </Card>
      <Card>
        <Button
          title="Create Account"
          onPress={() => {
            navigation.navigate('CreateAccount');
          }}
        />
      </Card>
    </View>
  );
};

export default LoginScreen;
