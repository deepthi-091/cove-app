import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';

import {
  Splash,
  Login,
  Home,
  ProductDetail,
  Profile,
  AddReview,
  ReportDamage,
} from '../screens';
import { COLORS, SIZES } from '../constants';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="HomeScreen" component={Home} />
    <Stack.Screen name="ProductDetail" component={ProductDetail} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="ProfileScreen" component={Profile} />
    <Stack.Screen name="ReportDamage" component={ReportDamage} />
    <Stack.Screen name="AddReview" component={AddReview} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.lightText,
      tabBarStyle: {
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        paddingBottom: 8,
        paddingTop: 8,
        height: 70,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarLabel: 'Shop',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>,
      }}
    />
    <Tab.Screen
      name="Search"
      component={Home}
      options={{
        tabBarLabel: 'Search',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🔍</Text>,
      }}
    />
    <Tab.Screen
      name="Wishlist"
      component={Home}
      options={{
        tabBarLabel: 'Wishlist',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>❤️</Text>,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👤</Text>,
      }}
    />
  </Tab.Navigator>
);

export const RootNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  </NavigationContainer>
);
