import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Card, Button } from 'react-native-elements';
import validator from 'validator';
import TestIPAddress from '../Utility/TestIPAddress';

const CreateAccountScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateDetails = () => {
    // 1. Make them strings
    const tempEmail = email + '';
    const tempPassword = password + '';
    const tempFirstName = firstName + '';
    const tempLastName = lastName + '';

    // 2. Check the aren't empty whitespaces
    if (validator.isEmpty(tempEmail, { ignore_whitespace: true })
      || validator.isEmpty(tempPassword, { ignore_whitespace: true })
      || validator.isEmpty(tempFirstName, { ignore_whitespace: true })
      || validator.isEmpty(tempLastName, { ignore_whitespace: true })) {
      console.log('Please make sure no inputs are left empty');
      return;
    }

    // 3. Check email validation (using default settings)
    if (!validator.isEmail(tempEmail)) {
      console.log('Please enter a valid email');
      return;
    }

    // 4. Make sure password is a 'strong password' (default settings)
    //    minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,
    //    returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower:
    //    10, pointsForContainingUpper: 10, pointsForContainingNumber: 10,
    //    pointsForContainingSymbol: 10 }
    if (!validator.isStrongPassword(tempPassword)) {
      console.log('Please enter a strong password');
      return;
    }

    // 5. Make sure names only contain letters default is en-us, obviously this would need to be
    //    update for different languages
    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
      console.log('Please enter a real name, names must only use english alphabet');
      return;
    }
    setIsValid(true);
  };

  useEffect(() => {
    const createAccount = () => {
      if (isValid === false) {
        return;
      }
      setIsLoading(true);
      return fetch(
        `${TestIPAddress.createAddress()}/api/1.0.0/user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
          }),
        },
      )
        .then((response) => {
          if (response.status === 201) {
            navigation.navigate('Login');
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
    setIsValid(false);
    setIsLoading(false);
    createAccount();
  }, [isValid]);

  return (
    <View>
      {isLoading === true ? (
        <ActivityIndicator />
      ) : (
        <Card>
          <Text>Create Account screen</Text>
          <TextInput placeholder="Email" maxLength={40} autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
          <TextInput placeholder="Password" maxLength={20} autoCapitalize="none" secureTextEntry onChangeText={(text) => setPassword(text)} />
          <TextInput placeholder="First name" maxLength={20} onChangeText={(text) => setFirstName(text)} />
          <TextInput placeholder="Last name" maxLength={20} onChangeText={(text) => setLastName(text)} />
          <Button
            title="Create Account"
            onPress={() => {
              validateDetails();
            }}
          />
        </Card>
      )}
    </View>
  );
};

export default CreateAccountScreen;
