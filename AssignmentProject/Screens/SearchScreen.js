import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const [token, setToken] = useState('');
  const [users, setUsers] = useState([]);
  const [searchField, setSearchField] = useState('');

  const getData = async () => {
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

  const getUsers = () => {
    const serachIn = 'all';
    const limit = 10;
    const offset = 0;
    return fetch('http://localhost:3333/api/1.0.0/search?q=' + searchField + '&search-in=' + serachIn + "&limit=" + limit, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null) {
          setUsers(responseJson);
        } else {
          console.log('Error signing in');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const addFriend = (friendUserId) => {
    return fetch('http://localhost:3333/api/1.0.0/user/' + friendUserId +'/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
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
    getData();
  });

  return (
    <View>
      <Text>Search Screen</Text>
      <TextInput placeholder="Search..." onChangeText={(text) => setSearchField(text)} />
      <Button
        title="Search"
        onPress={() => {
          getUsers();
        }}
      />
      <Text>Results</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Text>
                {item.user_givenname}
                {item.user_familyname}
              </Text>
              <Button
                title="Add"
                onPress={() => {
                  addFriend(item.user_id);
                // Change text of button to pending
                }
              }
              />
            </View>
          );
        }}
      />
      <View style={{ flexDirection: 'row' }} />
    </View>
  );
};

export default SearchScreen;
