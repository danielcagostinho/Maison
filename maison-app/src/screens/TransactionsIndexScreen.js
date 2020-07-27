import React, { useContext } from "react";
import { withNavigation, NavigationEvents } from "react-navigation";

import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import Transaction from "../components/Transaction";
import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";

const TransactionsIndexScreen = ({ navigation }) => {
  const { state, getTransactions } = useContext(
    TransactionContext
  );
  const {
    state: { currentUser },
  } = useContext(HousemateContext);
  const titleStyles = [styles.listTitle];

  return (
    <View>
      <NavigationEvents onWillFocus={() => getTransactions(currentUser.id)} />

      <Button
        onPress={() => navigation.navigate("NewTransaction")}
        title="Add new transaction"
      />
      <Text style={titleStyles}>Pending</Text>
      <FlatList
        data={state.filter((transaction) => !transaction.isPaid)}
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
      <Text style={titleStyles}>Past Transactions</Text>
      <FlatList
        data={state.filter((transaction) => transaction.isPaid)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 16,
  },
});

export default withNavigation(TransactionsIndexScreen);
