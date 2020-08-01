import React, { useContext, useEffect } from "react";
import { withNavigation } from "react-navigation";
import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import Transaction from "../components/Transaction";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import StyledText from "../components/StyledText";
import StyledButton from "../components/StyledButton";

const UserTransactionsIndexScreen = ({ navigation }) => {
  const {
    state: { transactions, housemateDebts },
    getTransactions,
  } = useContext(TransactionContext);
  const {
    state: { currentUser },
  } = useContext(HousemateContext);
  //const [localHousemateDebts, setLocalHousemateDebts] = useState([]);
  const otherUser = navigation.getParam("otherUser");
  const otherUserDebt = navigation.getParam("otherUserDebt");
  const titleStyles = [styles.listTitle];

  useEffect(() => {
    getTransactions(currentUser.id, otherUser._id);
    //setLocalHousemateDebts(housemateDebts)
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ backgroundColor: "#F8F5FB", padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 16,
          }}
        >
          <View>
            <StyledText style={styles.amount}>${otherUserDebt}</StyledText>
            <StyledText style={styles.debtStatus}>
              {otherUserDebt < 0
                ? `you owe ${otherUser.name.displayName}`
                : `${otherUser.name.displayName} owes you`}
            </StyledText>
          </View>
          {/* display picture below */}
          <Image source={{ uri: otherUser.avatarURL }} style={styles.profile} />
        </View>

        <StyledButton
          variant="light"
          title="Settle up"
          buttonAction={() => navigation.navigate("SettleUp", { otherUser, otherUserDebt })}
        />
      </View>
      {transactions ? (
        <View style={{ backgroundColor: "white" }}>
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
        </View>
      ) : null}
    </View>
  );
};

UserTransactionsIndexScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  listTitle: {
    fontSize: 15,
    fontFamily: "ProductSansBold",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  amount: {
    fontFamily: "ProductSansBold",
    fontSize: 34,
    letterSpacing: -0.24,
  },
  debtStatus: {
    letterSpacing: -0.41,
    fontSize: 24,
    color: "rgba(0,0,0,0.5)",
  },
  profile: {
    width: 68,
    height: 68,
    borderRadius: 45,
  },
});

export default withNavigation(UserTransactionsIndexScreen);
