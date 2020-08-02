import React from "react";
import { Image, View, StyleSheet, TextInput } from "react-native";
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";

const TransactionHousemateForm = ({amount}) => {
  const illustration = require("../../../assets/imgs/newtransaction-illustration-4.png");

  const housemateSentence = `Splitting ${amount} with`;

  return (
    <View>
      <View style={styles.backdrop}></View>
      <View style={styles.illustrationContainer}>
        <Image source={illustration} style={styles.illustration} />
      </View>
      <View style={{ zIndex: 3, backgroundColor: "#FFF" }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
  <StyledText style={styles.title}>{housemateSentence}</StyledText>
          <View style={{ marginVertical: 8 }}>
            <StyledButton size="lg" title="Split with ( 2 )" variant="dark" />
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
    height: 120,
    width: 240,
    marginHorizontal: 12,
  },
  illustrationContainer: {
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    top: 90,
    marginHorizontal: 16,
  },
  backdrop: {
    backgroundColor: "#F8F5FB",
    height: 200,
    width: "100%",
  },
});

export default TransactionHousemateForm;
