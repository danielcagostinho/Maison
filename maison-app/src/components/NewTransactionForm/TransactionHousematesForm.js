import React, { useState, useContext, useEffect } from "react";
import { withNavigation } from 'react-navigation';
import {
  Image,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FlatGrid } from "react-native-super-grid";
import { Context as HousemateContext } from "../../context/HousemateContext";
import StyledText from "../StyledText";
import StyledButton from "../StyledButton";
import colors from "../../constants/colors";
import HousemateCard from "../HousemateCard";

const TransactionHousemateForm = ({ navigation, amount }) => {
  const illustration = require("../../../assets/imgs/newtransaction-illustration-4.png");

  const housemateSentence = `Splitting ${amount} with`;

  let {
    state: { currentUser, housemates },
    getHousemates,
  } = useContext(HousemateContext);

  const [housematesS, setHousematesS] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    async function getData() {
      await getHousemates();
      setDataLoaded(true);
    }
    getData();
  }, []);

  return (
    <View>
      <View style={styles.backdrop}></View>
      <View style={styles.illustrationContainer}>
        <Image source={illustration} style={styles.illustration} />
      </View>
      <View style={{ zIndex: 3, backgroundColor: "#FFF" }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <StyledText style={styles.title}>
            Splitting <StyledText style={styles.amount}>{amount}</StyledText>{" "}
            with
          </StyledText>
          {dataLoaded ? (
            <FlatGrid
              data={housemates.filter(
                (housemate) => housemate._id !== currentUser.id
              )}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                    }}
                  >
                    <HousemateCard housemate={item} variant="" />
                  </TouchableOpacity>
                );
              }}
            />
          ) : null}
          <View style={{ marginVertical: 8 }}>
            <StyledButton size="lg" title="Split with ( 2 )" variant="dark" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontFamily: "ProductSansBold",
    marginVertical: 8,
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
    top: 90,
    marginHorizontal: 16,
  },
  backdrop: {
    backgroundColor: colors.BACKDROP_PURPLE,
    height: 200,
    width: "100%",
  },
});

export default withNavigation(TransactionHousemateForm);
