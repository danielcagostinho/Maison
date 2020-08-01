import React, { useContext } from "react";

import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import { View, StyleSheet, Button, FlatList } from "react-native";
import StyledText from '../components/StyledText';
const ShowTransactionScreen = ({ navigation }) => {
  const {
    state: { transactions },
    payTransaction,
  } = useContext(TransactionContext);
  const {
    state: { housemates },
  } = useContext(HousemateContext);

  let transaction;
  for (let i = 0; i < transactions.length; i++) {
    let t = transactions[i];
    if (t._id === navigation.getParam("_id")) {
      transaction = t;
    }
  }

  let transactionOwner;
  for (let i = 0; i < housemates.length; i++) {
    let housemate = housemates[i];
    if (housemate._id === transaction.ownerId) {
      transactionOwner = housemate;
    }
  }
  const transactionOwnerName = transactionOwner.name.displayName;

  return (
    <View>
      <StyledText>{transaction.title}</StyledText>
      <StyledText>{transaction.isPaid ? "PAID" : "NOT PAID"}</StyledText>
      <StyledText>{transaction.amount}</StyledText>
      <StyledText>{transaction._id}</StyledText>
      <StyledText>Owner: {transactionOwnerName}</StyledText>
      <StyledText>Debtors</StyledText>
      <FlatList
        data={transaction.debtors}
        keyExtractor={(debtor) => debtor._id}
        renderItem={({ item }) => {
          const debtorName = housemates.find(
            (housemate) => housemate._id === item.housemateId
          );
          return <StyledText>{debtorName.name.displayName}</StyledText>;
        }}
      />
      {!transaction.isPaid ? (
        <Button
          title="PAY"
          onPress={async () => {
            await payTransaction(transaction._id);
            navigation.navigate("TransactionsIndex");
          }}
        />
      ) : null}
    </View>
  );
};

export default ShowTransactionScreen;
