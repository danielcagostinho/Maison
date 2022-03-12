// React Imports
import React, { useContext } from "react";

// Context Imports
import { Context as HousemateContext } from "../context/HousemateContext";

// Component Imports
import StyledText from "./StyledText";
import { View, StyleSheet, Image } from "react-native";
const chevron = require("../../assets/imgs/Chevron.png");

// CSS Imports
import colors from "../constants/colors";

// Moment Import
import Moment from "moment";
Moment.locale("en");

const Transaction = ({ transaction, title, otherUserName }) => {
  const {
    state: { housemates, currentUser },
  } = useContext(HousemateContext);

  const titleStyles = [
    styles.title,
    title === "Pending"
      ? { fontFamily: "ProductSansBold" }
      : { fontFamily: "ProductSansRegular" },
  ];

  const isOwner = currentUser.id === transaction.ownerId;

  const paidTransaction = title !== "Pending";

  const transactionTextStyles = paidTransaction ? styles.paidStyleText : isOwner ? styles.ownerStyleText : styles.debtorStyleText;
  const amountStyles = paidTransaction ? styles.paidStyle : isOwner ? styles.ownerStyle : styles.debtorStyle;


  let avatarURL;
  let housemate = housemates.find(
    (housemate) => housemate._id === transaction.ownerId
  );
  if (housemate) {
    avatarURL = housemate.avatarURL;
  }
  let amount = 0;
  if (isOwner) {
    for (let i = 0; i < transaction.debtors.length; i++) {
      let debtor = transaction.debtors[i];
      if (debtor.housemateId == currentUser.id) {
        amount = Number(debtor.share);
      }
    }
  } else {
    for (let i = 0; i < transaction.debtors.length; i++) {
      let debtor = transaction.debtors[i];
      if (debtor.housemateId == currentUser.id) {
        amount = Number(debtor.share);
      }
    }
  }


  const debtTextStyle = paidTransaction ? (isOwner ? otherUserName + " Paid" : "You Paid") : isOwner ? "Owes You" : "You Owe"


  return (
    <View style={styles.row}>
      <View style={{ flexDirection: "row" }}>
        <Image source={{ uri: avatarURL }} style={styles.displayPic} />
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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <StyledText style={amountStyles}>
            ${Number(amount).toFixed(2)}
          </StyledText>
          <StyledText
            style={transactionTextStyles}
          >
            {debtTextStyle}
          </StyledText>
        </View>
        <Image
          style={{ height: 12, width: 6, marginLeft: 12 }}
          source={chevron}
        />
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
    letterSpacing: -0.41,
    lineHeight: 20,
    fontSize: 17,
    color: colors.SUCCESS,
  },
  paidStyle: {
    letterSpacing: -0.41,
    lineHeight: 20,
    fontSize: 17,
    color: colors.PAID,
  },
  debtorStyle: {
    letterSpacing: -0.41,
    lineHeight: 20,
    fontSize: 17,
    color: colors.FAIL,
  },
  ownerStyleText: {
    fontSize: 13,
    letterSpacing: -0.41,
    color: colors.SUCCESS,
  },
  debtorStyleText: {
    fontSize: 13,
    letterSpacing: -0.41,
    color: colors.FAIL,
  },
  paidStyleText: {
    color: colors.PAID,
    fontSize: 13,
    letterSpacing: -0.41,
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
    borderBottomColor: colors.LIST_BORDER,
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
  paid: {
    color: colors.PAID
  }
});

export default Transaction;
