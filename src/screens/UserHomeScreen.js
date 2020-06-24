import React, { useContext, useState, useEffect } from 'react';
import HousemateCard from '../components/HousemateCard';
import { Context } from '../context/MaisonContext';

import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
const UserHomePage = ({navigation}) => {
  let { state, getHousemates, getCurrentUser} = useContext(Context);
    const [housemates, setHousemates] = useState(
        state.housemates.filter((housemate, i)=>{
          return housemate.id !== state.currentUser.id
        }).map((housemate) => {
            return {
                ...housemate, 
                owed: {
                    status: Math.floor(Math.random() * 3) == 2 ? 'is owed' : 'owes you',
                    amount: Math.floor(Math.random()*9999)/100
                }
            }
        })
    )

    // useEffect(() => {
    //   getCurrentUser();
    // }, [])
  console.log(`current user: ${state.currentUser.id}`)
  const houseName = state.currentUser.name;
  const owedAmount = 145.35;
  return ( 
    <View>
      <View style={styles.topSection}>
        <View style={styles.row}>
          <View style={{flexDirection: 'row', marginLeft: 16, alignItems: 'center'}}>
            <View style={styles.displayPic}></View>
            <Text style={styles.houseName}>{houseName}</Text>
          </View>
          <View style={styles.newBillButtonContainer}>
            <Button onPress={() => navigation.navigate('NewTransaction')} title="New Bill"/>
            <Button onPress={() => navigation.navigate('TransactionsIndex')} title="View Bills"/>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>You're owed</Text>
          <Text style={styles.statusText}>${owedAmount}</Text>
        </View>
        <Text style={{color: 'rgba(255,255,255,0.6)', margin: 16, fontSize: 16}}>Now all you gotta do is wait...</Text>
      </View>
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitle}>Housemates</Text>
      </View>
      <FlatList
        style={styles.list}
        data={housemates}
        keyExtractor={(housemate) => housemate.id}
        numColumns={2}
        renderItem={({item, index}) => {
            // return <HousemateCard isNew={false} top={index < 2} last={(index == housemates.length-1)} housemate={item}/>
            return <Text style={{width: '50%', height: 100}}>{item.name}</Text>
        }}
      />
    </View>
   );
}
const styles = StyleSheet.create({
  topSection: {
      backgroundColor: '#4900A7'
  },
  houseName: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 30,
      lineHeight: 30,
      marginLeft: 12,
      fontWeight: 'bold',
      // borderColor: 'red',
      // borderWidth: 1,
      marginVertical: 16,
  },
  row: {
      justifyContent: "space-between",
      flexDirection: 'row',
      alignItems: 'center',
      // borderWidth: 1,
      // borderColor: 'yellow'
  },
  list: {
      marginHorizontal: 8,
  },
  listTitle: {
      fontSize: 17,
      alignSelf: 'center',
      margin: 16,
      fontWeight: 'bold'
  },
  listTitleContainer: {
  },
  newBillButton: {
      width: 25
  },
  newBillButtonContainer: {
      width: 100,
      height: 100,
      marginRight: 24,
      flexDirection: 'column',
      justifyContent: 'space-around'
  },
  statusText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold'
  },
  displayPic:{
      width: 40,
      height: 40,
      borderRadius: 50,
      borderColor: 'white',
      borderWidth: 1
  },
  statusContainer: {
      // borderColor: 'green',
      // borderWidth: 1,
      margin: 16
  }
})
 
export default UserHomePage;