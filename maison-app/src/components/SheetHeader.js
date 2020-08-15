import React from "react";

import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

import StyledText from "./StyledText";
import colors from "../constants/colors";
const purplechevron = require("../../assets/imgs/purplechevron.png");

const SheetHeader = ({ screenNum, backAction }) => {
  return (
    <View style={styles.header}>
      {screenNum > 0 ? (
        
        <TouchableOpacity onPress={backAction}>
        <View
          style={{ flexDirection: "row", height: 36, alignItems: "center" }}
          >
          <Image style={{ height: 36, width: 36 }} source={purplechevron} />
          <StyledText style={styles.button}>Back</StyledText>
        </View>
      </TouchableOpacity>)
          : (
            null
          ) }
      <StyledText style={styles.text}>Split Bill</StyledText>
      <TouchableOpacity>
        <StyledText style={styles.button}>Cancel</StyledText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 16,
    margin: 8,
    backgroundColor: colors.BACKDROP_PURPLE,
  },
  text: {
    color: "black",
    lineHeight: 36,
    fontSize: 16,
  },
  button: {
    color: colors.PRIMARY,
    lineHeight: 36,
    fontSize: 16,
  },
});

export default SheetHeader;
