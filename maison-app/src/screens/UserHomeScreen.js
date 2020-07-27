import React, { useContext } from "react";
import { withNavigation, NavigationEvents } from "react-navigation";

import { Context as HousemateContext } from "../context/HousemateContext";
import { Context as TransactionContext } from "../context/TransactionContext";

import HousemateCard from "../components/HousemateCard";
import { View, Text, Button, StyleSheet, FlatList, Image } from "react-native";

const UserHomeScreen = ({ navigation }) => {
  let { state, getHousemates, getCurrentUser } = useContext(HousemateContext);
  let {
    state: { housemateDebts },
    getTransactions,
  } = useContext(TransactionContext);

  const housemates = state.housemates.filter((housemate) => {
    return housemate._id !== state.currentUser.id;
  });

  const displayPic = require("../../assets/imgs/profile-pics/adobe-people-21.png");

  const houseName = state.currentUser.displayName;
  let amounts = [];
  let owedAmount = 0;
  if (housemateDebts) {
    for (let i = 0; i < housemates.length; i++) {
      for (let j = 0; j < housemateDebts.length; j++) {
        if (housemateDebts[j].housemateId == housemates[i]._id) {
          amounts.push({
            housemateId: housemates[i]._id,
            amount: housemateDebts[j].amount,
          });
        }
      }
    }
    if (amounts.length) {
      owedAmount = amounts.reduce((previous, current) => {
        return Number(previous) + Number(current.amount);
      }, 0);
    }
  }

  return (
    <View>
      <NavigationEvents
        onWillFocus={() => {
          getTransactions(state.currentUser.id, null);
          getHousemates();
        }}
      />
      <View style={styles.topSection}>
        <View style={styles.row}>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 16,
              alignItems: "center",
            }}
          >
            <Image source={displayPic} style={styles.displayPic} />
            <Text style={styles.houseName}>{houseName}</Text>
          </View>
          <View style={styles.newBillButtonContainer}>
            <Button
              onPress={() => navigation.navigate("NewTransaction")}
              title="New Bill"
            />
            {/* <Button
              onPress={() => navigation.navigate("TransactionsIndex")}
              title="View Bills"
            /> */}
          </View>
        </View>
        <View style={styles.statusContainer}>
          {housemateDebts ? (
            <>
              <Text style={styles.statusText}>
                {owedAmount < 0 ? "You're owed" : "You owe"}
              </Text>
              <Text style={styles.statusText}>
                ${Math.abs(owedAmount).toFixed(2)}
              </Text>
            </>
          ) : null}
        </View>
        <Text
          style={{ color: "rgba(255,255,255,0.6)", margin: 16, fontSize: 16 }}
        >
          Now all you gotta do is wait...
        </Text>
      </View>
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitle}>Housemates</Text>
      </View>
      {housemateDebts ? (
        <FlatList
          style={styles.list}
          data={housemates}
          keyExtractor={(housemate) => housemate._id}
          numColumns={2}
          renderItem={({ item, index }) => {
            let debt = 0;
            for (let i = 0; i < amounts.length; i++) {
              if (amounts[i].housemateId == item._id) {
                debt = amounts[i].amount;
              }
            }

            return (
              <HousemateCard
                top={index < 2}
                last={index == housemates.length - 1}
                housemate={{
                  _id: item._id,
                  amount: debt,
                  name: item.name.displayName,
                }}
              />
            );
            //   return (
            //     <View style={{ borderColor: "red", borderWidth: 1 }}>
            //       <Text style={{ width: "50%", height: 100 }}>
            //         {item.name.displayName}
            //       </Text>
            //       <Text style={{ width: "50%", height: 100 }}>{debt}</Text>
            //       <Button
            //         title="Show Transactions"
            //         onPress={() =>
            //           navigation.navigate("UserTransactionsIndex", {
            //             otherUserId: item._id,
            //           })
            //         }
            //       />
            //     </View>
            //   );
          }}
        />
      ) : null}
    </View>
  );
};
UserHomeScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};
const styles = StyleSheet.create({
  topSection: {
    backgroundColor: "#4900A7",
  },
  houseName: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 30,
    lineHeight: 30,
    marginLeft: 12,
    fontWeight: "bold",
    marginVertical: 16,
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: 'yellow'
  },
  list: {
    marginHorizontal: 8,
  },
  listTitle: {
    fontSize: 17,
    alignSelf: "center",
    margin: 16,
    fontWeight: "bold",
  },
  listTitleContainer: {},
  newBillButton: {
    width: 25,
  },
  newBillButtonContainer: {
    width: 100,
    height: 100,
    marginRight: 24,
    flexDirection: "column",
    justifyContent: "space-around",
  },
  statusText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  displayPic: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderColor: "white",
    borderWidth: 1,
  },
  statusContainer: {
    // borderColor: 'green',
    // borderWidth: 1,
    margin: 16,
  },
});

export default withNavigation(UserHomeScreen);
