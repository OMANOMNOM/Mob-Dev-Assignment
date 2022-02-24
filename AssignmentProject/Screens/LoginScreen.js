import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Login Screen</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" />
      <Button
        title="Sign in"
        onPress={() => {
          navigation.navigate('Home');
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
