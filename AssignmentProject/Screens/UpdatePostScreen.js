import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestIPAddress from '../TestIPAddress';

// Load in Current post
// Allow user to update text
// Allow user to press update(to update on server) or back to cancel

const UpdatePostScreen = ({ route, navigation }) => {
  const [token, setToken] = useState('');
  const [users, setUsers] = useState([]);
  const [id, setID] = useState('');
  const [postText, setText] = useState('');

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // value previously stored
        setToken(value);
        console.log('We got the token');
      }
    } catch (e) {
      // error reading value
    }
  };

  const getID = async () => {
    try {
      const value = await AsyncStorage.getItem('id');
      if (value !== null) {
        // value previously stored
        setID(value);
        console.log('We got the id');
      }
    } catch (e) {
      // error reading value
    }
  };

  const addPost = () => {
    var t = postText;
    console.log(id)
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/'+ id +'/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify({
        text: t,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Friend request succesfully sent');
        }
      })
      .catch((error) => {
        console.log('Friend request already been sent');
      });
  };

  useEffect(() => {
    getToken();
    if (route.params != null) {
      console.log(route.params.userId);
      setID(route.params.userId);
    } else {
      getID();
    }
  });

  return (
    <View>
      <Text>Update Post</Text>
      
    </View>
  );
};

export default UpdatePostScreen;
