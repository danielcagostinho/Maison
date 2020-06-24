import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Transaction = ({transaction, title, onPress}) => {
    const titleStyles = [styles.title, (title==='Pending' ? {fontWeight: 'bold'} : {fontWeight: 'normal'})];
    return (
        <View style={styles.row}>
            <View style={{flexDirection: 'row'}}>
                <View style={styles.displayPic}></View>
                <View style={{flexDirection: 'column', marginLeft: 12, justifyContent: 'space-between'}}>
                    <Text style={titleStyles}>{transaction.name} - {transaction.id}</Text>
                    <Text style={styles.date}>{transaction.date}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'column'}}>
                <Text style={styles.total}>${Number(transaction.total).toFixed(2)}</Text>
                <Text>owes You</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 17,
        lineHeight: 17
    },
    total: {
        fontSize: 17,
        color: 'red',
    },
    date: {
        fontSize: 13,
        lineHeight: 17,
        color: 'rgba(0,0,0,0.49)'
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(223,216,241,0.50)',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    displayPic:{
        width: 40,
        height: 40,
        borderRadius: 50,
        borderColor: 'blue',
        borderWidth: 1
    },
    textContainer: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    col : {
        flexDirection: "row"
    }
})

 
export default Transaction;