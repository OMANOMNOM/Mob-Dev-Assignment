import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import TestIPAddress from '../TestIPAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewFriendsScreen = ( props ) => {
  const [token, setToken] = useState('');
  const [id, setID] = useState('')
  const [friends, setFriends] = useState([]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      const value1 = await AsyncStorage.getItem('id');
      if (value !== null) {
        setToken(value);
      }
      if (value1 !== null) {
        setID(value1);
      }
    } catch (e) {
      // error reading value
    }
  };
  const getFriends = () => {
    if (props.id != null){
      setID(props.id)
    }
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/'+ '23' + '/friends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null) {
          setFriends(responseJson);
        } else {
          console.log('Error signing in');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    getData();
  });
  return (
    <View>
      <Button
        title="Search"
        onPress={() => {
          getFriends();
        }}
      />
      <Text>Results</Text>
      <FlatList
        data={friends}
        renderItem={({ item }) => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <View style={{ height: 50, width: 50, backgroundColor: "aliceblue", }}>
              </View>
              <View>
                <Text>
                  {item.user_givenname + '    ' + item.user_familyname}
                </Text>
                
              </View>
            </View>
          );
        }}
      />
      <View style={{ flexDirection: 'row' }} />
    </View>
  );
};

export default ViewFriendsScreen;
