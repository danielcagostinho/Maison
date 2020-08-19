import React from "react";

import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

import StyledText from "./StyledText";
import colors from "../constants/colors";
const purplechevron = require("../../assets/imgs/purplechevron.png");

const SheetHeader = ({ screenNum, backAction, cancelAction }) => {
  return (
    <View style={styles.header}>
      {screenNum > 0 ? (
        <>
          <View style={{flex: 1}}>

          <TouchableOpacity onPress={backAction}>
            <View
              style={{ flexDirection: "row", height: 36, alignItems: "center"}}
              >
              <Image style={{ height: 36, width: 36}} source={purplechevron} />
              <StyledText style={styles.button}>Back</StyledText>
            </View>
          </TouchableOpacity>
              </View>
          <View style={styles.textContainer}>
            <StyledText style={styles.text}>Split Bill</StyledText>
          </View>
          <TouchableOpacity onPress={cancelAction} style={styles.buttonContainer}>
            <StyledText style={styles.button}>Cancel</StyledText>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={{ flex: 1 }}></View>
          <View style={styles.textContainer}>
            <StyledText style={styles.text}>Split Bill</StyledText>
          </View>
          <TouchableOpacity onPress={cancelAction} style={styles.buttonContainer}>
            <StyledText style={styles.button}>Cancel</StyledText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: 'center',
    marginTop: 9,
    marginHorizontal: 8,
    backgroundColor: colors.BACKDROP_PURPLE,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
  },
  text: {
    color: "black",
    lineHeight: 22,
    fontSize: 17,
    alignSelf: "center",
    fontFamily: 'ProductSansBold'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    textAlignVertical: 'center',
    
  },
  button: {
    color: colors.PRIMARY,
    lineHeight: 36,
    fontSize: 16,
    paddingRight: 8,
  },
});

export default SheetHeader;
