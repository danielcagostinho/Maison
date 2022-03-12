import React from "react";

import { withNavigation } from 'react-navigation';

import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import StyledText from "../components/StyledText";
import StyledButton from "../components/StyledButton";
import colors from "../constants/colors";

let illustration = require("../../assets/imgs/signin.png");
const deviceWidth = Dimensions.get("window").width;

const SigninScreen = ({navigation}) => {
  return (
    <View style={styles.backdrop}>
      <View style={styles.textContainer}>
        <StyledText style={styles.title}>Maison</StyledText>
        <StyledText style={styles.description}>
          Housemate Sharing Made Easier
        </StyledText>
      </View>
      <View
        style={{ alignItems: "center" }}
      >
        <Image
          style={{
            width: 0.95 * deviceWidth,
            height: 0.95 * deviceWidth * (271 / 345),
          }}
          source={illustration}
        />
      </View>
      <View style={styles.buttonContainer}>
        <View style={{ margin: 6 }}>
          <StyledButton buttonAction={() => navigation.navigate('UserHome')} size="lg" variant="apple" title="Sign in with Apple" />
        </View>
        <View style={{ margin: 6 }}>
          <StyledButton buttonAction={() => navigation.navigate('UserHome')} size="lg" variant="fb" title="Continue with Facebook" />
        </View>
        <View style={{ margin: 6 }}>
          <StyledButton buttonAction={() => navigation.navigate('UserHome')} size="lg" variant="google" title="SIgn in with Google" />
        </View>
        <View style={{ margin: 6 }}>
          <StyledButton buttonAction={() => navigation.navigate('UserHome')} size="lg" variant="email" title="Sign in with email" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "#F8F5FB",
    flexDirection: "column",
    justifyContent: 'flex-end',
    flex:1
  },
  title: {
    fontSize: 13,
    color: "#7E7D80",
    fontFamily: "ProductSansBold",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 0.16,
    marginVertical: 8,
    lineHeight: 34,
  },
  textContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 44,
  },
  description: {
    color: colors.PRIMARY,
    fontSize: 30,
    fontFamily: "ProductSansBold",
    textAlign: "center",
    letterSpacing: 0.16,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
});

export default withNavigation(SigninScreen);
