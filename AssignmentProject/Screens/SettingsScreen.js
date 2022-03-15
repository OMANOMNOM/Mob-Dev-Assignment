import React, { useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';
import { Card, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestIPAddress from '../TestIPAddress';
import AuthContext from '../AuthContext';

const SettingsScreen = () => {
  const [isCurrent, setIsCurrent] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
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
  useEffect(() => {
    const getInfo = async () => {
      let tid = null;
      let ttoken = null;
      ttoken = await getToken();
      tid = await getID();
      console.log(tid);

      fetch(`${TestIPAddress.createAddress()}/api/1.0.0/user/${tid}`, {
        method: 'GET',
        headers: {
          'X-Authorization': ttoken,
        }
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson !== null) {
            setFirstName(responseJson.first_name)
            setLastName(responseJson.last_name)
            setEmail(responseJson.email)
            setIsCurrent(true);
          } else {
            console.log('Error signing in');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    getInfo();
  }, [])

  const updateUser = async () => {
    // Check if difference. 
    // Try submitting
    let tid = null;
    tid = await getID();
    let token = await getToken();
    return fetch(
      `${TestIPAddress.createAddress()}/api/1.0.0/user/${tid}`,
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

  const validateSignOut = async () => {
    let token = await getToken();

    return fetch(`${TestIPAddress.createAddress()}/api/1.0.0/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: '',
    })
      .then((response) => {
        if (response.status === 200) {
          setIsSignedIn(false);
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
      {isCurrent != null && (
        <Card>
          <TextInput placeholder='FirstName' defaultValue={firstName} onChangeText={(text) => { setFirstName(text); setIsCurrent(false) }} />
          <TextInput placeholder='SurName' defaultValue={lastName} onChangeText={(text) => { setLastName(text); setIsCurrent(false) }} />
          <TextInput placeholder='Email' defaultValue={email} onChangeText={(text) => { setEmail(text); setIsCurrent(false) }} />
          <TextInput placeholder='Change password' onChangeText={(text) => { setPassword(text); setIsCurrent(false) }} />

          <Button title="Save Changes" onPress={updateUser} />
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
    </View>
  );
};

export default SettingsScreen;
