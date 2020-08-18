import React, { useState, useContext, useEffect, useRef } from "react";

import { Context as HousemateContext } from "../context/HousemateContext";
import { Context as TransactionContext } from "../context/TransactionContext";

import { View, StyleSheet, Button } from "react-native";
import Modal from "react-native-modalbox";
import StyledText from "../components/StyledText";
import SheetHeader from '../components/SheetHeader';
import colors from '../constants/colors';

import TransactionTitleForm from "../components/NewTransactionForm/TransactionTitleForm";
import TransactionAmountForm from "../components/NewTransactionForm/TransactionAmountForm";
import TransactionHousematesForm from "../components/NewTransactionForm/TransactionHousematesForm";

import RBSheet from "react-native-raw-bottom-sheet";

const NewTransactionScreen = ({
  navigation,
  modalVisible,
  setModalVisible,
}) => {
  const refRBSheet = useRef();
  // Context State
  const { state, getHousemates } = useContext(HousemateContext);
  const { addTransaction } = useContext(TransactionContext);

  // Initialize housemates
  useEffect(() => {
    getHousemates();
    //refRBSheet.current.open();
  }, []);

  // Local State
  const [transaction, setTransaction] = useState({
    title: "",
    amount: 0,
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

  const [currentScreen, setCurrentScreen] = useState(0);
  const maxScreenInd = 2;

  const next = (value) => {
    const nextScreen = Math.min(currentScreen + 1, maxScreenInd);
    setCurrentScreen(nextScreen);
    switch (currentScreen) {
      case 0: {
        setTransaction({ ...transaction, title: value });
        break;
      }
      case 1: {
        setTransaction({ ...transaction, amount: value });
        break;
      }
      case 2: {
        onSubmit(value);
      }
    }
  };

  const back = () => {
    console.log("back button pressed")
    switch (currentScreen) {
      case 0: {
        setModalVisible(false);
      }
    }
    const nextScreen = Math.max(currentScreen - 1, 0);
    setCurrentScreen(nextScreen);
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

  const onSubmit = async (selectedHousemates) => {
    const owner = state.currentUser;

    // Set Share
    // let ownersShare;
    // const updatedHousemates = selectedHousemates.map((housemate) => {
    //   const share = (
    //     Number(transaction.amount) / selectedHousemates.length
    //   ).toFixed(2);
    //   if (housemate._id === owner.id) {
    //     ownersShare = share;
    //   }
    //   return { ...housemate, share };
    // });

    const debtors = selectedHousemates.map((housemate) => {
      return {
        housemateId: housemate.housemateId,
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
    console.log("newTransaction");
    console.log(newTransaction);
    await addTransaction(newTransaction);
    clearForm();
    // navigation.navigate("UserHome");
    setCurrentScreen(0);
    setModalVisible(false);
  };

  return (
    // <View>
    //   <RBSheet
    //     ref={refRBSheet}
    //     closeOnDragDown={true}
    //     closeOnPressMask={false}
    //     customStyles={{
    //       draggableIcon: {
    //         backgroundColor: "#000",
    //       },
    //     }}
    //     height={2000}
    //   >
    //     <Button title="Previous" onPress={back} />
    //     {currentScreen == 0 ? (
    //       <TransactionTitleForm
    //         title={transaction.title}
    //         previous={back}
    //         next={next}
    //       />
    //     ) : currentScreen == 1 ? (
    //       <TransactionAmountForm
    //         title={transaction.title}
    //         amount={transaction.amount}
    //         previous={back}
    //         next={next}
    //       />
    //     ) : (
    //       <TransactionHousematesForm
    //         title={transaction.title}
    //         totalAmount={transaction.amount}
    //         previous={back}
    //         next={next}
    //       />
    //     )}
    //   </RBSheet>
    // </View>

    <Modal
      style={styles.modalBox}
      isOpen={modalVisible}
      onClosed={() => setModalVisible(false)}
    >
      <View style={styles.content}>
        <SheetHeader backAction={back} screenNum={currentScreen} />
        {currentScreen == 0 ? (
          <TransactionTitleForm
            title={transaction.title}
            previous={back}
            next={next}
          />
        ) : currentScreen == 1 ? (
          <TransactionAmountForm
            title={transaction.title}
            amount={transaction.amount}
            previous={back}
            next={next}
          />
        ) : (
          <TransactionHousematesForm
            title={transaction.title}
            totalAmount={transaction.amount}
            previous={back}
            next={next}
          />
        )}
      </View>
    </Modal>
  );
};

NewTransactionScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
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
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    
  },
  modalBox: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "transparent",
  },
  content: {
    height: 400,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.BACKDROP_PURPLE,
    width: "100%",
  },
});

export default NewTransactionScreen;
