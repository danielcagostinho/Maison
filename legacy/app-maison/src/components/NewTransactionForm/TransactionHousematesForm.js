// React Imports
import React, { useState, useContext, useEffect } from "react";
import { withNavigation } from "react-navigation";

// Context Imports
import { Context as HousemateContext } from "../../context/HousemateContext";

// Component Imports
import { Image, View, StyleSheet, Dimensions } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";
import HousemateCard from "../HousemateCard";

// CSS Imports
import colors from "../../constants/colors";

const TransactionHousemateForm = ({ navigation, totalAmount, next }) => {
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
  const [dimensions, setDimensions] = useState({ window, screen });
  let cardWidth = dimensions.window.width * 0.36;
  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      ({ window, screen }) => {
        setDimensions({ window, screen });
      }
    );
    return () => subscription?.remove();
  });
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
    {
      housemateId: currentUserH._id,
      share: totalAmount,
      firstName: currentUserH.name.firstName,
    },
  ]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const toggleHousemate = (checked, housemate, share) => {
    if (!checked) {
      // If deselected
      let newHousemates = housematesS.filter(
        (h) => h.housemateId != housemate._id
      );
      setHousematesS(updateShares(newHousemates));
    } else {
      // If Selected
      let newHousemates = [
        ...housematesS,
        {
          housemateId: housemate._id,
          share: share,
          firstName: housemate.name.firstName,
          avatarURL: housemate.avatarURL
        },
      ];
      setHousematesS(updateShares(newHousemates));
    }
  };

  const updateShares = (housematesToUpdate) => {
    return housematesToUpdate.map((housemate) => {
      return {
        ...housemate,
        share: (totalAmount / housematesToUpdate.length).toFixed(2),
      };
    });
  };

  

  function housemateSentenceBuilder() {
    let selectedHousemates = housematesS.filter(
      (housemateS) => housemateS.housemateId !== currentUser.id
    );
    let styledSelectedHousemates = selectedHousemates.map((housemate, i) => {
      return (
        <React.Fragment key={housemate.firstName}>
          <StyledText style={styles.housemateName}>
            {housemate.firstName}
          </StyledText>
          {selectedHousemates.length - 1 !== i ? (
            <StyledText style={styles.title}>{" and "}</StyledText>
          ) : null}
        </React.Fragment>
      );
    });
    return (
      <View style={styles.housemateSentence}>
        <StyledText style={styles.title}>{"Splitting "}</StyledText>
        <StyledText style={styles.amount}>
          ${Number(totalAmount).toFixed(2)}
        </StyledText>
        <StyledText style={styles.title}>{" with "}</StyledText>
        {styledSelectedHousemates}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.backdrop}></View>
      <View style={styles.illustrationContainer}>
        <Image source={illustration} style={styles.illustration} />
      </View>
      <View style={styles.housemateGrid}>
        {housemateSentenceBuilder()}
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
                  cardHeight={cardWidth}
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
  housemateSentence: {
    margin: 20,
    marginBottom: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  housemateName: {
    color: colors.PRIMARY,
    fontSize: 28,
    fontFamily: "ProductSansBold",
  },
  title: {
    fontSize: 28,
    fontFamily: "ProductSansBold",
  },
  amount: {
    color: colors.PRIMARY,
    fontSize: 28,
    fontFamily: "ProductSansBold",
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
    flex: 1,
  },
});

export default withNavigation(TransactionHousemateForm);
