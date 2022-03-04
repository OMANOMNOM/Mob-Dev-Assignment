import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsScreen = () => {
  const [token, setToken] = useState('');
  const [requests, setRequests] = useState([]);
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
  const getRequests = () => {
    return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null) {
          setRequests(responseJson)
        } else {
          console.log('Error or no friend requests');
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
      <Text>Notifications Screen</Text>
      <FlatList
        data={requests}
        renderItem={({ item }) => {
          return (
            <View>
              <Text>
                {item.first_name}
                {item.last_name}
              </Text>
              <Button
                title="Accept"
                onPress={() => {
                // Change text of button to pending
                }
              }
              />
            </View>
          );
        }}
      />
      <Button title="update" onPress={()=> {
        getRequests()
      }}></Button>
    </View>
  );
};

export default NotificationsScreen;
