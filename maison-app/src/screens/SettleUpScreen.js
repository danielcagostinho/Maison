import React, { useContext, useEffect, useState } from "react";

import { withNavigation } from "react-navigation";

import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import { View, FlatList } from "react-native";
import StyledText from "../components/StyledText";

const SettleUpScreen = ({ navigation }) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    state: { housemateDebts, transactions },
    getTransactions,
  } = useContext(TransactionContext);
  const {
    state: { currentUser },
  } = useContext(HousemateContext);
  const otherUserId = navigation.getParam("otherUserId");

  // Find housemateDebt
  let housemateDebt;
  let netDebt = 0;
  if (dataLoaded) {
    for (let i = 0; i < housemateDebts.length; i++) {
      if (housemateDebts[i].housemateId == otherUserId) {
        housemateDebt = housemateDebts[i];
      }
    }
    let debts = [];
    housemateDebt.transactions.map((transaction) => {
      if (currentUser.id === housemateDebt.housemateId) {
        transaction.debtors.forEach((debtor) => {
          if (transaction.ownerId == debtor.housemateId) {
            console.log(
              ` ${transaction.title} transaction belongs to otherhousemate`
            );
          } else if (currentUser.id == debtor.housemateId) {
            console.log(
              ` ${transaction.title} transaction belongs to currenthousemate`
            );
          }
        });
      } else {
        console.log("not equal id")
      }
      debts.push({
        ownerId: transaction.ownerId,
        share: 0,
        title: transaction.title,
      });
    });
  }
  console.log(netDebt);

  useEffect(() => {
    getTransactions(currentUser.id, otherUserId);
    setDataLoaded(true);
    console.log("housemateDebts");
    console.log(housemateDebts);
  }, []);
  return (
    <View>
      <StyledText>Time to Settle Up with {currentUser.displayName}</StyledText>
      <StyledText>You Owe</StyledText>
      {dataLoaded ? (
        <>
          <FlatList
            data={transactions.filter(
              (transaction) => transaction.ownerId == otherUserId
            )}
            keyExtractor={(debt) => debt._id}
            renderItem={({ item }) => {
              return (
                <StyledText>
                  {item.title} - {item.amount}
                </StyledText>
              );
            }}
          />
          <StyledText>They Owe</StyledText>
          <FlatList
            data={transactions.filter(
              (transaction) => transaction.ownerId == currentUser.id
            )}
            keyExtractor={(debt) => debt._id}
            renderItem={({ item }) => {
              return <StyledText>{item.title}</StyledText>;
            }}
          />
          <StyledText>Total ${netDebt}</StyledText>
        </>
      ) : null}
    </View>
  );
};

export default withNavigation(SettleUpScreen);
