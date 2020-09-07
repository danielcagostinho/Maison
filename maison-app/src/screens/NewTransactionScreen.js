import React, { useState, useContext, useEffect } from "react";

import { Context as HousemateContext } from "../context/HousemateContext";
import { Context as TransactionContext } from "../context/TransactionContext";

import { View, StyleSheet } from "react-native";
import Modal from "react-native-modalbox";
import SheetHeader from "../components/SheetHeader";
import colors from "../constants/colors";

import TransactionTitleForm from "../components/NewTransactionForm/TransactionTitleForm";
import TransactionAmountForm from "../components/NewTransactionForm/TransactionAmountForm";
import TransactionHousematesForm from "../components/NewTransactionForm/TransactionHousematesForm";
import TransactionComplete from '../components/NewTransactionForm/TransactionComplete';


const NewTransactionScreen = ({
  navigation,
  modalVisible,
  setModalVisible,
  currentUser
}) => {
  // Context State
  const { state, getHousemates } = useContext(HousemateContext);
  const { addTransaction } = useContext(TransactionContext);
  const [currentScreen, setCurrentScreen] = useState(0);
  // Initialize housemates
  useEffect(() => {
    getHousemates();
  }, [currentScreen]);

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

  const maxScreenInd = 3;

  const next = (value) => {
    console.log(currentScreen)
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
        break;
      }
      case 3: {
        close();
        break;
      }
    }
  };

  const back = () => {
    switch (currentScreen) {
      case 0: {
        console.log('[Back] closeModal')
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
      debtors: debtors
    };
    await setTransaction(newTransaction)

    await addTransaction(newTransaction);
    
  };

  const getAvatars = () => {
    let avatars =[];
    transaction.debtors.forEach(debtor => {
      housemates.forEach(housemate => {
        if (housemate._id == debtor.housemateId){
          avatars.push({housemateId: housemate._id, name: housemate.name.displayName, avatarURL: housemate.avatarURL })
        }
      })
    })

    return avatars
    
  }

  const close = () => {
    clearForm();
    setCurrentScreen(0);
    console.log('[close] closeModal')
    setModalVisible(false);
  }

  return (
    <Modal
      style={styles.modalBox}
      isOpen={modalVisible}
      entry="bottom"
      position="bottom"
      backdropPressToClose
      onClosed={() => setModalVisible(false)}
    >
      {currentScreen == 0 ? (
        <View style={styles.content}>
          <SheetHeader backAction={back} screenNum={currentScreen} cancelAction={close}/>
          <TransactionTitleForm
            title={transaction.title}
            previous={back}
            next={next}
          />
        </View>
      ) : currentScreen == 1 ? (
        <View style={styles.content}>
          <SheetHeader backAction={back} screenNum={currentScreen} cancelAction={close}/>
          <TransactionAmountForm
            title={transaction.title}
            amount={transaction.amount}
            previous={back}
            next={next}
          />
        </View>
      ) : currentScreen == 2 ? (
        <View style={styles.contentLast}>
          <SheetHeader backAction={back} screenNum={currentScreen} cancelAction={close}/>
          <TransactionHousematesForm
            title={transaction.title}
            totalAmount={transaction.amount}
            next={next}
          />
        </View>
      ) : (
        <View style={styles.contentLast}>
          <TransactionComplete
            closeAction={close}
            housemates={getAvatars()}
            currentUser={currentUser}
          />
        </View>
      )}
    </Modal>
  );
};

NewTransactionScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  modalBox: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    backgroundColor: "transparent",
    flex: 1,
  },
  content: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.BACKDROP_PURPLE,
    width: "100%",
    marginTop: 44,
  },
  contentLast: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.BACKDROP_PURPLE,
    width: "100%",
    flex: 1,
    marginTop: 44
  },
});

export default NewTransactionScreen;
