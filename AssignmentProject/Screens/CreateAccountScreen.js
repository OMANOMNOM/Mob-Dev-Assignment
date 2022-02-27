import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

// TODO: Form validation
function createAccount(pFirstName, pLastName, pEmail, pPassword, successCallback) {
  return fetch(
    'http://localhost:3333/api/1.0.0/user',
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
      if (response.ok) {
        successCallback(true);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

const CreateAccountScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
