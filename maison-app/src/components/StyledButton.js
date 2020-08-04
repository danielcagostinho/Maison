import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import colors from '../constants/colors';
import StyledText from "./StyledText";

const StyledButton = ({ buttonAction, title, variant, size }) => {
  return (
    <TouchableOpacity onPress={buttonAction}>
      <View
        style={[
          styles.button,
          size == "lg" ? styles.lg : styles.md,
          variant == "light" ? styles.lightVariant : styles.darkVariant,
        ]}
      >
        <StyledText
          style={[
            styles.text,
            variant == "light"
              ? styles.lightVariantText
              : styles.darkVariantText,
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
    display: "flex",
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
});

export default StyledButton;
