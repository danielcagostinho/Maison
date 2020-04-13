import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';

import { useFonts } from '@use-expo/font';

const homePageHeader = (props) => {

    let [fontsLoaded] = useFonts({
        'Product-Sans': require('../../assets/fonts/Product-Sans-Regular.ttf'),
        'Product-Sans-Bold': require('../../assets/fonts/Product-Sans-Bold.ttf'),
      });

    return ( 
        <View style={styles.headerContainer}>
            <View style={styles.topRow}>
                <View style={styles.leftPanel}>
                    <Image source={require('../../assets/imgs/profile-pics/adobe-people-59.png')} style={styles.userDisplayPicture}></Image>
                    <Text style={styles.houseName}>Oxley St.</Text>
                </View>
                <View style={styles.rightPanel}>
                <Image style={styles.newBillImage} source={require('../../assets/imgs/newbill.png')}></Image>
                </View>
            </View>
            <View style={styles.bottomRow}>
                <View style={styles.bottomTextContainer}>
                    <Text style={styles.owedText}>You're owed {"\n"}$145.35</Text>
                    <Text style={styles.bottomText}>Now all you gotta do is wait...</Text>
                </View>
                <View style={styles.homePageImageContainer}>               
                    <Image style={styles.homePageImage} source={require('../../assets/imgs/homepage.png')}></Image>
                </View>
            </View>
            
        </View>
     );
}
 
export default homePageHeader;

const styles = StyleSheet.create({
    headerContainer : {
        backgroundColor: '#4900A7',
        height: 254,
    },
    houseName: {
        color: 'rgba(255,255,255, 0.8)',
        fontFamily: 'Product-Sans-Bold',
        fontSize: 30,
        marginLeft: 12
    },
    userDisplayPicture: {
        backgroundColor: 'white',
        height: 40,
        width: 40,
        borderRadius: 50
    },
    leftPanel : {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    topRow : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '40%',
        paddingLeft: 16,
        paddingRight: 24
    },
    bottomRow : {
        height: '60%',
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 16,
        width: '60%',
    },
    newBillButton : {
        width: 30
    },
    owedText : {
        fontFamily: 'Product-Sans-Bold',
        fontSize: 24,
        color: 'white'
    },
    bottomTextContainer : {
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        paddingBottom: 16,
    },
    bottomText: {
        fontFamily: 'Product-Sans',
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)'
    },
    homePageImageContainer : {
        height: '100%',
        overflow: 'hidden',
        width: 200
    },
    homePageImage : {
        resizeMode: 'center',
        height: 180,
        width: '100%'
    },
    newBillImage : {
        width: 24,
        height: 30
    }

});