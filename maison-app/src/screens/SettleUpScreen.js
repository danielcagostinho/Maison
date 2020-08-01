import React, { useContext, useEffect, useState } from "react";

import { withNavigation } from "react-navigation";

import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

import { View, FlatList, Image, StyleSheet } from "react-native";
import StyledText from "../components/StyledText";
import StyledButton from "../components/StyledButton";

const SettleUpScreen = ({ navigation }) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    state: { housemateDebts, transactions },
    getTransactions,
  } = useContext(TransactionContext);
  const {
    state: { currentUser },
  } = useContext(HousemateContext);
  const otherUser = navigation.getParam("otherUser");
  const otherUserDebt = navigation.getParam("otherUserDebt");

  // Find housemateDebt
  let housemateDebt;
  let netDebt = 0;
  if (dataLoaded) {
    for (let i = 0; i < housemateDebts.length; i++) {
      if (housemateDebts[i].housemateId == otherUser._id) {
        housemateDebt = housemateDebts[i];
      }
    }
    let debts = [];
    housemateDebt.transactions.map((transaction) => {
      if (currentUser.id === housemateDebt.housemateId) {
        transaction.debtors.forEach((debtor) => {
          if (transaction.ownerId == debtor.housemateId) {
          } else if (currentUser.id == debtor.housemateId) {
          }
        });
      } else {
      }
      debts.push({
        ownerId: transaction.ownerId,
        share: 0,
        title: transaction.title,
      });
    });
  }

  useEffect(() => {
    getTransactions(currentUser.id, otherUser._id);
    setDataLoaded(true);
  }, []);
  return (
    <>
      <View style={{ backgroundColor: "#F8F5FB", flex: 1, padding: 16 }}>
        <View style={{paddingVertical: 20}}>
          <StyledText style={styles.titleText}>
            Time to Settle Up with{" "}
            <StyledText style={styles.housemateName}>
              {currentUser.displayName.substring(
                0,
                currentUser.displayName.length - 1
              )}
            </StyledText>
            !
          </StyledText>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: currentUser.avatarURL }}
            style={styles.avatar}
          />
          <StyledText style={styles.subtitleText}>You Owe</StyledText>
        </View>
        {dataLoaded ? (
          <>
            <FlatList
              data={transactions.filter(
                (transaction) => transaction.ownerId == otherUser._id
              )}
              keyExtractor={(debt) => debt._id}
              renderItem={({ item }) => {
                return (
                  <View style={styles.listRow}>
                    <StyledText style={styles.owedAmount}>
                      $
                      {Number(
                        Math.abs(
                          item.debtors.find(
                            (debtor) => debtor.housemateId === currentUser.id
                          ).share
                        )
                      ).toFixed(2)}
                    </StyledText>
                    <StyledText style={styles.debtTitle}>
                      {item.title}
                    </StyledText>
                  </View>
                );
              }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: otherUser.avatarURL }}
                style={styles.avatar}
              />
              <StyledText style={styles.subtitleText}>
                {otherUser.name.firstName} Owes
              </StyledText>
            </View>
            <FlatList
              data={transactions.filter(
                (transaction) => transaction.ownerId == currentUser.id
              )}
              keyExtractor={(debt) => debt._id}
              renderItem={({ item }) => {
                return (
                  <View style={styles.listRow}>
                    <StyledText style={styles.owedAmount}>
                      $
                      {Number(
                        Math.abs(
                          item.debtors.find(
                            (debtor) => debtor.housemateId === otherUser._id
                          ).share
                        )
                      ).toFixed(2)}
                    </StyledText>
                    <StyledText style={styles.debtTitle}>
                      {item.title}
                    </StyledText>
                  </View>
                );
              }}
            />
          </>
        ) : null}
      </View>
      <View style={styles.netDebt}>
        <StyledText style={styles.netDebtText}>
          Total ${otherUserDebt}
        </StyledText>
      </View>
      <View
        style={{
          padding: 16,
          paddingTop: 0,
          backgroundColor: "#FFF",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StyledButton
          size="lg"
          variant="dark"
          title={"Pay $" + otherUserDebt}
          buttonAction={() => alert("Feature not ready")}
        />
      </View>
    </>
  );
};

SettleUpScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  titleText: {
    fontFamily: "ProductSansBold",
    fontSize: 28,
  },
  housemateName: {
    color: "#4900A7",
  },
  avatar: {
    borderRadius: 50,
    height: 28,
    width: 28,
    marginRight: 6,
  },
  subtitleText: {
    fontFamily: "ProductSansBold",
    fontSize: 17,
    letterSpacing: -0.41,
    marginLeft: 6,
  },
  owedAmount: {
    fontSize: 17,
    letterSpacing: -0.41,
  },
  debtTitle: {
    color: "rgba(0,0,0,0.5)",
    letterSpacing: -0.41,
    fontSize: 13,
  },
  listRow: {
    marginLeft: 40,
    height: 60,
    justifyContent: "center",
    borderBottomColor: "rgba(223, 216, 241, 0.5)",
    borderBottomWidth: 1,
  },
  netDebt: {
    backgroundColor: "#FFF",
    padding: 16,
  },
  netDebtText: {
    color: "#4900A7",
    fontSize: 24,
    fontFamily: "ProductSansBold",
  },
});

export default withNavigation(SettleUpScreen);
