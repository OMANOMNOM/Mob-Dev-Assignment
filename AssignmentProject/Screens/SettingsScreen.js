import React from 'react';
import { View, TextInput } from 'react-native';
import { Card, Button } from 'react-native-elements';
 
const SettingsScreen = () => {
  return (
    <View>
      <Card>
        <TextInput placeholder='FirstName'/>
        <TextInput placeholder='SurName'/>
        <TextInput placeholder='Email'/>
        <TextInput placeholder='Change password'/>

        <Button title="Save Changes" />
      </Card>
    </View>
  );
};

export default SettingsScreen;
