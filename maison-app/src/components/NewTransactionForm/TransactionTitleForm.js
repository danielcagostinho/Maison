import React, { useState } from "react";
import { Image, View, StyleSheet, TextInput } from "react-native";
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";
import colors from "../../constants/colors";

const TransactionTitleForm = ({title, back, next}) => {
  const illustrationL = require("../../../assets/imgs/newtransaction-illustration-1.png");
  const illustrationR = require("../../../assets/imgs/newtransaction-illustration-2.png");

  const [titleS, setTitleS] = useState(title);

  console.log(title)
  return (
    <View>
      <View style={styles.backdrop}></View>
      <View style={styles.illustrationContainer}>
        <Image source={illustrationL} style={styles.illustration1} />
        <Image source={illustrationR} style={styles.illustration2} />
      </View>
      <View style={{ zIndex: 3, backgroundColor: "#FFF" }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <StyledText style={styles.title}>What is this for?</StyledText>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            style={{
              height: 33,
              borderBottomWidth: 1,
              borderBottomColor: colors.LIGHT_PURPLE,
              color: colors.PRIMARY,
              fontFamily: "ProductSansRegular",
              fontSize: 24,
            }}
            placeholder="Dinner, groceries, rent, etc."
            value={titleS}
            onChangeText={(newText) => {
              setTitleS(newText);
            }}
          />
          <View style={{ marginVertical: 8 }}>
            <StyledButton size="lg" title="Continue" variant="dark" buttonAction={() => next(titleS)}/>
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
  illustration1: {
    height: 170,
    width: 110,
    marginHorizontal: 12,
  },
  illustration2: {
    height: 160,
    width: 140,
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

export default TransactionTitleForm;
