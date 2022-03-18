import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import TestIPAddress from '../Utility/TestIPAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card} from 'react-native-elements';

const ViewFriendsScreen = ({ route, navigation }) => {
  const [token, setToken] = useState('');
  const [id, setID] = useState('');
  const [friends, setFriends] = useState([]);
  let user_id = null;

  const getDataToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        setToken(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  const getDataID = async () => {
    try {
      const value = await AsyncStorage.getItem('id');
      if (value !== null) {
        setID(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  const getFriends = () => {
    return fetch(TestIPAddress.createAddress() + '/api/1.0.0/user/'+ id + '/friends', {
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
    if (route.params != null) {
      user_id = route.params;
      if (user_id != null) {
        setID(user_id.userId);
        getDataToken();
        console.log(user_id);
      }
    } else {
      getDataToken();
      getDataID();
    }
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
            <Card>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ height: 50, width: 50, backgroundColor: "aliceblue", }}/>
                <View>
                  <Text>
                    {item.user_givenname + '    ' + item.user_familyname}
                  </Text>
                </View>
              </View>
            </Card>
          );
        }}
      />
      <View style={{ flexDirection: 'row' }} />
    </View>
  );
};

export default ViewFriendsScreen;
