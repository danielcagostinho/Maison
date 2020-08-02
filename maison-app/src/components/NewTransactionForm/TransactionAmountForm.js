import React from "react";
import { Image, View, StyleSheet, TextInput } from "react-native";
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";

const TransactionAmountForm = () => {
  const illustration = require("../../../assets/imgs/newtransaction-illustration-3.png");

  return (
    <View>
      <View style={styles.backdrop}></View>
      <View style={styles.illustrationContainer}>
        <Image source={illustration} style={styles.illustration} />
      </View>
      <View style={{ zIndex: 3, backgroundColor: "#FFF" }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <StyledText style={styles.title}>How much was lunch?</StyledText>
          <TextInput
            style={{
              height: 64,
              marginVertical: 8,
              color: '#4900A7',
              fontFamily: 'ProductSansBold',
              fontSize: 58
            }}
          />
          <View style={{ marginVertical: 8 }}>
            <StyledButton size="lg" title="Continue" variant="dark" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontFamily: "ProductSansBold",
    marginVertical: 8,
  },
  illustration: {
    height: 200,
    width: 200,
    marginHorizontal: 12,
  },
  illustrationContainer: {
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    top: 40,
    marginHorizontal: 16,
  },
  backdrop: {
    backgroundColor: "#F8F5FB",
    height: 180,
    width: "100%",
  },
});

export default TransactionAmountForm;
