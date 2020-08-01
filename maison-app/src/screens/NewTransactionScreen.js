import React, { useState, useContext, useEffect } from "react";

import { Context as HousemateContext } from "../context/HousemateContext";
import { Context as TransactionContext } from "../context/TransactionContext";

import { FlatList } from "react-native-gesture-handler";
import { View, StyleSheet, Button, TextInput } from "react-native";
import StyledText from '../components/StyledText';
import CheckBox from "@react-native-community/checkbox";

const NewTransactionScreen = (props) => {
  // Context State
  const { state, getHousemates } = useContext(HousemateContext);
  const { addTransaction } = useContext(TransactionContext);

  // Initialize housemates
  useEffect(() => {
    getHousemates();
  }, []);

  // Local State
  const [transaction, setTransaction] = useState({
    title: "",
    amount: "",
    isPaid: false,
    timestamp: new Date(),
    ownerId: null,
    debtors: [],
  });

  // Initialize housemates with current user selected
  const [housemates, setHousemates] = useState(
    state.housemates.map((housemate) => {
      return {
        ...housemate,
        isSelected: housemate._id === state.currentUser.id,
        share: 0,
      };
    })
  );

  // Set the selected property of a housemate after corresponding checkbox is checked
  const setSelected = (index) => {
    setHousemates(
      housemates.map((housemate, i) => {
        return {
          ...housemate,
          isSelected:
            i === index ? !housemate.isSelected : housemate.isSelected,
        };
      })
    );
  };

  // Reset the form after the new transaction is submitted
  const clearForm = () => {
    setTransaction({
      title: "",
      amount: "",
      timestamp: new Date(),
      debtors: [],
      ownerId: null,
      isPaid: false,
    });
    setHousemates(
      housemates.map((housemate) => {
        return {
          ...housemate,
          isSelected: housemate._id === state.currentUser.id,
          share: 0,
        };
      })
    );
  };

  const onSubmit = async () => {
    // Get the selected housemates
    const selectedHousemates = housemates.filter((housemate) => {
      return housemate.isSelected;
    });

    const owner = state.currentUser;

    // Set Share
    let ownersShare;
    const updatedHousemates = selectedHousemates.map((housemate) => {
      const share = (
        Number(transaction.amount) / selectedHousemates.length
      ).toFixed(2);
      if (housemate._id === owner.id) {
        ownersShare = share;
      }
      return { ...housemate, share };
    });

    const debtors = updatedHousemates.map((housemate) => {
      return {
        housemateId: housemate._id,
        share: housemate.share,
        sharePaid: false,
      };
    });
    const newTransaction = {
      ...transaction,
      amount: Number(transaction.amount).toFixed(2),
      ownerId: owner.id,
      debtors,
    };
    await addTransaction(newTransaction);
    clearForm();
    props.navigation.navigate("UserHome");
  };

  return (
    <View>
      <StyledText style={styles.textStyle}>What is this for?</StyledText>
      <TextInput
        style={styles.inputStyle}
        placeholder="Dinner, groceries, rent, etc."
        value={transaction.title}
        onChangeText={(newText) => {
          let newTransaction = { ...transaction };
          newTransaction.title = newText;
          setTransaction(newTransaction);
        }}
      />
      <StyledText style={styles.textStyle}>How much was lunch?</StyledText>
      <TextInput
        style={styles.inputStyle}
        value={transaction.amount}
        placeholder="$00.00"
        onChangeText={(newText) => {
          let newTransaction = { ...transaction };
          newTransaction.amount = newText;
          setTransaction(newTransaction);
        }}
      />
      <StyledText style={styles.textStyle}>Splitting amount with:</StyledText>
      <FlatList
        style={styles.list}
        data={housemates}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item, index }) => {
          return (
            // <HousemateCard isNew={true} last={(index == housemates.length-1)} housemate={item}/>
            <View style={styles.card}>
              <StyledText style={styles.label}>{item.name.displayName}</StyledText>
              <CheckBox
                value={item.isSelected}
                disabled={item._id === state.currentUser.id}
                onChange={() => setSelected(index)}
              />
            </View>
          );
        }}
      />
      <Button onPress={onSubmit} title="Continue" />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
  },
  textStyle: {
    fontSize: 28,
  },
  inputStyle: {
    fontSize: 28,
    padding: 4,
    backgroundColor: "white",
  },
  list: {
    marginHorizontal: 8,
  },
});

export default NewTransactionScreen;
