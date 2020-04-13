import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import { useFonts } from '@use-expo/font';

const bottomNav = () => {
    let [fontsLoaded] = useFonts({
        'Product-Sans': require('../../../assets/fonts/Product-Sans-Regular.ttf'),
        'Product-Sans-Bold': require('../../../assets/fonts/Product-Sans-Bold.ttf'),
      });
    return ( 
        <View style={styles.bottomNav}>
          <View style={styles.navTab}>
            <Image style={styles.navIcon} source={require('../../../assets/imgs/nav/home-nav.png')}/>
            <Text style={[styles.navText, styles.activeText]}>Home</Text>
          </View>
          <View style={styles.navTab}>
            <Image style={styles.navIcon} source={require('../../../assets/imgs/nav/my-bills-nav.png')}/>
            <Text style={[styles.navText, styles.disabledText]}>My Bills</Text>
          </View>
          <View style={styles.navTab}>
            <Image style={styles.navIcon} source={require('../../../assets/imgs/nav/activity-nav.png')}/>
            <Text style={[styles.navText, styles.disabledText]}>Activity</Text>
          </View>
          <View style={styles.navTab}>
            <Image style={styles.navIcon} source={require('../../../assets/imgs/nav/recurring-nav.png')}/>
            <Text style={[styles.navText, styles.disabledText]}>Recurring</Text>
          </View>
          <View style={styles.navTab}>
            <Image style={styles.navIcon} source={require('../../../assets/imgs/nav/profile-nav.png')}/>
            <Text style={[styles.navText, styles.disabledText]}>Profile</Text>
          </View>
        </View>
     );
}
 
export default bottomNav;

const styles = StyleSheet.create({
    bottomNav : {
        height: 60,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'rgb(246,246,248)'
    },
    navTab : {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    navIcon : {
        height: 30,
        width: 30
    },
    navText : {
        fontSize: 10,
        fontFamily: 'Product-Sans',
        letterSpacing: 0.16
    },
    activeText : {
        color: '#4900A7'
    },
    disabledText : {
        color: '#9D8CCB'
    },
});
