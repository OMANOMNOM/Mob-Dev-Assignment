import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const CreateAccountScreen = () => {
  return (
    <View>
      <Text>Create Account screen</Text>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" />
      <TextInput placeholder="First name" />
      <TextInput placeholder="Surname" />
      <Button title="Create Account" />
    </View>
  );
};

export default CreateAccountScreen;
