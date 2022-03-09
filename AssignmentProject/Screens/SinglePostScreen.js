import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import TestIPAddress from '../TestIPAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SinglePostScreen = ({ route, navigation }) => {
  const [token, setToken] = useState('');
  const [userid, setUserID] = useState('');
  const [postId, setPostId] = useState('');
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

  const getPost = () => {
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + userid + '/post/' + postId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null) {
          console.log(responseJson);
          console.log(responseJson.text);
          console.log("Above is our text")
          setText(responseJson.text);
        } else {
          console.log('Error signing in');
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
      setPostId(route.params.postId);
      setUserID(route.params.userId);
    }
  });

  return (
    <View>
      <View>
        <Text>{postText}</Text>
      </View>
      <Button
        title="Like"
        onPress={() => {
          getPost();
        }}
      />
    </View>
  );
};

export default SinglePostScreen;
