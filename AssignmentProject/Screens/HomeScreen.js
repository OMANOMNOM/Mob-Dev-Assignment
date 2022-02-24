import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = () => {
  return (
    <View>
      <Text>Home Screen</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title="Search" />
        <Button title="Home" />
        <Button title="Notifications" />
      </View>
    </View>
  );
};

export default HomeScreen;
