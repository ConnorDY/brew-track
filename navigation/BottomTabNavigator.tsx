import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import BrewScreen from '../screens/BrewScreen';
import BrewsScreen from '../screens/BrewsScreen';
import IngredientsScreen from '../screens/IngredientsScreen';
import {
  BottomTabParamList,
  BrewsParamList,
  IngredientsParamList,
} from '../types/screens';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Brews"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Brews"
        component={BrewsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="beer-outline" color={color} />
          ),
        }}
      />

      <BottomTab.Screen
        name="Ingredients"
        component={IngredientsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const BrewsStack = createStackNavigator<BrewsParamList>();

function BrewsNavigator() {
  return (
    <BrewsStack.Navigator>
      <BrewsStack.Screen
        name="BrewsScreen"
        component={BrewsScreen}
        options={{ headerTitle: 'Brews' }}
      />
      <BrewsStack.Screen
        name="BrewScreen"
        component={BrewScreen}
        options={({ route }) => ({
          headerTitle: route.params.brew.name,
        })}
      />
    </BrewsStack.Navigator>
  );
}

const IngredientsStack = createStackNavigator<IngredientsParamList>();

function IngredientsNavigator() {
  return (
    <IngredientsStack.Navigator>
      <IngredientsStack.Screen
        name="IngredientsScreen"
        component={IngredientsScreen}
        options={{ headerTitle: 'Ingredients' }}
      />
    </IngredientsStack.Navigator>
  );
}
