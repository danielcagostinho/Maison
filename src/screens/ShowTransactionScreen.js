import React, {useContext} from 'react';
import {Context} from '../context/MaisonContext';
import { Text, View, StyleSheet, FlatList, Button } from 'react-native';

const ShowTransactionScreen = ({navigation}) => {
  const { state, editTransaction } = useContext(Context);

  const transaction = state.transactions.find(
    (transaction) => transaction.id == navigation.getParam("id")
  );

  return (
    <View>
      <Text>{transaction.name}</Text>
      <Text>Owner: {transaction.owner.name}</Text>
      <Text>Housemates involved:</Text>
      <FlatList
        data={transaction.housemates}
        keyExtractor={(housemate) => housemate.id}
        renderItem={({item}) => {
          return (
            <View>
              <Text>{item.name}</Text>
              <Text>{item.share}</Text>
            </View>
          )
        }}
      />
      <Text>{(transaction.isPaid ? "PAID" : "NOT PAID")}</Text>
      <Button 
        title="Pay" 
        onPress={()=> {
          editTransaction(transaction.id, true)
          navigation.navigate("TransactionsIndex")
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  
})

 
export default ShowTransactionScreen;