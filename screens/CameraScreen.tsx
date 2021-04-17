import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { RouteProp, useFocusEffect } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Container, Text, View } from 'native-base';
import { v4 as uuid } from 'uuid';

import { BrewsParamList } from '../types/screens';

type Screen = 'CameraScreen';

type CameraScreenProps = {
  navigation: StackNavigationProp<BrewsParamList, Screen>;
  route: RouteProp<BrewsParamList, Screen>;
};

const CameraScreen: FunctionComponent<CameraScreenProps> = ({
  navigation,
  route,
}) => {
  // destructure route param(s)
  const { addPhoto } = route.params;

  // camera ref
  const camera = useRef<Camera>(null);

  // declare state variables
  const [focused, setFocused] = useState(true);
  const [ready, setReady] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // on load check camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // activate & deactive camera when screen is focused & blurred
  useFocusEffect(
    useCallback(() => {
      // on gain focus
      setFocused(true);

      // on lose focus
      return () => {
        setReady(false);
        setFocused(false);
      };
    }, [])
  );

  async function takePhoto() {
    const photo = await camera.current?.takePictureAsync();

    if (photo) {
      const { uri } = photo;
      const photoId = uuid();

      await FileSystem.moveAsync({
        from: uri,
        to: `${FileSystem.documentDirectory}${photoId}`,
      });

      addPhoto(photoId);

      navigation.goBack();
    }
  }

  return focused && hasPermission ? (
    <Container style={styles.container}>
      <View style={{ width: '100%' }}>
        <Camera
          type={Camera.Constants.Type.back}
          ratio="1:1"
          onCameraReady={() => setReady(true)}
          ref={camera}
          style={[styles.camera]}
        />

        <View style={styles.buttonContainer}>
          <Button
            primary
            rounded
            onPress={takePhoto}
            disabled={!ready}
            style={styles.button}
          >
            <Text>Take Photo</Text>
          </Button>
        </View>
      </View>
    </Container>
  ) : (
    <Text>No access to camera</Text>
  );
};

export default CameraScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    height: width,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
  },
});
