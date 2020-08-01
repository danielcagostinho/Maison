import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native'; 
import StyledText from './StyledText';

const StyledButton = ({buttonAction, title}) => {
  return ( 
    <TouchableOpacity
      onPress={buttonAction}
    >
      <View style={styles.button}>
        <StyledText style={styles.text}>{title}</StyledText>
      </View>
    </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    width: '90%',
    height: 40,
    backgroundColor: '#DFD8F1',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  text: {
    color: '#4900A7',
    fontFamily: 'ProductSansBold',
    letterSpacing: -0.41,
    fontSize: 17
  }
});
 
export default StyledButton;