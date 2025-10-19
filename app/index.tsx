import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const user = await AsyncStorage.getItem('currentUser');
      
      if (token && user) {
        console.log('✅ User is authenticated, redirecting to tabs');
        setIsAuthenticated(true);
      } else {
        console.log('❌ User not authenticated, redirecting to welcome');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/auth/welcome'} />;
} 