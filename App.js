import React from 'react';

import { StyleSheet, Text, View, ScrollView} from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from '@use-expo/font';

import GridList from './components/GridList/GridList';
import HomePageHeader from './components/HomePageHeader/HomePageHeader';
import BottomNav from './components/UI/BottomNav/BottomNav'
import HomePage from './containers/HomePage/HomePage';
import PurpleButton from './components/UI/Buttons/PurpleButton/PurpleButton';
import SignInButton from './components/UI/Buttons/SignInButton/SignInButton';

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
        <HomePage/>
      </View>
    );
  }
}


const styles = StyleSheet.create( {
  app : {
    fontFamily: 'Product-Sans',
    flexDirection : 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  gridList : {
  },
  gridHeading : {
    fontFamily: 'Product-Sans-Bold',
    fontSize: 17
  },
  gridHeadingContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    width: '100%',
  },
});