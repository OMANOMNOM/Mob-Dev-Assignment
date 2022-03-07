import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestIPAddress from '../TestIPAddress';

const SearchScreen = ({ navigation }) => {
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
    const limit = 20;
    const offset = 0;
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/search?q=' + searchField + '&search-in=' + serachIn + "&limit=" + limit, {
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
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/' + friendUserId + '/friends', {
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
              <View style={{ height: 50, width: 50, backgroundColor: 'aliceblue' }} />
              <View>
                <Text>
                  {item.user_givenname + '    ' + item.user_familyname}
                </Text>
                <Button
                  title="View"
                  onPress={() => {
                    console.log(item.user_id);
                    navigation.navigate('profileScreen', {
                      user_id: item.user_id,
                    });
                  }}
                />
                <Button
                  title="Add"
                  onPress={() => {
                    addFriend(item.user_id);
                    // Change text of button to pending
                  }}
                />
              </View>
            </View>
          );
        }}
      />
      <View style={{ flexDirection: 'row' }} />
    </View>
  );
};

export default SearchScreen;
