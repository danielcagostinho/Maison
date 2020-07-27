import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { withNavigation } from "react-navigation";

const HousemateCard = ({ housemate, top, last, navigation }) => {
  let cardStyle = styles.card;
  let cardStyles = [
    cardStyle,
    top ? styles.topCard : styles.notTopCard,
    last ? styles.lastCard : styles.notLastCard,
  ];

  let amountStyle = [styles.amountTextStyle];
  if (housemate.amount > 0) {
    amountStyle = [...amountStyle, styles.isOwed];
  } else if (housemate.amount == 0) {
    amountStyle = [...amountStyle, styles.good];
  } else {
    amountStyle = [...amountStyle, styles.owesYou];
  }

  const amountDisplay = (
    <Text style={amountStyle}>{housemate.amount == 0 ? "Settled Up": "$" + Math.abs(housemate.amount).toFixed(2)}</Text>
  );
  return (
    <TouchableOpacity
      style={cardStyles}
      onPress={() => {
        navigation.navigate("UserTransactionsIndex", {
          otherUserId: housemate._id,
        });
      }}
    >
      <View style={styles.displayPic}></View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{housemate.name}</Text>
        <Text>
          {housemate.amount > 0 ? "you owe" : housemate.amount == 0 ? "we're good" : "owes you"}
        </Text>
      </View>
      {amountDisplay}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 16,
    height: 176,
    flex: 1 / 2,
    alignItems: "center",
  },
  selectedCard: {
    borderRadius: 16,
    flex: 1 / 2,
    height: 176,
    backgroundColor: "#D1CCED",
    alignItems: "center",
  },
  topCard: {
    marginTop: 0,
  },
  notTopCard: {
    marginTop: 8,
  },
  notLastCard: {
    margin: 8,
  },
  lastCard: {
    marginLeft: 8,
    marginBottom: 8,
    marginRight: 24,
  },
  displayPic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: "red",
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  name: {
    fontSize: 15,
    textAlign: "center",
  },
  status: {
    color: "rgba(0,0,0,0.5)",
    textAlign: "center",
  },
  textContainer: {
    // borderColor: 'red',
    // borderWidth: 1
  },
  amountTextStyle: {
    fontSize: 17,
    fontWeight: "bold",
    margin: 16,
  },
  isOwed: {
    color: "#DC0344",
  },
  owesYou: {
    color: "#00A469",
  },
  good: {
    color: "rgba(0,0,0,0.5)",
  },
});

export default withNavigation(HousemateCard);
