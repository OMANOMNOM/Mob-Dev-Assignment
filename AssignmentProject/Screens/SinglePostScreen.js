import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import TestIPAddress from '../TestIPAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SinglePostScreen = ({ route, navigation }) => {
  const [token, setToken] = useState('');
  const [userid, setUserID] = useState('');
  const [postId, setPostId] = useState('');
  const [postText, setText] = useState('');
  const [postLikes, setPostLikes] = useState('');
  const [isPostOwner, setIsPostOwner] = useState(false);

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
          if (responseJson.author.user_id == userid) {
            setIsPostOwner(true);
          }
          setPostLikes(responseJson.numLikes);
          setText(responseJson.text);
        } else {
          console.log('Error signing in');
        }
      })
      .catch((error) => {
        console.log('Friend request already been sent');
      });
  };

  const likePost = () => {
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + userid + '/post/' + postId + '/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('we have succesfully like this post');
        }
      })
      .catch((error) => {
        console.log('Friend request already been sent');
      });
  };

  const deletePost = () => {
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + userid + '/post/' + postId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('we have succesfully deleted out');
          navigation.goBack();
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
        title="get"
        onPress={() => {
          getPost();
        }}
      />
      <Button
        title="Like"
        onPress={() => {
          likePost();
        }}
      />
      <Text> {postLikes}</Text>
      {isPostOwner && <Button title="delete" onPress={() => { deletePost(); }} />}

    </View>
  );
};

export default SinglePostScreen;
