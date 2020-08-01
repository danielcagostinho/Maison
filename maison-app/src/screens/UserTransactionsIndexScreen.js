import React, { useContext } from "react";
import { withNavigation, NavigationEvents } from "react-navigation";

import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import Transaction from "../components/Transaction";
import {
  View,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import StyledText from '../components/StyledText';


const UserTransactionsIndexScreen = ({ navigation }) => {
  const {
    state: { transactions },
    getTransactions,
  } = useContext(TransactionContext);
  const {
    state: { currentUser },
  } = useContext(HousemateContext);
  const otherUserId = navigation.getParam("otherUserId");
  const titleStyles = [styles.listTitle];

  return (
    <View>
      <NavigationEvents
        onWillFocus={() => {
          console.log("OnWillFocus");
          console.log("UserTransactionsIndexScreen");
          console.log(transactions);
          getTransactions(currentUser.id, otherUserId);
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <StyledText>Debt Amount</StyledText>
          <StyledText>you owe User</StyledText>
        </View>
        <View
          style={{
            height: 68,
            width: 68,
            borderRadius: 50,
            borderColor: "red",
            borderWidth: 1,
          }}
        ></View>
      </View>

      <Button
        title="Settle up"
        onPress={() => navigation.navigate("SettleUp",{ otherUserId: otherUserId })}
      />
      {transactions ? (
        <>
          <StyledText style={titleStyles}>Pending</StyledText>
          <FlatList
            data={transactions.filter((transaction) => !transaction.isPaid)}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ShowTransaction", { _id: item._id });
                  }}
                >
                  <Transaction title="Pending" transaction={item} />
                </TouchableOpacity>
              );
            }}
          />

          <StyledText style={titleStyles}>Past Transactions</StyledText>
          <FlatList
            data={transactions.filter((transaction) => transaction.isPaid)}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ShowTransaction", { _id: item._id })
                  }
                >
                  <Transaction title="Past Transactions" transaction={item} />
                </TouchableOpacity>
              );
            }}
          />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 15,
    fontFamily: "ProductSansBold",
    marginVertical: 10,
    marginHorizontal: 16,
  },
});

export default withNavigation(UserTransactionsIndexScreen);
