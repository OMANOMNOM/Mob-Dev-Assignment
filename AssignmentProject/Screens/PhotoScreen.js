import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TestIPAddress from '../TestIPAddress';

const PhotoScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isLoading, setIsLoading] = useState(null);
  const [token, setToken] = useState(null);
  const [id, setID] = useState(null);

  const camRef = useRef(null)
  const getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        setToken(value);
        return value; // return here becasue of the sync of bug
      }
    } catch (e) {
      // error reading value
    }
  };

  const getID = async () => {
    try {
      const value = await AsyncStorage.getItem('id');
      if (value !== null) {
        setID(value);
        return value; // return here becasue of the sync of bug
      }
    } catch (e) {
      // error reading value
    }
  };

  const postImage = async (data) => {
    // Get token
    let tid = null;
    let ttoken = null;
    if( token === null){
      ttoken = await getToken();
    }else{
      ttoken = token
    }
    if (id === null){
      tid = await getID();
    }else{
      tid = id;
    }
    console.log(tid);
    console.log(ttoken);
    // Get IF

    // img data converted from string to blob before sending 
    let res = await fetch(data.base64);
    let blob = await res.blob();
    return fetch(`${TestIPAddress.createAddress()}/api/1.0.0/user/${id}/photo`, {
      method: "POST",
      headers: {
        "Content-Type": "image/png",
        "X-Authorization": token
      },
      body: blob
    })
      .then((response) => {
        if(response.status === 200){
          console.log('It fucking worked');
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const takePhoto = async () => {
    if (camRef) {
      const imageOptions = {
        quality: 0.1,
        base64: true,
        onPictureSaved: (data) => postImage(data)
      };
      await camRef.current.takePictureAsync(imageOptions);
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={camRef
        }
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Flip"
          onPress={() => {
            setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back);
          }}
        />
        <Button
          title="Take Photo"
          onPress={() => {
            takePhoto();
          }}
        />
      </View>
    </View>
  );
}

export default PhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 2,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
