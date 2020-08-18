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

const TransactionsIndexScreen = ({ navigation }) => {
  const { state, getTransactions } = useContext(
    TransactionContext
  );
  const {
    state: { currentUser },
  } = useContext(HousemateContext);
  const titleStyles = [styles.listTitle];

  return (
    <View style={{flex: 1}}>
      <NavigationEvents onWillFocus={() => getTransactions(currentUser.id)} />

      <Button
        onPress={() => navigation.navigate("NewTransaction")}
        title="Add new transaction"
      />
      <StyledText style={titleStyles}>Pending</StyledText>
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
      <StyledText style={titleStyles}>Past Transactions</StyledText>
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
    fontFamily: "ProductSansBold",
    marginVertical: 10,
    marginHorizontal: 16,
  },
});

export default withNavigation(TransactionsIndexScreen);
