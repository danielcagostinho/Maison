import React, { useContext, useEffect, useState } from "react";
import { withNavigation } from "react-navigation";
import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import Transaction from "../components/Transaction";
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import StyledText from "../components/StyledText";
import StyledButton from "../components/StyledButton";
import DebugBorder from "../utils/DebugBorder";
import StickyList from "../components/StickyList";

import colors from "../constants/colors";
import SettleUpScreen from "./SettleUpScreen";
import PaymentProcessedScreen from "./PaymentProcessedScreen";
const purplechevron = require("../../assets/imgs/purplechevron.png");

const UserTransactionsIndexScreen = ({ navigation }) => {
  const {
    state: { transactions },
    getTransactions,
  } = useContext(TransactionContext);
  const {
    state: { currentUser },
  } = useContext(HousemateContext);

  const otherUser = navigation.getParam("otherUser");
  const otherUserDebt = navigation.getParam("otherUserDebt");
  const titleStyles = [styles.listTitle];
  const [modalVisible, setModalVisible] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [settledUp, setSettledUp] = useState(false);

  const TransactionListHeader = () => {
    return (
      <View>
        <Text style={{ color: "black", fontSize: 40 }}>
          TransactionListHeader
        </Text>
      </View>
    );
  };

  useEffect(() => {
    async function getData() {
      await getTransactions(currentUser.id, otherUser._id);
      setDataLoaded(true);
    }
    getData();
  }, []);

  const listItems = [
    ...transactions.filter((transaction) => !transaction.isPaid),
    ...transactions.filter((transaction) => transaction.isPaid),
  ];

  const transactionDisplay = () => {
    return (
      <DebugBorder color="red">
        {transactions.map((transaction) => {
          return (
            <View key={transaction._id}>
              <StyledText style={titleStyles}>Pending</StyledText>
            </View>
          );
        })}
      </DebugBorder>
    );
  };

  const prepareDataForList = () => {
    let newData = [];
    let pendingTransactions = transactions
      .filter((transaction) => !transaction.isPaid)
      .map((transaction) => {
        return { ...transaction, header: false };
      });

    console.log(transactions);

    let pastTransactions = transactions
      .filter((transaction) => transaction.isPaid)
      .map((transaction) => {
        return { ...transaction, header: false };
      });
    newData.push({
      header: true,
      title: "Pending Transactions",
    });
    newData = newData.concat(pendingTransactions);
    newData.push({
      header: true,
      title: "Pending Transactions",
    });
    newData = newData.concat(pastTransactions);
    return newData;
  };

  const processPayment = () => {
    setSettledUp(true)
  }

  return (
    <>
      <View style={{ backgroundColor: "#FFF" }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("UserHome")}>
            <View
              style={{ flexDirection: "row", height: 36, alignItems: "center" }}
            >
              <Image style={{ height: 36, width: 36 }} source={purplechevron} />
              <StyledText style={styles.headerText}>Back</StyledText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: "#F8F5FB", padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <View>
              <StyledText style={styles.amount}>
                ${Math.abs(Number(otherUserDebt)).toFixed(2)}
              </StyledText>
              <StyledText style={styles.debtStatus}>
                {otherUserDebt > 0
                  ? `you owe ${otherUser.name.displayName}`
                  : `${otherUser.name.displayName} owes you`}
              </StyledText>
            </View>
            <Image
              source={{ uri: otherUser.avatarURL }}
              style={styles.profile}
            />
          </View>

          <StyledButton
            size="md"
            variant="light"
            title="Settle up"
            buttonAction={() =>
              // navigation.navigate("SettleUp", { otherUser, otherUserDebt })
              setModalVisible(true)
            }
          />
        </View>
        <View>
          {dataLoaded ? (
            <View style={{ backgroundColor: "white" }}>
              <StyledText style={titleStyles}>Pending</StyledText>
              <FlatList
                // style={{paddingBottom: 40}}
                data={transactions.filter(
                  (transaction) => !transaction.isPaid
                )}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("ShowTransaction", {
                          _id: item._id,
                        });
                      }}
                    >
                      <Transaction
                        title="Pending"
                        transaction={item}
                        otherUserName={otherUser.name.firstName}
                      />
                    </TouchableOpacity>
                  );
                }}
              />

              <StyledText style={titleStyles}>Past Transactions</StyledText>
              <FlatList
                data={transactions.filter(
                  (transaction) => transaction.isPaid
                )}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ShowTransaction", {
                          _id: item._id,
                        })
                      }
                    >
                      <Transaction
                        title="Past Transactions"
                        transaction={item}
                        otherUserName={otherUser.name.firstName}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ) : null}
        </View>
      </View>
      {!settledUp ?
        <SettleUpScreen
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          otherUser={otherUser}
          otherUserDebt={otherUserDebt}
          next={processPayment}
        /> :
        <PaymentProcessedScreen
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          otherUser={otherUser}
          otherUserDebt={otherUserDebt}
          next={processPayment}
        />}
    </>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.BACKDROP_PURPLE,
    paddingTop: 32,
    paddingHorizontal: 8,
  },
  headerText: {
    color: colors.PRIMARY,
    lineHeight: 36,
    fontSize: 18,
  },
});

export default withNavigation(UserTransactionsIndexScreen);
