import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import colors from '../constants/colors';
import StyledText from "./StyledText";

let appleLogo = require('../../assets/imgs/button-icons/apple.png')
let facebookLogo = require('../../assets/imgs/button-icons/facebook.png')
let googleLogo = require('../../assets/imgs/button-icons/google.png')

const StyledButton = ({ buttonAction, title, variant, size }) => {
  let buttonStyle;
  let buttonTextStyle;
  switch(variant){
    case 'light':
      buttonStyle = styles.lightVariant;
      buttonTextStyle = styles.lightVariantText;
      break;
    case 'dark':
      buttonStyle = styles.darkVariant
      buttonTextStyle = styles.darkVariantText
      break;
    case 'apple':
      buttonStyle = styles.appleVariant
      buttonTextStyle = styles.appleVariantText
      break;
    case 'fb':
      buttonStyle = styles.fbVariant
      buttonTextStyle = styles.fbVariantText
      break;
    case 'google':
      buttonStyle = styles.googleVariant
      buttonTextStyle = styles.googleVariantText
      break;
    case 'email':
      buttonStyle = styles.emailVariant
      buttonTextStyle = styles.emailVariantText
      break;
  }

  return (
    <TouchableOpacity onPress={buttonAction}>
      <View
        style={[
          styles.button,
          size == "lg" ? styles.lg : styles.md,
          buttonStyle,
        ]}
      >
        {/* <Image source={appleLogo} style={{width: 18, height: 24}} /> */}
        <StyledText
          style={[
            styles.text,
            buttonTextStyle
          ]}
        >
          {title}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  lg: {
    height: 50,
  },
  md: {
    height: 40,
  },
  button: {
    alignSelf: "center",
    width: "100%",
    color: "white",
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  text: {
    fontFamily: "ProductSansBold",
    letterSpacing: -0.41,
    fontSize: 17,
  },
  lightVariant: {
    backgroundColor: "#DFD8F1",
  },
  lightVariantText: {
    color: colors.PRIMARY,
  },
  darkVariant: {
    backgroundColor: colors.PRIMARY,
  },
  darkVariantText: {
    color: "#FFF",
  },
  appleVariant:{
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  appleVariantText:{
    color: "black",
  },
  fbVariant:{
    backgroundColor: colors.FB,
  },
  fbVariantText:{
    color: 'white',
  },
  googleVariant:{
    backgroundColor: colors.GOOGLE,
  },
  googleVariantText:{
    color: 'white',
  },
  emailVariant:{
    backgroundColor: 'white',
    borderTopColor: '#EFEBF8',
    borderTopWidth: 1
  },
  emailVariantText:{
    color: colors.PRIMARY,
  },
});

export default StyledButton;
