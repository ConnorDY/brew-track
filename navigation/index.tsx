import React from 'react';
import { ColorSchemeName } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleProvider } from 'native-base';

import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types/screens';
import getTheme from '../native-base-theme/components';
import darkTheme from '../native-base-theme/themes/dark';
import lightTheme from '../native-base-theme/themes/light';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const darkColorScheme = colorScheme === 'dark';

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={darkColorScheme ? DarkTheme : DefaultTheme}
    >
      <StyleProvider
        style={getTheme((darkColorScheme ? darkTheme : lightTheme) as any)}
      >
        <RootNavigator />
      </StyleProvider>
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
    </Stack.Navigator>
  );
}
