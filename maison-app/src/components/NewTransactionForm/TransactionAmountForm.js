import React, { useState } from "react";
import { Image, View, StyleSheet, TextInput } from "react-native";
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";
import colors from "../../constants/colors";

const TransactionAmountForm = ({ title, amount, back, next }) => {
  const illustration = require("../../../assets/imgs/newtransaction-illustration-3.png");

  const [amountS, setAmountS] = useState(String(amount));
  const [amountChanged, setAmountChanged] = useState(false);

  const formatNumberInput = (number) => {
    console.log(number)

    // return Number(number).toFixed(2)
  }

  const changeInputText = (number) => {
    console.log(typeof(number))
    if(!amountChanged){
      let amount = number.substring(1,4) + number[5];1
      console.log(`Changing number to ${amount}`)
      setAmountChanged(true)
      return Number(amount);
    }
  }

  return (
    <View>
      <View style={styles.backdrop}></View>
      <View style={styles.illustrationContainer}>
        <Image source={illustration} style={styles.illustration} />
      </View>
      <View style={{ zIndex: 3, backgroundColor: "#FFF" }}>

        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <View style={{flexDirection: 'row'}}>
          <StyledText style={styles.title}>
            {"How much was "}
          </StyledText>
          <StyledText style={[styles.transactionTitle, styles.title]}>{title}</StyledText> 
          <StyledText style={styles.title}>?
          </StyledText>
        </View>
          <TextInput
          autoFocus={true}
          keyboardType='numeric'
            style={{
              height: 64,
              marginVertical: 8,
              color: colors.PRIMARY,
              fontFamily: "ProductSansBold",
              fontSize: 58,
              textAlign: 'center'
            }}
            value={formatNumberInput(amountS)}
            onChangeText={(newText) => {
              setAmountS(newText);   
            }}
          />
          <View style={{ marginVertical: 8 }}>
            <StyledButton size="lg" title="Continue" variant="dark" buttonAction={() => next(Number(amountS))}/>
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
    fontFamily: 'ProductSansRegular'
  }

});

export default TransactionAmountForm;
