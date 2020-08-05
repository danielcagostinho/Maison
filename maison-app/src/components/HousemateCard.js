import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, TextInput } from "react-native";
import StyledText from './StyledText';
import { withNavigation } from "react-navigation";
import colors from "../constants/colors";

const HousemateCard = ({ housemate, variant }) => {
  let cardStyle = styles.card;
  let cardStyles = [
    cardStyle
  ];

  // variants checkbox and homepage

  let amountStyle = [styles.amountTextStyle];
  if (housemate.amount > 0) {
    amountStyle = [...amountStyle, styles.isOwed];
  } else if (housemate.amount == 0) {
    amountStyle = [...amountStyle, styles.good];
  } else {
    amountStyle = [...amountStyle, styles.owesYou];
  }
  const debtAmount = Math.abs(housemate.amount).toFixed(2);
  const amountDisplay = (
    <StyledText style={amountStyle}>{housemate.amount == 0 ? "Settled Up": "$" + debtAmount}</StyledText>
  );
  return (
    <View style={cardStyles}>
      <Image source={{ uri: housemate.avatarURL }} style={styles.displayPic}/>
      <View style={styles.textContainer}>
        <StyledText style={styles.name}>{housemate.name.displayName}</StyledText>
       { variant == "select" ? <StyledText style={styles.debtStatus}>
          {housemate.amount > 0 ? "is owed" : housemate.amount == 0 ? "we're good" : "owes you"}
        </StyledText> : null}
      </View>
      {variant == "select" ? amountDisplay : <TextInput
          keyboardType='numeric'
            style={{
              width: 80,
              marginTop: 24,
              height: 22,
              marginVertical: 8,
              fontSize: 17,
              color: colors.PRIMARY,
              fontFamily: "ProductSansBold",
              borderBottomWidth: 1,
              borderBottomColor: colors.LIGHT_PURPLE,
              textAlign: 'center'
            }}
            
          />}
    </View>
    
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 16,
    height: 176,
    width: 164,
    // flex: 1 / 2,
    alignItems: "center",
  },
  selectedCard: {
    borderRadius: 16,
    // flex: 1 / 2,
    height: 176,
    backgroundColor: colors.LIGHT_PURPLE,
    alignItems: "center",
  },
  displayPic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginTop: 16,
    marginBottom: 8,
  },
  name: {
    fontSize: 15,
    letterSpacing: -0.41,
    textAlign: "center",
  },
  status: {
    color: "rgba(0,0,0,0.5)",
    textAlign: "center",
  },
  textContainer: {
  },
  amountTextStyle: {
    fontSize: 17,
    fontFamily: "ProductSansBold",
    letterSpacing: -0.41,
    margin: 16,
  },
  isOwed: {
    color: colors.FAIL,
  },
  owesYou: {
    color: colors.SUCCESS,
  },
  good: {
    color: "rgba(0,0,0,0.5)",
  },
  debtStatus: {
    color: "rgba(0,0,0,0.5)",
    letterSpacing: -0.41,
  }
});

export default withNavigation(HousemateCard);
