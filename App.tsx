import 'reflect-metadata';
import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { container, Provider } from './ioc';
import { BrewService } from './services';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

const brewService = container.get<BrewService>('BrewService');

function handleAppStateChange(state: AppStateStatus) {
  if (['background', 'inactive'].includes(state)) {
    brewService.saveBrews();
  }
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider container={container}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
