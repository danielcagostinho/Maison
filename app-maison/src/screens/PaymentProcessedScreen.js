// React Imports
import React, { useContext, useEffect, useState } from "react";

// React Native Imports
import { withNavigation } from "react-navigation";

// Context Imports
import { Context as TransactionContext } from "../context/TransactionContext";
import { Context as HousemateContext } from "../context/HousemateContext";

// Component Imports
import {
    View,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import Modal from "react-native-modalbox";
import StyledText from "../components/StyledText";
import StyledButton from "../components/StyledButton";
import ConfettiCannon from 'react-native-confetti-cannon';
import colors from "../constants/colors";

const SettleUpScreen = ({ setModalVisible, modalVisible, otherUser, otherUserDebt, next }) => {
    // useState
    const [dataLoaded, setDataLoaded] = useState(false);

    // useContext
    const {
        state: { housemateDebts, transactions },
        getTransactions,
    } = useContext(TransactionContext);
    const {
        state: { currentUser },
    } = useContext(HousemateContext);

    let housemateDebt;
    if (dataLoaded) {
        for (let i = 0; i < housemateDebts.length; i++) {
            if (housemateDebts[i].housemateId == otherUser._id) {
                housemateDebt = housemateDebts[i];
            }
        }
        let debts = [];
        housemateDebt.transactions.map((transaction) => {
            if (currentUser.id === housemateDebt.housemateId) {
                transaction.debtors.forEach((debtor) => {
                    if (transaction.ownerId == debtor.housemateId) {
                    } else if (currentUser.id == debtor.housemateId) {
                    }
                });
            } else {
            }
            debts.push({
                ownerId: transaction.ownerId,
                share: 0,
                title: transaction.title,
            });
        });
    }

    useEffect(() => {
        getTransactions(currentUser.id, otherUser._id);
        setDataLoaded(true);
    }, []);

    return (
        <Modal
            style={styles.modalContainer}
            isOpen={modalVisible}
            entry="bottom"
            position="bottom"
            backdropPressToClose
            onClosed={() => setModalVisible(false)}
        >
            <ConfettiCannon
                count={120}
                origin={{ x: 150, y: 0 }}
                autoStartDelay={600}
                fadeOut={true}
                fallSpeed={2000}
                colors={[colors.PRIMARY]}
            />
            <View style={styles.contentContainer}>
                <Image
                    source={{ uri: otherUser.avatarURL }}
                    style={styles.avatar}
                />

                <StyledText style={styles.paymentAmount}>
                    {"$" + Number(Math.abs(otherUserDebt)).toFixed(2)}
                </StyledText>
                <StyledText style={styles.paymentAmountText}>
                    {"sent to " + otherUser.name.firstName}
                </StyledText>
            </View>
            <View style={styles.payContainer}>
                <View style={styles.okButtonContainer}>
                    <StyledButton
                        size="lg"
                        variant="dark"
                        title={"OK"}
                        buttonAction={() => setModalVisible(false)}
                    />
                </View>
            </View>
        </Modal>
    );
};

SettleUpScreen.navigationOptions = () => {
    return {
        header: () => false,
    };
};

const styles = StyleSheet.create({
    modalContainer: {
        overflow: "hidden",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "#FFF",
        marginTop: 40,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalBackground: {
        backgroundColor: "#FFF",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80%"
    },
    header: {
        margin: 16,
    },
    cancelContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    contentContainer: {
        // backgroundColor: "#FFF",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80%"
    },
    debtListTitle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    debtListContainer: {
        marginTop: 12,
    },
    payContainer: {
        paddingBottom: 40,
    },
    titleText: {
        fontFamily: "ProductSansBold",
        fontSize: 28,
    },
    housemateName: {
        color: colors.PRIMARY,
        fontSize: 28,
        fontFamily: "ProductSansBold",
    },
    avatar: {
        borderRadius: 50,
        height: 100,
        width: 100,
        marginRight: 6,
    },
    subtitleText: {
        fontFamily: "ProductSansBold",
        fontSize: 17,
        letterSpacing: -0.41,
        marginLeft: 6,
    },
    owedAmount: {
        fontSize: 17,
        letterSpacing: -0.41,
    },
    debtTitle: {
        color: "rgba(0,0,0,0.5)",
        letterSpacing: -0.41,
        fontSize: 13,
    },
    listRow: {
        marginLeft: 40,
        height: 60,
        justifyContent: "center",
        borderBottomColor: colors.LIST_BORDER,
        borderBottomWidth: 1,
    },
    paymentAmount: {
        color: colors.PRIMARY,
        fontSize: 28,
        fontFamily: "ProductSansBold",
        margin: 0,
        padding: 0,
        marginTop: 20
    },
    paymentAmountText: {
        color: colors.PRIMARY,
        fontSize: 28,
        fontFamily: "ProductSansBold",
        margin: 0,
        padding: 0,
    },
    
    okButtonContainer: {
        padding: 16,
        paddingTop: 0,
        backgroundColor: "#FFF",
        flexDirection: "column",
    }
});

export default withNavigation(SettleUpScreen);
