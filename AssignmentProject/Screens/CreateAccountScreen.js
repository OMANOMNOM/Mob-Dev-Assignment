import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import TestIPAddress from '../TestIPAddress';

const CreateAccountScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // TODO: Form validation
  const createAccount = (pFirstName, pLastName, pEmail, pPassword, successCallback) => {
    // TODO: form validation

    return fetch(
      `${TestIPAddress.createAddress()}/api/1.0.0/user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: pFirstName,
          last_name: pLastName,
          email: pEmail,
          password: pPassword,
        }),
      },
    )
      .then((response) => {
        if (response.status === 201) {
          successCallback(true);
        } else if (response.status === 400) {
          throw 'Validation failed';
        } else if (response.status === 500) {
          throw 'internal server error';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View>
      {isSuccess === false ? (
        <>
          <Text>Create Account screen</Text>
          <TextInput placeholder="Email" onChangeText={(text) => setEmail(text)} />
          <TextInput placeholder="Password" onChangeText={(text) => setPassword(text)} />
          <TextInput placeholder="First name" onChangeText={(text) => setFirstName(text)} />
          <TextInput placeholder="Last name" onChangeText={(text) => setLastName(text)} />
          <Button
            title="Create Account"
            onPress={() => {
              createAccount(firstName, lastName, email, password, setIsSuccess);
            }}
          />
        </>
      ) : (
        <Text> Account Creation successful</Text>
      )}
    </View>
  );
};

export default CreateAccountScreen;
