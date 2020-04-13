import React from 'react';
import { useFonts } from '@use-expo/font';

import {View, Text, StyleSheet} from 'react-native';

const purpleButton = (props) => {
    let [fontsLoaded] = useFonts({
        'Product-Sans': require('../../../../assets/fonts/Product-Sans-Regular.ttf'),
        'Product-Sans-Bold': require('../../../../assets/fonts/Product-Sans-Bold.ttf'),
      });
    return ( 
        <View style={styles.purpleButton}>
            <Text style={styles.buttonText}>{props.text}</Text>
        </View>
     );
}
 
export default purpleButton;

const styles = StyleSheet.create({
    purpleButton : {
        backgroundColor: '#4900A7',
        borderRadius: 16,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 16
    },
    buttonText : {
        color: 'white',
        fontFamily: 'Product-Sans-Bold',
        lineHeight: 22,
        letterSpacing: -0.41,
        fontSize: 17,
    }
});