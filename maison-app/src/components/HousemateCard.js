// React Imports
import React, { useState, useEffect } from "react";
import { withNavigation } from "react-navigation";

// Context Imports

// Copmonent Imports
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import StyledText from "./StyledText";

// CSS Imports
import colors from "../constants/colors";
const check = require("../../assets/imgs/check.png");
const uncheck = require("../../assets/imgs/uncheck.png");

const HousemateCard = ({
  housemate,
  variant,
  toggleHousemate,
  currentUser,
  shares,
  navigation,
  totalAmount,
}) => {

  
  // Local State
  const [share, setShare] = useState("0");
  const [checked, setChecked] = useState(currentUser.id === housemate._id);
  //console.log(checked)
  // Set Checkbox Image source
  let imgSrc = checked ? check : uncheck;
  let cardStyle = !checked ? styles.card : styles.selectedCard;

  // Set styles for user amount
  let amountStyle = [styles.amountTextStyle];
  if (housemate.amount > 0) {
    amountStyle = [...amountStyle, styles.isOwed];
  } else if (housemate.amount == 0) {
    amountStyle = [...amountStyle, styles.good];
  } else {
    amountStyle = [...amountStyle, styles.owesYou];
  }
  

  // set OnPress method
  const cardPressed = () => {
    switch (variant) {
      case "display":
        {
          navigation.navigate("UserTransactionsIndex", {
            otherUser: housemate,
            otherUserDebt: housemate.amount,
          });
        }
        break;
      case "select":
        {
          if (housemate._id !== currentUser.id) {
            toggleHousemate(
              !checked,
              housemate,
              totalAmount / shares
            );
            setChecked(!checked);
          }
        }
        break;
    }
  };

  // Set CheckBox Display
  let checkBoxDisplay =
    variant !== "display" ? (
      <View style={styles.checkBoxBackground}>
        <Image source={imgSrc} style={{ width: 20, height: 20 }} />
      </View>
    ) : null;

  // Set user amount value
  const debtAmount = Math.abs(housemate.amount).toFixed(2);
  const amountDisplay = (
    <StyledText style={amountStyle}>
      {housemate.amount == 0 ? "Settled Up" : "$" + debtAmount}
    </StyledText>
  );

  // Set user debt status
  let debtStatus = (variant == "display" ? (
    <StyledText style={styles.debtStatus}>
      {housemate.amount > 0
        ? "is owed"
        : housemate.amount == 0
        ? "we're good"
        : "owes you"}
    </StyledText>
  ) : null)
  
  

  return (
    <TouchableOpacity style={cardStyle} onPress={cardPressed}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: housemate.avatarURL }}
          style={styles.displayPic}
        />
        {checkBoxDisplay}
      </View>
      <View style={styles.textContainer}>
        <StyledText style={styles.name}>
          {housemate.name.displayName}
        </StyledText>
        {debtStatus}
      </View>
      {variant === "display" ? (
        amountDisplay
      ) : checked ? (
        // <TextInput
        //   keyboardType="numeric"
        //   value={share}
        //   style={{
        //     width: 80,
        //     marginTop: 24,
        //     height: 22,
        //     marginVertical: 8,
        //     fontSize: 17,
        //     color: colors.PRIMARY,
        //     fontFamily: "ProductSansBold",
        //     borderBottomWidth: 1,
        //     borderBottomColor: colors.LIGHT_PURPLE,
        //     textAlign: "center",
        //   }}
        //   defaultValue="$00.00"
        //   placeholder="$00.00"
        //   onChangeText={(newText) => setShare(newText)}
        // />
        <StyledText
          style={styles.selectedText}
        >
          ${Number(totalAmount / shares).toFixed(2)}
        </StyledText>
      ) : (
        <StyledText
          style={styles.unSelectedText}
        >
          ${Number(share).toFixed(2)}
        </StyledText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    borderRadius: 16,
    height: 176,
    width: 164,
    padding: 16,
    alignItems: "center",
  },
  selectedCard: {
    borderRadius: 16,
    height: 176,
    width: 164,
    padding: 16,
    alignItems: "center",
    backgroundColor: colors.BACKDROP_PURPLE,
  },
  displayPic: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  name: {
    fontSize: 15,
    letterSpacing: -0.41,
    textAlign: "center",
  },
  status: {
    color: "rgba(0,0,0,0.5)",
    textAlign: "center",
  },
  amountTextStyle: {
    fontSize: 17,
    fontFamily: "ProductSansBold",
    letterSpacing: -0.41,
    margin: 16,
  },
  isOwed: {
    color: colors.FAIL,
  },
  owesYou: {
    color: colors.SUCCESS,
  },
  good: {
    color: "rgba(0,0,0,0.5)",
  },
  debtStatus: {
    color: "rgba(0,0,0,0.5)",
    letterSpacing: -0.41,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  checkBoxBackground: {
    position: "absolute",
    borderRadius: 50,
    width: 28,
    height: 28,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  unSelectedText: {
    width: 80,
    marginTop: 24,
    height: 22,
    marginVertical: 8,
    fontSize: 17,
    color: "#E0E0E0",
    fontFamily: "ProductSansBold",
    textAlign: "center",
  },
  selectedText: {
    width: 80,
    marginTop: 24,
    height: 22,
    marginVertical: 8,
    fontSize: 17,
    color: colors.PRIMARY,
    fontFamily: "ProductSansBold",
    textAlign: "center",
  }

});

export default withNavigation(HousemateCard);
