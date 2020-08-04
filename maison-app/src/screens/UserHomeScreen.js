// React Imports
import React, { useContext, useEffect } from "react";
import { withNavigation, NavigationEvents } from "react-navigation";

// Context Imports
import { Context as HousemateContext } from "../context/HousemateContext";
import { Context as TransactionContext } from "../context/TransactionContext";

// Component Imports
import HousemateCard from "../components/HousemateCard";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import NewBillIcon from "../../assets/imgs/newbill.png";
import StyledText from "../components/StyledText";
import colors from "../constants/colors";

const UserHomeScreen = ({ navigation }) => {
  let { state, getHousemates } = useContext(HousemateContext);
  let {
    state: { housemateDebts },
    getTransactions,
  } = useContext(TransactionContext);

  const housemates = state.housemates.filter((housemate) => {
    return housemate._id !== state.currentUser.id;
  });

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

  const illustration = require("../../assets/imgs/homepage.png");
  const houseName = "Oxley St.";

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <NavigationEvents
        onWillFocus={() => {
          getTransactions(state.currentUser.id, null);
          getHousemates();
        }}
      />
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: state.currentUser.avatarURL }}
              style={styles.displayPic}
            />

            <StyledText style={styles.houseName}>{houseName}</StyledText>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("NewTransaction")}
            >
              <Image source={NewBillIcon} style={styles.newBillButton} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusContainer}>
            {housemateDebts ? (
              <>
                <StyledText style={styles.statusText}>
                  {owedAmount < 0 ? "You're owed" : "You owe"}
                </StyledText>
                <StyledText style={styles.statusText}>
                  ${Math.abs(owedAmount).toFixed(2)}
                </StyledText>
              </>
            ) : null}
          </View>
          <StyledText style={styles.headerBottomText}>
            Now all you gotta do is wait...
          </StyledText>
          <Image source={illustration} style={styles.illustration} />
        </View>
      </View>
      <View style={{backgroundColor: "white", flex: 1 }}>
          <View>
            <StyledText style={styles.listTitle}>Housemates</StyledText>
          </View>
          {housemateDebts ? (
            <FlatList
              numColumns={2}
              style={styles.list}
              data={housemates}
              keyExtractor={(housemate) => housemate._id}
              
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
                      name: item.name,
                      avatarURL: item.avatarURL,
                    }}
                  />
                );
              }}
            />
          ) : null}
        </View>
    </View>
  );
};
UserHomeScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.PRIMARY,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  newBillButton: {
    height: 24,
    width: 19,
  },
  houseName: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 24,
    fontFamily: "ProductSansBold",
    marginLeft: 16,
    textAlignVertical: "center",
  },
  headerBottomText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    margin: 16,
  },
  list: {
  },
  listTitle: {
    fontSize: 17,
    alignSelf: "center",
    margin: 16,
    fontFamily: "ProductSansBold",
  },

  statusText: {
    color: "white",
    fontSize: 24,
    fontFamily: "ProductSansBold",
  },
  displayPic: {
    width: 32,
    height: 32,
    borderRadius: 50,
  },
  statusContainer: {
    margin: 16,
    display: "flex",
    justifyContent: "space-around",
  },
  illustration: {
    width: 126,
    height: 200,
    position: "absolute",
    alignSelf: "flex-end",
    zIndex: 2,
    right: 16,
    overflow: "hidden",
  },
});

export default withNavigation(UserHomeScreen);
