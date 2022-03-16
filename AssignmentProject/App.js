// import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './Screens/LoginScreen';
import CreateAccountScreen from './Screens/CreateAccountScreen';
import SettingsScreen from './Screens/SettingsScreen';
import SearchScreen from './Screens/SearchScreen';
import HomeScreen from './Screens/HomeScreen';
import NotificationsScreen from './Screens/NotificationsScreen';
import AuthContext from './AuthContext';
import ViewFriendsScreen from './Screens/ViewFriendsScreen';
import ProfileScreen from './Screens/ProfileScreen';
import NewPostScreen from './Screens/NewPostScreen';
import SinglePostScreen from './Screens/SinglePostScreen';
import PhotoScreen from './Screens/PhotoScreen';
import UpdatePostScreen from './Screens/UpdatePostScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// using Hooks rather than classes was a pretty poor decision by my part. Should of
// listened to everyone else XD

function HomePages( { navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        // signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password)
        // to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or
        // any other encrypted storage
        // In the example, we'll use a dummy token
        console.log('We signed in successflly we should be on the homepage rn');
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      // signUp: async (data) => {
      signUp: async () => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or
        // any other encrypted storage
        // In the example, we'll use a dummy token
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <Stack.Navigator initialRouteName="Login">
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            </>
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="homepages">
            <>
              <Stack.Screen name="homepages" component={HomePages} options={{ headerShown: false }}/>
              <Stack.Screen name="viewFriendsScreen" component={ViewFriendsScreen} />
              <Stack.Screen name="profileScreen" component={ProfileScreen} />
              <Stack.Screen name="New Post" component={NewPostScreen} />
              <Stack.Screen name="Single Post" component={SinglePostScreen} />
              <Stack.Screen name="PhotoScreen" component={PhotoScreen} />
              <Stack.Screen name="Update Post" component={UpdatePostScreen} />

            </>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
