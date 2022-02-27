import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logout = async (key, value) => {
  console.log('logout button pressed');
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};
const HomeScreen = () => {
  return (
    <View>
      <Text>Home Screen</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title="Search" />
        <Button title="Home" />
        <Button title="Notifications" />
        <Button title="logout" onPress={() => { logout('id', null); }} />
      </View>
    </View>
  );
};

export default HomeScreen;
