import React, {useContext} from 'react';
import { withNavigation } from 'react-navigation';
import { Text, View, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { Context } from '../context/MaisonContext';
import Transaction from '../components/Transaction';

const TransactionsIndexScreen = ({navigation}) => {
    const {state, showTransaction} = useContext(Context);
    // const titleStyles = [styles.listTitle, (title==='Pending' ? {color: 'black'} : {color: 'gray'})];
    const titleStyles = [styles.listTitle];
    
    return ( 
        <View>
            <Button onPress={() => navigation.navigate('NewTransaction')} title="Add new transaction"/>
            <Text style={titleStyles}>Pending</Text>
            <FlatList
                data={state.transactions.filter((transaction) => !transaction.isPaid)}
                keyExtractor={(item)=>item.id}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate("ShowTransaction", { id: item.id })}>
                            <Transaction title="Pending" transaction={item}/>
                        </TouchableOpacity>
                    )
                }}
            />
            <Text style={titleStyles}>Past Transactions</Text>
            <FlatList
                data={state.transactions.filter((transaction) => transaction.isPaid)}
                keyExtractor={(item)=>item.id}
                renderItem={({item}) => {
                    //return <Transaction onPress={() => navigation.navigate("Show", { id: item.id })} title="Past Transactions" transaction={item}/>
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate("ShowTransaction", { id: item.id })}>
                            <Transaction title="Past Transactions" transaction={item}/>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
     );
}

const styles = StyleSheet.create({
    listTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginVertical: 10,
        marginHorizontal: 16 
    }
})

 
export default withNavigation(TransactionsIndexScreen);