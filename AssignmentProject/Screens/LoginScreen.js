import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Button } from 'react-native-elements';
import AuthContext from '../AuthContext';
import TestIPAddress from '../TestIPAddress';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = React.useContext(AuthContext);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  };

  const ValidateCredentials = () => {
    // Preform basic type validation
    if (true) {
      setIsValid(true);
    }
  };

  useEffect(() => {
    const signInServer = () => {
      if (isValid === false) {
        return;
      }

      setIsLoading(true);
      return fetch(
        `${TestIPAddress.createAddress()}/api/1.0.0/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      )
        .then((response) => {
          setIsLoading(false);
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

    signInServer();
  }, [isValid]);

  if (isSignedIn) {
    signIn({ email, password });
  }

  // TODO: maxLength currently 50 for both em,pwsd.
  // Don't really see anypoint to using the <form> tags.
  return (
    <View>
      {isLoading === true ? (
        <ActivityIndicator />
      ) : (
        <>
          <Card>
            <TextInput placeholder="Email" autoCapitalize="none" maxLength={50} onChangeText={(text) => setEmail(text)} />
            <TextInput placeholder="Password" autoCapitalize="none" secureTextEntry="true" maxLength={50} onChangeText={(text) => setPassword(text)} />
            <Button
              title="Sign in"
              onPress={() => {
                ValidateCredentials();
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
        </>
      )}
    </View>
  );
};

export default LoginScreen;
