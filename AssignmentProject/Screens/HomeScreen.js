import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-elements';
import AuthContext from '../AuthContext';
import TestIPAddress from '../TestIPAddress';

const HomeScreen = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [id, setID] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [isLoadeding, setIsLoadeding] = useState(false);
  const { signOut } = React.useContext(AuthContext);
  const [posts, setPosts] = useState(null);

  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        setToken(value);
        return value; // return here becasue of the sync of bug
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
        return value; // return here becasue of the sync of bug
      }
    } catch (e) {
      // error reading value
    }
  };

  const validateSignOut = () => {
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

  const getPosts = (ptoken, pid) => {
    return fetch(`${TestIPAddress.createAddress()}/api/1.0.0/user/${pid}/post`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': ptoken,
      },
    },
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          throw 'unauthorised';
        } else if (response.status === 403) {
          throw 'Can only view the posts of yourself or your friends';
        } else if (response.status === 404) {
          throw 'Not found';
        } else if (response.status === 500) {
          throw 'server error';
        }
      })
      .then((responseJson) => {
        if (responseJson !== null) {
          setPosts(responseJson);
        } else {
          throw 'Unexpected Json returned';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!isSignedIn) {
    signOut({});
  }
  const updatePosts = async () => {
    try {
      const tempToken = await getToken();
      const tempId = await getID(); // I don't use states here becuase of a werid sync issue
      if (tempToken != null && tempId != null) {
        getPosts(tempToken, tempId);
        setIsLoadeding(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // TOOD SHOULD ONLY BE CALLED ONCE
  useEffect(() => {
    if (posts === null && isLoadeding === false) {
      updatePosts();
      setIsLoadeding(true);
    }
  });

  return (
    <View>
      <Card>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'column' }}>
            <Text>Photo</Text>
            <Button title="Change profile picture" onPress={() => { navigation.navigate('PhotoScreen'); }} />
          </View>
          <View>
            <Text>User details</Text>
            <Text>User details</Text>
            <Button
              title="View friends"
              onPress={() => {
                // Go to friends screen
                navigation.navigate('viewFriendsScreen');
              }}
            />
          </View>
        </View>
      </Card>
      <View>
        <Text>Post</Text>
        <FlatList
          data={posts}
          renderItem={({ item }) => {
            return (
              <Card>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ height: 50, width: 50, backgroundColor: 'aliceblue' }} />
                    <View>
                      <Text>
                        {item.author.first_name + '    ' + item.author.last_name}
                        {item.timestamp}
                      </Text>
                    </View>
                  </View>
                  <Text>
                    {item.text}
                  </Text>
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
              </Card>
            );
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
