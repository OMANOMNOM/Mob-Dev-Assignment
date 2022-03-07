import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestIPAddress from '../TestIPAddress';

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
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/friendrequests', {
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
  const acceptRequest = (userId) => {
    return fetch(TestIPAddress.createAddress() +'/api/1.0.0/friendrequests/' + userId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('We have successfully accepted the request');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const rejectRequest = (userId) => {
    return fetch(TestIPAddress.createAddress() +'/api/1.0.0/friendrequests/' + userId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log('We have successfully accepted the request');
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
            <View style={{ flexDirection: 'row' }}>
              <Text>
                {item.first_name}
                {item.last_name}
              </Text>
              <Button
                title="Accept"
                value={item.user_id}
                onPress={() => {
                  // Change text of button to pending
                  acceptRequest(item.user_id);
                }}
              />
              <Button
                title="Reject"
                value={item.user_id}
                onPress={() => {
                  // Change text of button to pending
                  rejectRequest(item.user_id);
                }}
              />
            </View>
          );
        }}
      />
      <Button
        title="update"
        onPress={()=> {
          getRequests();
        }}
      />
    </View>
  );
};

export default NotificationsScreen;
