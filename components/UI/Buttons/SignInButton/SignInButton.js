import React from 'react';
import { useFonts } from '@use-expo/font';

import {View, Text, StyleSheet, Image} from 'react-native';



const signInButton = (props) => {
    let [fontsLoaded] = useFonts({
        'Product-Sans': require('../../../../assets/fonts/Product-Sans-Regular.ttf'),
        'Product-Sans-Bold': require('../../../../assets/fonts/Product-Sans-Bold.ttf'),
      });

      switch (props.buttonType) {
        case 'apple' :
            return (
                <View style={styles.appleButton}>
                    <Image style={styles.appleIcon} source={require('./../../../../assets/imgs/button-icons/apple.png')}/>
                    <Text style={styles.buttonText}>Sign in with Apple</Text>
                </View>
            );    
        case 'facebook' :
            return (
                <View style={styles.facebookButton}>
                    <Image style={styles.buttonIcon} source={require('./../../../../assets/imgs/button-icons/facebook.png')}/>
                    <Text style={[styles.buttonText, {color: 'white'}]}>Continue with Facebook</Text>
                </View>
            );
        case 'google' :
            return (
                <View style={styles.googleButton}>
                    <Image style={styles.buttonIcon} source={require('./../../../../assets/imgs/button-icons/google.png')}/>
                    <Text style={[styles.buttonText, {color: 'white'}]}>Sign in with Google</Text>
                </View>
            );
        case 'email' :
            return (
                <View style={styles.emailButton}>
                    <Text style={[styles.buttonText, {color: '#4900A7'}]}>Sign up with email</Text>
                </View>
            );
            
      }
}
 
export default signInButton;

const styles = StyleSheet.create({
    buttonIcon :{ 
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },
    appleIcon : {
        width: 18,
        height: 24,
        resizeMode: 'contain',
    },
    appleButton : {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
        marginHorizontal: 16,
        color: 'black',
    },
    facebookButton : {
        backgroundColor: '#3479EA',
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
        marginHorizontal: 16,
        color: 'white',
    },
    googleButton : {
        backgroundColor: '#4285F4',
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
        marginHorizontal: 16,
        color: 'white',
    },
    emailButton : {
        backgroundColor: 'white',
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
        marginHorizontal: 16,
        color: 'white',
    },
    buttonText : {
        fontFamily: 'Product-Sans-Bold',
        lineHeight: 22,
        letterSpacing: -0.41,
        fontSize: 17,
        width: '80%',
        textAlign: 'center'
    },
});