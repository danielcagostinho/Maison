import React, { useContext } from "react";

import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import { Text, View, StyleSheet, Button } from "react-native";
import { FlatList } from "react-native-gesture-handler";

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
  console.log(`Transaction: ${transaction}`);

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
      <Text>{transaction.title}</Text>
      <Text>{transaction.isPaid ? "PAID" : "NOT PAID"}</Text>
      <Text>{transaction.amount}</Text>
      <Text>{transaction._id}</Text>
      <Text>Owner: {transactionOwnerName}</Text>
      <Text>Debtors</Text>
      <FlatList
        data={transaction.debtors}
        keyExtractor={(debtor) => debtor._id}
        renderItem={({ item }) => {
          const debtorName = housemates.find(
            (housemate) => housemate._id === item.housemateId
          );
          return <Text>{debtorName.name.displayName}</Text>;
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
