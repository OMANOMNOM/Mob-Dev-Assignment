import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import TestIPAddress from '../TestIPAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ route, navigation }) => {
  const [token, setToken] = useState('');
  const { user_id } = route.params;
  const [posts, setPosts] = useState('');

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        setToken(value);
        console.log(token);
      }
    } catch (e) {
      // error reading value
    }
  };
  const getPosts = () => {
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + user_id + '/post', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null) {
          setPosts(responseJson);
          console.log(responseJson);
        } else {
          console.log('Error signing in');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  useEffect(() => {
    getToken();
  });

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <View>
          <Text>Photo</Text>
        </View>
        <View>
          <Text>User details</Text>
          <Text>User details</Text>
          <Button
            title="View friends"
            onPress={() => {
              // Go to friends screen
              navigation.navigate('viewFriendsScreen', {
                userId: user_id
              });
            }}
          />
          <Button
            title="get Posts"
            onPress={() => {
              // Go to friends screen
              getPosts();
            }}
          />
          <Button
            title="makePost"
            onPress={() => {
              navigation.navigate('New Post', {
                userId: user_id
              });
            }}
          />
        </View>
      </View>
      <View>
        <Text>Post</Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: 'row' }}>
                <View style={{ height: 50, width: 50, backgroundColor: 'aliceblue' }} />
                <View>
                  <Text>
                    {item.author.first_name + '    ' + item.author.last_name}
                  </Text>
                </View>
                <Text> {item.text} </Text>
                <Button
                  title="View Post"
                  onPress={() => {
                    navigation.navigate('Single Post', {
                      userId: user_id,
                      postId: item.post_id,
                    });
                  }}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;
