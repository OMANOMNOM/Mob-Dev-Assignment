import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../AuthContext';
import TestIPAddress from '../TestIPAddress';

const HomeScreen = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [id, setID] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(true);
  const { signOut } = React.useContext(AuthContext);
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

  const getID = async () => {
    try {
      const value = await AsyncStorage.getItem('id');
      if (value !== null) {
        setID(value);
        console.log(token);
      }
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getToken();
    getID();
  });

  const validateSignOut = () => {
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: '',
    })
      .then((response) => {
        if (response.ok) {
          console.log('we have succesfully logged out');
          setIsSignedIn(false);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const getPosts = () => {
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + id + '/post', {
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

  if (!isSignedIn) {
    signOut({});
  }

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
              //Go to friends screen
              navigation.navigate('viewFriendsScreen');
            }} />
        </View>
      </View>
      <View>
        <Text>Post</Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => {
            return (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ height: 50, width: 50, backgroundColor: "aliceblue", }} />
                  <View>
                    <Text>
                      {item.author.first_name+ '    ' + item.author.last_name}
                      {item.timestamp}
                    </Text>
                  </View>
                </View>
                <Text> {item.text} </Text>
                <Button
                  title="View Post"
                  onPress={() => {
                    navigation.navigate('Single Post', {
                      userId: id,
                      postId: item.post_id,
                    });
                  }}
                />
              </View>
            );
          }}

        />
        <Button
          title="getPosts"
          onPress={() => {
            getPosts();
          }}
        />
        <Button
          title="makePost"
          onPress={() => {
            navigation.navigate('New Post');
          }}
        />

        <Button
          title="logout"
          onPress={() => {
            validateSignOut();
          }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
