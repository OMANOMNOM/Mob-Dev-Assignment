import { StatusBar } from 'expo-status-bar';
import * as  React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './Screens/LoginScreen'
import CreateAccountScreen from './Screens/CreateAccountScreen';
import SettingsScreen from './Screens/SettingsScreen';
import SearchScreen from './Screens/SearchScreen';
import HomeScreen from './Screens/HomeScreen'
import NotificationsScreen from './Screens/NotificationsScreen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();
let isloggedIn = true;

export default function App() {
  
  return (
    <NavigationContainer>
      
      {/*
      <Stack.Navigator initialRouteName="Login">
      {isloggedIn == false ? (
        <> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        </>
      ) : (
        <Stack.Screen name="Home" component={HomeScreen}/>
      )}
      </Stack.Navigator> 
        */}
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />

      </Tab.Navigator>
      
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
