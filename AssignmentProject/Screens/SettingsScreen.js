import React, { useEffect, useState } from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import { Card, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validator from 'validator';
import TestIPAddress from '../Utility/TestIPAddress';
import AuthContext from '../AuthContext';

const SettingsScreen = () => {
  const [isCurrent, setIsCurrent] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signOut } = React.useContext(AuthContext);
  const [isSignedIn, setIsSignedIn] = useState(true);

  // onaffect
  // Load up current info
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        return value;
      }
    } catch (e) {
      // error reading value
    }
  };
  const getID = async () => {
    try {
      const value = await AsyncStorage.getItem('id');
      if (value !== null) {
        return value;
      }
    } catch (e) {
      // error reading value
    }
  };

  if (!isSignedIn) {
    signOut({});
  }

  // TODO: Put all these into a utility function since its shared with createAcc screen
  const validateInfo = () => {
    setIsValid(true);

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

  // Get Current info and populate inputs with said data
  // Get called once page is initally loaded
  useEffect(() => {
    const getInfo = async () => {
      setIsLoading(true);
      const id = await getID();
      const token = await getToken();

      fetch(`${TestIPAddress.createAddress()}/api/1.0.0/user/${id}`, {
        method: 'GET',
        headers: {
          'X-Authorization': token,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } if (response.status === 401) {
            throw 'Unauthorised';
          } if (response.status === 404) {
            throw 'Not found';
          } if (response.status === 500) {
            throw 'Server error';
          }
        })
        .then((responseJson) => {
          if (responseJson !== null) {
            setFirstName(responseJson.first_name);
            setLastName(responseJson.last_name);
            setEmail(responseJson.email);
            setIsCurrent(true);
          } else {
            console.log('Unexpected JSON return');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
    getInfo();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const updateUser = async () => {
      if (isValid === false) {
        return;
      }
      if (isCurrent === true) {
        return;
      }
      setIsLoading(true);
      const id = await getID();
      const token = await getToken();

      return fetch(
        `${TestIPAddress.createAddress()}/api/1.0.0/user/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token,

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
          if (response.status === 200) {
            // Navigate to home?
          } else if (response.status === 400) {
            throw 'Bad request';
          } else if (response.status === 401) {
            throw 'Unauthorised';
          } else if (response.status === 403) {
            throw 'Forbidden';
          } else if (response.status === 404) {
            throw 'Not Found';
          } else if (response.status === 500) {
            throw 'Server Error';
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    setIsValid(false);
    updateUser();
    setIsLoading(false);
  }, [isValid]);

  const validateSignOut = async () => {
    const token = await getToken();
    setIsLoading(true);
    return fetch(`${TestIPAddress.createAddress()}/api/1.0.0/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setIsSignedIn(false);
          setIsLoading(false);
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 500) {
          throw 'Server Error';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // If i click save then submit to server.
  // Reload current info
  return (
    <View>
      {isLoading === true ? (
        <ActivityIndicator />
      ) : (
        <>
          {isCurrent != null && (
            <Card>
              <TextInput placeholder="FirstName" maxLength={20} defaultValue={firstName} onChangeText={(text) => { setFirstName(text); setIsCurrent(false); }} />
              <TextInput placeholder="SurName" maxLength={20} defaultValue={lastName} onChangeText={(text) => { setLastName(text); setIsCurrent(false); }} />
              <TextInput placeholder="Email" maxLength={40} defaultValue={email} autoCapitalize="none" onChangeText={(text) => { setEmail(text); setIsCurrent(false); }} />
              <TextInput placeholder="Change password" maxLength={20} autoCapitalize="none" secureTextEntry onChangeText={(text) => { setPassword(text); setIsCurrent(false); }} />

              <Button title="Save Changes" onPress={validateInfo} />
            </Card>
          )}
          <Card>
            <Button
              title="logout"
              onPress={() => {
                validateSignOut();
              }}
            />
          </Card>
        </>
      )}
    </View>
  );
};

export default SettingsScreen;
