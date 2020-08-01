import React, { useContext } from "react";
import Moment from "moment";

import { Context as HousemateContext } from "../context/HousemateContext";

import { View, StyleSheet, Image } from "react-native";
import StyledText from './StyledText';

const Transaction = ({ transaction, title, onPress }) => {
  const { state: {housemates, currentUser} } = useContext(HousemateContext);
  const titleStyles = [
    styles.title,
    title === "Pending" ? { fontFamily: "ProductSansBold" } : { fontFamily: "ProductSansRegular" },
  ];
  

 
  Moment.locale("en");
  const isOwner = currentUser.id === transaction.ownerId;
  console.log(transaction.ownerId)
  console.log(`Housemate`)
  console.log(housemates.find(housemate => housemate._id === transaction.ownerId));
  let avatarURL = housemates.find(housemate => housemate._id === transaction.ownerId).avatarURL;
  let amount = 0;
  if (isOwner) {
    for (let i = 0; i < transaction.debtors.length; i++) {
      let debtor = transaction.debtors[i];
      if (debtor.housemateId == currentUser.id) {
        amount = Number(debtor.share).toFixed(2);
      }
    }
  } else {
    for (let i = 0; i < transaction.debtors.length; i++) {
      let debtor = transaction.debtors[i];
      if (debtor.housemateId == currentUser.id) {
        amount =
          Number(transaction.amount).toFixed(2) -
          Number(debtor.share).toFixed(2);
      }
    }
    //amount = transaction.amount - transaction.debtors.find((debtor) => debtor.housemateId === currentUser.id).share;
  }

  return (
    <View style={styles.row}>
      <View style={{ flexDirection: "row" }}>
        <Image source={{uri: avatarURL}} style={styles.displayPic}/>
        <View
          style={{
            flexDirection: "column",
            marginLeft: 12,
            justifyContent: "space-between",
          }}
        >
          <StyledText style={titleStyles}>{transaction.title}</StyledText>
          <StyledText style={styles.date}>
            {Moment(transaction.timestamp).format("MMMM D, YYYY")}
          </StyledText>
        </View>
      </View>
      <View style={{ flexDirection: "column", alignItems: 'center' }}>
        <StyledText style={isOwner ? styles.ownerStyle : styles.debtorStyle}>
          ${Number(amount).toFixed(2)}
        </StyledText>
        <StyledText style={isOwner ? styles.ownerStyleText : styles.debtorStyleText}>{isOwner ? "Owes You" : "You Owe"}</StyledText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    lineHeight: 17,
  },
  ownerStyle: {
    fontSize: 17,
    color: "green",
  },
  debtorStyle: {
    fontSize: 17,
    color: "red",
  },
  ownerStyleText: {
    fontSize: 13,
    color: "green",
  },
  debtorStyleText: {
    fontSize: 13,
    color: "red",
  },
  date: {
    fontSize: 13,
    lineHeight: 17,
    color: "rgba(0,0,0,0.49)",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(223,216,241,0.50)",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  displayPic: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  textContainer: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flexDirection: "row",
  },
});

export default Transaction;
