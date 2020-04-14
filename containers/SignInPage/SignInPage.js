import React from 'react';
import SignInButton from './../../components/UI/Buttons/SignInButton/SignInButton';
import { StyleSheet, Text, View, Image} from 'react-native';
import { useFonts } from '@use-expo/font';

const signInPage = () => {
    let [fontsLoaded] = useFonts({
        'Product-Sans': require('./../../assets/fonts/Product-Sans-Regular.ttf'),
        'Product-Sans-Bold': require('./../../assets/fonts/Product-Sans-Bold.ttf'),
      });
    return ( 
        <View style={styles.signInPage}>
          <View style={styles.top}>
            <View>
              <Text style={styles.appTitle}>Maison</Text>
              <View style={styles.headingContainer}>
                <Text style={styles.signInHeading}>Housemate Sharing Made Easier</Text>
              </View>
            </View>
            <View style={styles.signInImageContainer}>
              <Image style={styles.signInImage} source={require('./../../assets/imgs/signin.png')}/>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <SignInButton buttonType="apple"/>
            <SignInButton buttonType="facebook"/>
            <SignInButton buttonType="google"/>
            <SignInButton buttonType="email"/>
          </View>
        </View>
     );
}
 
export default signInPage;

const styles = StyleSheet.create({
    signInPage : {
      flexDirection : 'column',
      justifyContent: 'space-between',
      height: '100%',
      backgroundColor: '#F8F5FB',
      alignItems: 'center'
    },
    buttonContainer: {
      backgroundColor: 'white',
      alignSelf: 'flex-end',
      width: '100%',
      justifyContent: 'space-around',
      height: 295,
      padding: 0,
      paddingTop: 10,
      justifyContent: 'flex-start',
    },
    signInHeading : {
      fontSize: 30,
      fontFamily: 'Product-Sans-Bold',
      lineHeight: 34,
      letterSpacing: 0.16,
      color: '#4900A7',
      textAlign: 'center',
    },
    headingContainer : {
      marginHorizontal: 16,
    },
    appTitle : {
      marginTop: 68,
      textTransform: 'uppercase',
      fontSize: 13,
      fontFamily: 'Product-Sans-Bold',
      color: '#7E7D80',
      lineHeight: 34,
      letterSpacing: 0.16,
      textAlign: 'center',
      marginBottom: 8
    },
    signInImageContainer : {
      height: '100%',
      overflow: 'hidden',
      width: 375,
    },
    signInImage : {
      resizeMode: 'center',
      height: 500,
      width: '100%'
    },
    top : {
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 500,
    }
  });