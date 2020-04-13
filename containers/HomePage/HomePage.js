import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { useFonts } from '@use-expo/font';

import HomePageHeader from '../../components/HomePageHeader/HomePageHeader';
import GridList from '../../components/GridList/GridList';
import BottomNav from '../../components/UI/BottomNav/BottomNav'

const homePage = () => {
    let [fontsLoaded] = useFonts({
        'Product-Sans': require('./../../assets/fonts/Product-Sans-Regular.ttf'),
        'Product-Sans-Bold': require('./../../assets/fonts/Product-Sans-Bold.ttf'),
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
    return ( 
        <View style={styles.homePage}>
            <HomePageHeader/>
            <View style={styles.gridHeadingContainer}>
                <Text style={styles.gridHeading}>Housemates</Text>
            </View>
            <ScrollView>
                <GridList style={styles.gridList} items={housemates}/>
            </ScrollView>
            <BottomNav/>
        </View>
     );
}
 
export default homePage;

const styles = StyleSheet.create( {
    homePage : {
        fontFamily: 'Product-Sans',
        flexDirection : 'column',
        justifyContent: 'space-between',
        height: '100%',
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