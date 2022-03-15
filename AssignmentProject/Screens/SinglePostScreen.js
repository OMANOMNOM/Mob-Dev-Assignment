import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { Card } from 'react-native-elements';

import TestIPAddress from '../TestIPAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SinglePostScreen = ({ route, navigation }) => {
  const [token, setToken] = useState('');
  const [userid, setUserID] = useState('');
  const [postId, setPostId] = useState('');
  const [postText, setText] = useState('');
  const [postLikes, setPostLikes] = useState('');
  const [isPostOwner, setIsPostOwner] = useState(false);
  const [postInfo, setPostInfo] = useState(null);
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // value previously stored
        setToken(value);
        return value;
      }
    } catch (e) {
      // error reading value
    }
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

  const editPost = () => {

  }

  useEffect(() => {
    if (route.params != null) {
      setPostId(route.params.postId);
      setUserID(route.params.userId);
    }

    // Don't use states here because they won't be updated in time.
    const getPost = async () => {
      let ptoken = await getToken();
      return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + route.params.userId + '/post/' + route.params.postId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': ptoken,
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson !== null) {
            if (responseJson.author.user_id == route.params.userId) {
              setIsPostOwner(true);
            }
            setPostInfo(responseJson)
          } else {
            console.log('Error signing in');
          }
        })
        .catch((error) => {
          console.log('Cant get post ');
        });
    };
    getPost();
  }, []);

  return (
    <View>
      {postInfo && (
        <Card>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: 50, width: 50, backgroundColor: 'aliceblue' }} />
              <View>
                <Text>{`${postInfo.author.first_name}    ${postInfo.author.last_name}`}</Text>
                <Text>{new Date(postInfo.timestamp).toISOString()}</Text>
              </View>
            </View>
            <Text>
              {postInfo.text}
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <Button
                title="Like"
                onPress={() => {
                  likePost();
                }}
              />
              <Text> {postInfo.numLikes}</Text>
              {isPostOwner &&
                (<>
                  <Button
                    title="Edit"
                    onPress={() => {
                      editPost();
                    }}
                  />

                  <Button
                    title="Delete"
                    onPress={() => {
                      deletePost();
                    }}
                  />
                </>
                )}
            </View>
          </View>
        </Card>
      )}
    </View>
  );
};

export default SinglePostScreen;
