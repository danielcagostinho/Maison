import React from "react";

import { View, StyleSheet, Image } from "react-native";
import ConfettiCannon from 'react-native-confetti-cannon';
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";
import colors from "../../constants/colors";

var illustration = require('../../../assets/imgs/complete.png');

const TransactionComplete = ({ closeAction, housemates, currentUser }) => {
  const getHousemates = () => {
    return housemates.map((housemate) => {
      let name =
        currentUser.displayName === housemate.name ? "Me" : housemate.name;
      return (
        <View style={styles.housemate} key={housemate.name}>
          <View>
            <Image source={{ uri: housemate.avatarURL }} style={styles.image} />
          </View>
          <StyledText style={styles.housemateName}>{name}</StyledText>
        </View>
      );
    });
  }

  return (
    <View style={styles.backdrop}>
      <ConfettiCannon
        count={120}
        origin={{ x: 150, y: 40 }}
        autoStartDelay={600}
        fadeOut={true}
        fallSpeed={2000}
        colors={[colors.PRIMARY]}
      />
      <View style={styles.content}>
        <Image style={{ height: 260, width: 169 }} source={illustration} />
        <StyledText style={styles.title}>Bill Split</StyledText>
        <StyledText style={styles.subtitle}>
          Sit back and enjoy a cup of joe!
        </StyledText>
        <StyledText style={styles.housematesTitle}>Split With</StyledText>
        <View style={styles.avatarContainer} key={1}>{getHousemates()}</View>
      </View>
      <View style={styles.buttonContainer}>
        <StyledButton
          variant="dark"
          size="lg"
          title="OK"
          buttonAction={closeAction}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-end",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  avatarContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  content: {
    alignItems: "center",
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 45,
  },
  housemate: {
    flexDirection: "column",
    width: 60,
    alignItems: "center",
    marginHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "ProductSansBold",
    color: colors.PRIMARY,
  },
  subtitle: {
    fontSize: 17,
    color: "rgba(23,0,167,0.5)",
    lineHeight: 20,
  },
  housematesTitle: {
    fontSize: 17,
    color: colors.PRIMARY,
    fontFamily: "ProductSansBold",
    lineHeight: 20,
    marginTop: 40
  },
  housemateName: {
    fontSize: 15,
    marginTop: 12,
  },
  buttonContainer: {
    margin: 16,
    marginTop: 54
  },
});

export default TransactionComplete;
