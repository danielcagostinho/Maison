import React from 'react';

import { StyleSheet, Text, View, Image} from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from '@use-expo/font';

import HomePage from './containers/HomePage/HomePage';
import SignInPage from './containers/SignInPage/SignInPage';

export default app => {
  let [fontsLoaded] = useFonts({
    'Product-Sans': require('./assets/fonts/Product-Sans-Regular.ttf'),
    'Product-Sans-Bold': require('./assets/fonts/Product-Sans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.app}>
        <SignInPage/>
        {/* <HomePage/> */}
      </View>
    );
  }
}

const styles = StyleSheet.create( {
  app : {
  },
});