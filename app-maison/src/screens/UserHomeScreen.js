// React Imports
import React, { useContext, useState, useEffect } from "react";
import { withNavigation } from "react-navigation";

// Context Imports
import { Context as HousemateContext } from "../context/HousemateContext";
import { Context as TransactionContext } from "../context/TransactionContext";

// Component Imports
import HousemateCard from "../components/HousemateCard";
import { View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import NewBillIcon from "../../assets/imgs/newbill.png";
import StyledText from "../components/StyledText";
const illustration = require("../../assets/imgs/homepage.png");
import NewTransactionScreen from "./NewTransactionScreen";

// CSS Imports
import colors from "../constants/colors";

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

const UserHomeScreen = ({ navigation }) => {
  const houseName = "Oxley St.";
  const [dataLoaded, setDataLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const [dimensions, setDimensions] = useState({ window, screen });
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  });


  let cardWidth = dimensions.window.width * 0.36;
  let gridSpacing = dimensions.window.width * 0.05;

  let {
    state: { currentUser, housemates },
    getHousemates,
  } = useContext(HousemateContext);
  let {
    state: { housemateDebts },
    getTransactions,
  } = useContext(TransactionContext);
  async function getData() {
    await getTransactions(currentUser.id, null);
    await getHousemates();
    setDataLoaded(true);
  }
  useEffect(() => {
    getData();
  }, [modalVisible]);

  const otherHousemates = housemates.filter((housemate) => {
    return housemate._id !== currentUser.id;
  });

  let owedAmount = 0;
  if (dataLoaded) {
    housemateDebts.map((housemateDebt) => {
      owedAmount += Number(housemateDebt.amount);
    });
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        {/* <NavigationEvents onWillFocus={getData()}/> */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: currentUser.avatarURL }}
                style={styles.displayPic}
              />
              <StyledText style={styles.houseName}>{houseName}</StyledText>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  // navigation.navigate("NewTransaction")}
                  setModalVisible(true);
                }}
              >
                <Image source={NewBillIcon} style={styles.newBillButton} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.statusContainer}>
              {dataLoaded ? (
                <>
                  <StyledText style={styles.statusText}>
                    {owedAmount < 0 ? "You're owed" : "You owe"}
                  </StyledText>
                  <StyledText style={styles.statusText}>
                    ${Number(Math.abs(owedAmount)).toFixed(2)}
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
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <View>
            <StyledText style={styles.listTitle}>Housemates</StyledText>
          </View>
          {dataLoaded ? (
            <FlatGrid
              itemDimension={cardWidth}
              data={otherHousemates}
              spacing={gridSpacing}
              renderItem={({ item }) => {
                return (
                  <HousemateCard
                    housemate={{
                      _id: item._id,
                      amount: housemateDebts.find(
                        (housemateDebt) =>
                          housemateDebt.housemateId === item._id
                      ).amount,
                      name: item.name,
                      avatarURL: item.avatarURL,
                    }}
                    currentUser={currentUser}
                    variant="display"
                    cardHeight={cardWidth}
                  />
                );
              }}
            />
          ) : null}
        </View>
      </View>
      <NewTransactionScreen
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        currentUser={currentUser}
      />
    </>
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
    paddingTop: 24
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
  listTitle: {
    fontSize: 17,
    alignSelf: "center",
    margin: 16,
    marginBottom: 8,
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
