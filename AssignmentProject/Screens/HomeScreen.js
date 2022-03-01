import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../AuthContext';

const HomeScreen = () => {
  const [token, setToken] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(true);
  const { signOut } = React.useContext(AuthContext);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token')
      if (value !== null) {
        setToken(value)
        console.log(token)
      }
    } catch (e) {
      // error reading value
    }
  }

  useEffect(() => {   
    getData();

      });

  const validateSignOut = () => {
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: "",
    })
      .then(response => {
        if(response.ok){
          console.log('we have succesfully logged out')
          setIsSignedIn(false)
        }
        //response.json()
      })
      //.then(data => {
      //  console.log('Success:', data);
      //})
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  

  if (!isSignedIn) {
    signOut({});
  }

  return (
    <View>
      <Text>Home Screen</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title="Search" />
        <Button title="Home" />
        <Button title="Notifications" />
        <Button title="logout" onPress={() => {
          validateSignOut();
        }} />
      </View>
    </View>
  );
};


export default HomeScreen;
