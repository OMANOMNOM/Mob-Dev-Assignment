import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestIPAddress from '../Utility/TestIPAddress';

const NewPostScreen = ({ route, navigation }) => {
  const [token, setToken] = useState('');
  const [users, setUsers] = useState([]);
  const [id, setID] = useState('');
  const [postText, setText] = useState('');
  const [isUpdating, setIsUpdating] = useState(null);
  const [postId, setPostId] = useState(null);
  const [postInfo, setPostInfo] = useState(null);
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
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + id + '/post', {
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

  const updatePost = () => {
    let temp = postInfo;
    temp.text = postText; 
    setPostInfo(temp);
    console.log(id)
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + id + '/post/' + postInfo.post_id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(
        temp
      ),
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
    if (route.params != null) {
      setID(route.params.userId);
      if (route.params.isUpdating != null) {
        setIsUpdating(route.params.isUpdating);
        setPostId(route.params.postId);
        console.log("The value of isupdaing shlud be true")
        console.log(route.params.isUpdating)
      }
      getToken();
    } else {
      //getID();
      //Don't think we need this code tbh
    }

  }, []);

  useEffect(() => {

    if (token === '') {
      return;
    }
    console.log(`${isUpdating} value of is updatinh`);
    const getPost = async () => {
      return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + route.params.userId + '/post/' + route.params.postId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson !== null) {
            console.log(responseJson)
            console.log(responseJson.text)
            setText(responseJson.text)
            setPostInfo(responseJson)

          } else {
            console.log('Not returned what we want');
          }
        })
        .catch((error) => {
          console.log('Cant get post ');
        });
    };
    getPost();
  }, [token]);

  return (
    <View>
      {isUpdating !== true ? (
        <>
          <Text>Make a new post</Text>
          <View>
            <TextInput
              multiline
              numberOfLines={8}
              defaultValue="Enter your post here!"
              onChangeText={(text) => {
                setText(text);
                console.log(text);
              }}
            />
          </View>
          <Button
            title="Post"
            onPress={() => {
              addPost();
            }}
          />
        </>
      ) : (
        <>
          <Text>Update a post</Text>
          <View>
            <TextInput
              multiline
              value={postText}
              numberOfLines={8}
              onChangeText={(text) => {
                setText(text);
                console.log(text);
              }}
            />
          </View>
          <Button
            title="Update Post"
            onPress={() => {
              updatePost();
            }}
          />
        </>
      )}
    </View>
  );
};

export default NewPostScreen;
