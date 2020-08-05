import React, { useState } from "react";
import { Image, View, StyleSheet, TextInput } from "react-native";
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";
import colors from "../../constants/colors";

const TransactionAmountForm = ({ title, amount, back, next }) => {
  const illustration = require("../../../assets/imgs/newtransaction-illustration-3.png");

  const [amountS, setAmountS] = useState(amount);

  return (
    <View>
      <View style={styles.backdrop}></View>
      <View style={styles.illustrationContair}>
        <Image source={illustration} style={styles.illustration} />
      </View>
      <View style={{ zIndex: 3, backgroundColor: "#FFF" }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <StyledText style={styles.title}>
            How much was <StyledText style={styles.transactionTitle}>{title}</StyledText>?
          </StyledText>
          <TextInput
          keyboardType='numeric'
            style={{
              height: 64,
              marginVertical: 8,
              color: colors.PRIMARY,
              fontFamily: "ProductSansBold",
              fontSize: 58,
            }}
            value={amountS}
            onChangeText={(newText) => {
              setAmountS(newText);
            }}
          />
          <View style={{ marginVertical: 8 }}>
            <StyledButton size="lg" title="Continue" variant="dark" buttonAction={() => next(amountS)}/>
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
    backgroundColor: colors.BACKDROP_PURPLE,
    height: 180,
    width: "100%",
  },
  transactionTitle : {
    color: colors.PRIMARY,
  }

});

export default TransactionAmountForm;
