import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import { AppLoading } from 'expo';
import { useFonts } from '@use-expo/font';

  
const housemateCard = (props) => {
    let [fontsLoaded] = useFonts({
        'Product-Sans': require('../../assets/fonts/Product-Sans-Regular.ttf'),
        'Product-Sans-Bold': require('../../assets/fonts/Product-Sans-Bold.ttf'),
      });
    let amountStyle = null;
    switch(props.status){
      case 'is owed':
        amountStyle = styles.oweThem;
        break;
      case 'owes you':
        amountStyle = styles.owesYou;
        break;
      case 'we good':
        amountStyle = styles.settledUp;
        break;
    }



    let imgUrl = null;
    switch(props.name) {
      case 'Jack H.': 
        imgUrl = require('../../assets/imgs/profile-pics/adobe-people-18.png');
        break;
      case 'Billie E.':
        imgUrl = require('../../assets/imgs/profile-pics/adobe-people-02.png');
        break;
      case 'Auden K.':
        imgUrl = require('../../assets/imgs/profile-pics/adobe-people-05.png');
        break;
      case 'Bernard J.':
        imgUrl = require('../../assets/imgs/profile-pics/adobe-people-19.png');
        break;
      case 'Tarek Y.':
        imgUrl = require('../../assets/imgs/profile-pics/adobe-people-21.png');
        break;
      case 'Daniel A.':
        imgUrl = require('../../assets/imgs/profile-pics/adobe-people-45.png');
        break;
    }

    return ( 
        <View style={styles.housemateCard}>
          <Image style={styles.housemateCardIcon} source={imgUrl}></Image>
            <Text style={styles.housemateName}>{props.name}</Text>
            <Text style={styles.housemateStatus}>{props.status}</Text>
            <Text style={[styles.housemateAmount, amountStyle]}>{(props.status === 'we good') ? "" : "$"}{props.amount}</Text>
        </View>
     );
}
 
export default housemateCard;

const styles = StyleSheet.create({
    housemateCard : {
      borderRadius: 16,
      borderColor: 'rgba(0,0,0,0.08)',
      borderWidth: 1,
      fontFamily: 'Product-Sans',
      marginHorizontal: 8,
      marginBottom: 16,
      width: '46%',
      height: 176,
      backgroundColor: '#fff',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    housemateCardIcon : {
      width: 60,
      height: 60,
      borderRadius: 50,
      marginTop: 16,
      marginBottom: 8
    },
    housemateName: {
      margin: 0,
      padding: 0,
      color: 'black',
      fontSize: 15,    
      letterSpacing: -0.41,
      lineHeight: 17,
    },
    housemateStatus: {
      margin: 0,
      marginBottom: 20,
      padding: 0,
      fontSize: 15,  
      color: 'rgba(0,0,0,0.5)', 
      letterSpacing: -0.41,
      lineHeight: 17,
    },
    housemateAmount : {
      fontFamily: 'Product-Sans-Bold',
      fontSize: 17,
      marginBottom: 16
    },
    owesYou: {
      color: '#00A469',
    },
    oweThem : {
      color: '#DC0344',
    },
    settledUp :{
      color: 'rgba(0,0,0,0.5)',
    }
});
