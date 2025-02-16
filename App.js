import React, { useEffect, useState, useContext, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';
import { Provider as AuthProvider, Context as AuthContext } from './src/context/AuthContext';
import * as Font from 'expo-font';

// Import screens
import LoginScreen from './src/login/LoginScreen';
import RegisterScreen from './src/login/RegisterScreen';
import HomeScreen from './src/screen/HomeScreen';
import AddPhoto from './src/screen/AddPhotoScreen';
import ProfileScreen from './src/screen/ProfilScreen';

// Import theme
import { darkTheme, darkStyles, navigationTheme } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const lastTabPress = useRef({ time: 0, tabName: '' });

  const handleTabPress = (tabName, navigation, route) => {
    const currentTime = new Date().getTime();
    const { time: lastTime, tabName: lastTab } = lastTabPress.current;

    lastTabPress.current = {
      time: currentTime,
      tabName,
    };

    if (
      tabName === 'Home' &&
      lastTab === 'Home' &&
      currentTime - lastTime < 300
    ) {
      const refreshData = route?.params?.refreshData;
      if (refreshData) {
        refreshData();
      }
      return;
    }

    if (!navigation.isFocused()) {
      navigation.navigate(tabName);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#03DAC6',
        tabBarInactiveTintColor: darkTheme.text.muted,
        tabBarStyle: {
          backgroundColor: '#1A1B1E',
          borderTopColor: darkTheme.border,
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: '#03DAC6',
          borderBottomWidth: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: 'Dancing-Script',
          fontSize: 30,
          fontWeight: '900',
          color: '#FFFFFF',
        },
        headerTitleAlign: 'center',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'PhotoGram',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress('Home', navigation, route);
          },
        })}
      />
      <Tab.Screen
        name="Add Photo"
        component={AddPhoto}
        options={{
          headerTitle: 'PhotoGram',
          tabBarLabel: 'Add Photo',
          tabBarButton: (props) => (
            <View style={{ 
              height: 60, 
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 15,
            }}>
              <TouchableOpacity
                {...props}
                style={{
                  top: -20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#03DAC6',
                  height: 50,
                  width: 50,
                  borderRadius: 35,
                  elevation: 5,
                }}
              >
                <MaterialIcons name="add" size={40} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={{ 
                color: '#03DAC6',
                fontSize: 12,
                marginTop: 15,
                textAlign: 'center',
                position: 'absolute',
                bottom: 5,
                width: '100%',
              }}>
                Add Photo
              </Text>
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress('Add Photo', navigation);
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'PhotoGram',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            handleTabPress('Profile', navigation);
          },
        })}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { state } = useContext(AuthContext);

  return (
    <Stack.Navigator
      initialRouteName={state.token ? 'MainApp' : 'Login'}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: darkTheme.background }
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainApp" component={TabNavigator} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Dancing-Script': require('./assets/fonts/DancingScript-Regular.ttf'),
        });
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    loadFonts();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}