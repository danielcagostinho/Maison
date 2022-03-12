// React Imports
import React, { useContext, useEffect, useState } from "react";

// React Native Imports
import { withNavigation } from "react-navigation";

// Context Imports
import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

// Component Imports
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modalbox";
import StyledText from "../components/StyledText";
import StyledButton from "../components/StyledButton";
import colors from "../constants/colors";
const illustration = require("../../assets/imgs/settleup.png");

const SettleUpScreen = ({ navigation, setModalVisible, modalVisible, otherUser, otherUserDebt, next }) => {
  // useState
  const [dataLoaded, setDataLoaded] = useState(false);

  // useContext
  const {
    state: { housemateDebts, transactions },
    getTransactions,
  } = useContext(TransactionContext);
  const {
    state: { currentUser },
  } = useContext(HousemateContext);

  // Set Params
  // const otherUser = navigation.getParam("otherUser");
  // const otherUserDebt = navigation.getParam("otherUserDebt");

  // Find housemateDebt
  let housemateDebt;
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
    <Modal
      style={styles.modalContainer}
      isOpen={modalVisible}
      entry="bottom"
      position="bottom"
      backdropPressToClose
      onClosed={() => setModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.header}>
          <View style={styles.cancelContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <StyledText style={styles.cancel}>Cancel</StyledText>
            </TouchableOpacity>
          </View>
          <StyledText style={styles.titleText}>
            {"Time to Settle Up"}
          </StyledText>
          <View style={{ flexDirection: "row" }}>
            <StyledText style={styles.titleText}>{"with "}</StyledText>
            <StyledText style={styles.housemateName}>
              {otherUser.name.displayName.substring(
                0,
                otherUser.name.displayName.length - 1
              )}
              !
            </StyledText>
          </View>
        </View>
        <View style={styles.contentContainer}>
          {dataLoaded ? (
            <View
              style={{ flexDirection: "column", justifyContent: "flex-start" }}
            >
              <View style={styles.illustrationContainer}>
                <Image source={illustration} style={styles.illustration} />
              </View>

              <View style={styles.debtListContainer}>
                <View style={styles.debtListTitle}>
                  <Image
                    source={{ uri: currentUser.avatarURL }}
                    style={styles.avatar}
                  />
                  <StyledText style={styles.subtitleText}>You Owe</StyledText>
                </View>
                <FlatList
                  data={transactions.filter(
                    (transaction) =>
                      !transaction.isPaid &&
                      transaction.ownerId == otherUser._id
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
                                (debtor) =>
                                  debtor.housemateId === currentUser.id
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
              </View>

              <View style={styles.debtListContainer}>
                <View style={styles.debtListTitle}>
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
                    (transaction) =>
                      !transaction.isPaid &&
                      transaction.ownerId == currentUser.id
                  )}
                  keyExtractor={(debt) => debt._id}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.listRow}>
                        <StyledText style={styles.owedAmount}>
                          -$
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
              </View>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.payContainer}>
        <View style={styles.netDebt}>
          <StyledText style={styles.netDebtText}>
            {"Total $" + Number(Math.abs(otherUserDebt)).toFixed(2)}
          </StyledText>
        </View>
        <View style={styles.payButtonContainer}>
          <StyledButton
            size="lg"
            variant="dark"
            title={"Pay $" + Number(Math.abs(otherUserDebt)).toFixed(2)}
            buttonAction={() => next()}
          />
        </View>
      </View>
    </Modal>
  );
};

SettleUpScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  modalContainer: {
    overflow: "hidden",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#F8F5FB",
    marginTop: 40,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalBackground: {
    backgroundColor: "#F8F5FB",
  },
  header: {
    margin: 16,
  },
  cancelContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentContainer: {
    margin: 16,
  },
  debtListTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  debtListContainer: {
    marginTop: 12,
  },
  payContainer: {
    paddingBottom: 40,
  },
  titleText: {
    fontFamily: "ProductSansBold",
    fontSize: 28,
  },
  housemateName: {
    color: colors.PRIMARY,
    fontSize: 28,
    fontFamily: "ProductSansBold",
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
    borderBottomColor: colors.LIST_BORDER,
    borderBottomWidth: 1,
  },
  netDebt: {
    backgroundColor: "#FFF",
    padding: 16,
    marginTop: "auto",
  },
  netDebtText: {
    color: colors.PRIMARY,
    fontSize: 24,
    fontFamily: "ProductSansBold",
  },
  illustration: {
    position: "absolute",
    alignSelf: "flex-end",
    height: 600,
    width: 240,
    zIndex: 2,
  },
  payButtonContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: "#FFF",
    flexDirection: "column",
  },
  cancel: {
    color: colors.PRIMARY,
    fontSize: 17,
  },
});

export default withNavigation(SettleUpScreen);
