import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import TestIPAddress from '../TestIPAddress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({route, navigation}) => {
  const [token, setToken] = useState('');
  const { user_id } = route.params;

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
        </View>
      </View>
      <View>
        <Text>Post</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
