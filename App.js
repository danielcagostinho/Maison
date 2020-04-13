import React from 'react';

import { StyleSheet, Text, View, ScrollView} from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from '@use-expo/font';

import GridList from './components/GridList/GridList';
import HomePageHeader from './components/HomePageHeader/HomePageHeader';
import BottomNav from './components/UI/BottomNav/BottomNav'
import PurpleButton from './components/UI/Buttons/PurpleButton/PurpleButton';
import SignInButton from './components/UI/Buttons/SignInButton/SignInButton';

export default app => {
  let [fontsLoaded] = useFonts({
    'Product-Sans': require('./assets/fonts/Product-Sans-Regular.ttf'),
    'Product-Sans-Bold': require('./assets/fonts/Product-Sans-Bold.ttf'),
  });

  let housemates = [
    {
      key: '1',
      name: 'Jack H.',
      status: 'is owed',
      amount: '22.54',
      imgUrl: 'https://drive.google.com/open?id=16OT56mlZJf00Zc4ICzu6KVAY5JBsbbRj'
    },
    {
      key: '2',
      name: 'Billie E.',
      status: 'owes you',
      amount: '131.33',
      img: 'adobe-people-54'
    },
    {
      key: '3',
      name: 'Auden K.',
      status: 'owes you',
      amount: '36.56',
      img: 'adobe-people-04'
    },
    {
      key: '4',
      name: 'Bernard J.',
      status: 'owes you',
      amount: '54.35',
      img: 'adobe-people-66'
    },
    {
      key: '5',
      name: 'Tarek Y.',
      status: 'we good',
      amount: 'Settled Up',
      img: 'adobe-people-66'
    },
    {
      key: '6',
      name: 'Daniel A.',
      status: 'we good',
      amount: 'Settled Up',
      img: 'adobe-people-66'
    },
  ];


  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <View style={styles.app}>
        <HomePageHeader/>
        <View style={styles.gridHeadingContainer}>
                <Text style={styles.gridHeading}>Housemates</Text>
        </View>
        <ScrollView>
          <GridList style={styles.gridList} items={housemates}/>
        </ScrollView>
        <BottomNav/>
        {/* <PurpleButton text="Continue"/>
        <PurpleButton text="Split With ( 2 )"/>
        <PurpleButton text="OK"/>
        <SignInButton buttonType="apple"/>
        <SignInButton buttonType="facebook"/>
        <SignInButton buttonType="google"/>
        <SignInButton buttonType="email"/> */}
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