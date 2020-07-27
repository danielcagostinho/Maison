import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import Moment from "moment";
import { Context as HousemateContext } from "../context/HousemateContext";

const Transaction = ({ transaction, title, onPress }) => {
  const { state } = useContext(HousemateContext);
  const titleStyles = [
    styles.title,
    title === "Pending" ? { fontWeight: "bold" } : { fontWeight: "normal" },
  ];
  Moment.locale("en");

  const isOwner = state.currentUser.id === transaction.ownerId;
  let amount = 0;
  if (isOwner) {
    for (let i = 0; i < transaction.debtors.length; i++) {
      let debtor = transaction.debtors[i];
      if (debtor.housemateId == state.currentUser.id) {
        amount = Number(debtor.share).toFixed(2);
      }
    }
  } else {
    for (let i = 0; i < transaction.debtors.length; i++) {
      let debtor = transaction.debtors[i];
      if (debtor.housemateId == state.currentUser.id) {
        amount =
          Number(transaction.amount).toFixed(2) -
          Number(debtor.share).toFixed(2);
      }
    }
    //amount = transaction.amount - transaction.debtors.find((debtor) => debtor.housemateId === state.currentUser.id).share;
  }

  return (
    <View style={styles.row}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.displayPic}></View>
        <View
          style={{
            flexDirection: "column",
            marginLeft: 12,
            justifyContent: "space-between",
          }}
        >
          <Text style={titleStyles}>{transaction.title}</Text>
          <Text style={styles.date}>
            {Moment(transaction.timestamp).format("MMMM D, YYYY")}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "column" }}>
        <Text style={isOwner ? styles.ownerStyle : styles.debtorStyle}>
          ${Number(amount).toFixed(2)}
        </Text>
        <Text>{isOwner ? "Owes You" : "You Owe"}</Text>
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
    borderColor: "blue",
    borderWidth: 1,
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
