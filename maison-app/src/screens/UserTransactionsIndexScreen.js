import React, { useContext, useState, useEffect } from "react";
import { withNavigation, NavigationEvents } from "react-navigation";

import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import Transaction from "../components/Transaction";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import StyledText from '../components/StyledText';
import StyledButton from '../components/StyledButton';


const UserTransactionsIndexScreen = ({ navigation }) => {
  const {
    state: { transactions, housemateDebts },
    getTransactions,
  } = useContext(TransactionContext);
  const {
    state: { currentUser },
  } = useContext(HousemateContext);
  const [localHousemateDebts, setLocalHousemateDebts] = useState([]);
  const otherUserId = navigation.getParam("otherUserId");
  const otherUserName = navigation.getParam("otherUserName");
  const otherUserDebt = navigation.getParam("otherUserDebt");
  const titleStyles = [styles.listTitle];

  useEffect(() => {
    getTransactions(currentUser.id, otherUserId);
    setLocalHousemateDebts(housemateDebts)
    
  }, []);
  
  return (
    <View>
      <View style={{backgroundColor: '#F8F5FB', padding: 16}}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 16 }}>
        <View>
          <StyledText style={styles.amount}>${otherUserDebt}</StyledText>
          <StyledText style={styles.debtStatus}>{otherUserDebt < 0 ? `you owe ${otherUserName}` : `${otherUserName} owes you` }</StyledText>
        </View>
        {/* display picture below */}
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

      <StyledButton
        title="Settle up"
        buttonAction={() => navigation.navigate("SettleUp",{ otherUserId: otherUserId })}
      />
      </View>
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
  amount: {
    fontFamily: 'ProductSansBold',
    fontSize: 34,
    letterSpacing: -0.24,
  },
  debtStatus: {
    letterSpacing: -0.41,
    fontSize: 24,
    color: 'rgba(0,0,0,0.5)'
  }
});

export default withNavigation(UserTransactionsIndexScreen);
