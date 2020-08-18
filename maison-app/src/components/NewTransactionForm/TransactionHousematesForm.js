// React Imports
import React, { useState, useContext, useEffect } from "react";
import { withNavigation } from "react-navigation";

// Context Imports
import { Context as HousemateContext } from "../../context/HousemateContext";

// Component Imports
import { Image, View, StyleSheet } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";
import HousemateCard from "../HousemateCard";

// CSS Imports
import colors from "../../constants/colors";

const TransactionHousemateForm = ({ navigation, totalAmount, next }) => {
  useEffect(() => {
    async function getData() {
      await getHousemates();
      setDataLoaded(true);
    }
    getData();
  }, []);
  const illustration = require("../../../assets/imgs/newtransaction-illustration-4.png");
  const {
    state: { currentUser, housemates },
    getHousemates,
  } = useContext(HousemateContext);

  const currentUserH = housemates.find(
    (housemate) => (housemate._id = currentUser.id)
  );

  const [housematesS, setHousematesS] = useState([
    { housemateId: currentUserH._id, share: totalAmount, firstName: currentUserH.name.firstName },
  ]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const toggleHousemate = (checked, housemate, share) => {
    if (!checked) {
      // If deselected
      let newHousemates = housematesS.filter((h) => h.housemateId != housemate._id);
      setHousematesS(updateShares(newHousemates));

    } else {
      // If Selected
      let newHousemates = [
        ...housematesS,
        { housemateId: housemate._id, share: share, firstName: housemate.name.firstName },
      ];
      setHousematesS(updateShares(newHousemates));
      
    }
    
  };

  const updateShares = (housematesToUpdate) => {
    return (housematesToUpdate.map(housemate => {
      return {...housemate, share: (totalAmount/housematesToUpdate.length).toFixed(2)}
    }));
  }

  

  const housemateSentence = (
    <StyledText style={styles.title}>
      Splitting <StyledText style={styles.amount}>${Number(totalAmount).toFixed(2)}</StyledText>{" "}
      with{" "}
      {housematesS.length > 2
        ? housematesS
            .filter((housemateS) => housemateS.housemateId !== currentUser.id)
            .map((housemate) => housemate.firstName)
            .join(" and ")
        : housematesS
            .filter((housemateS) => housemateS.housemateId !== currentUser.id)
            .map((housemate) => housemate.firstName)}
    </StyledText>
  );

  return (
    <View style={{flex: 1}}>
      <View style={styles.backdrop}></View>
      <View style={styles.illustrationContainer}>
        <Image source={illustration} style={styles.illustration} />
      </View>
      <View style={styles.housemateGrid}>
        {housemateSentence}
        {dataLoaded ? (
          <FlatGrid
            data={housemates.sort((x, y) =>
              x._id == currentUser.id ? -1 : y == currentUser.id ? 1 : 0
            )}
            renderItem={({ item }) => {
              return (
                <HousemateCard
                  housemate={item}
                  variant="select"
                  totalAmount={totalAmount}
                  toggleHousemate={toggleHousemate}
                  currentUser={currentUser}
                  shares={housematesS.length}
                />
              );
            }}
          />
        ) : null}
        <View style={{ marginHorizontal: 16, marginBottom: 8 }}>
          <StyledButton
            size="lg"
            title={`Split with ( ${housematesS.length} )`}
            variant="dark"
            buttonAction={() => next(housematesS)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontFamily: "ProductSansBold",
    margin: 20,
    marginBottom: 8,
  },
  amount: {
    color: colors.PRIMARY,
  },
  illustration: {
    height: 120,
    width: 240,
    marginHorizontal: 12,
  },
  illustrationContainer: {
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    top: 40,
    marginHorizontal: 16,
  },
  backdrop: {
    backgroundColor: colors.BACKDROP_PURPLE,
    height: 150,
    width: "100%",
  },
  housemateGrid: {
    zIndex: 3,
    backgroundColor: "#FFF",
    flex: 1
  },
});

export default withNavigation(TransactionHousemateForm);
