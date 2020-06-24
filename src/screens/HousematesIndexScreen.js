import React, { useContext, useState, useEffect } from 'react';
import { withNavigation } from 'react-navigation';
import { Text, View, StyleSheet, FlatList, Button } from 'react-native';
import { Context } from '../context/MaisonContext';

const HousematesIndexScreen = ({navigation}) => {
    let { state, getHousemates, setCurrentUser } = useContext(Context);
    useEffect(() => {
        getHousemates();
    }, []);
    // const [housemates, setHousemates] = useState(
    //     state.housemates.map((housemate) => {
    //         return {
    //             ...housemate, 
    //             owed: {
    //                 status: Math.floor(Math.random() * 3) == 2 ? 'is owed' : 'owes you',
    //                 amount: Math.floor(Math.random()*9999)/100
    //             }
    //         }
    //     })
    // )
    return (
        <View>
            <Button title="Add New Housemate" onPress={()=>{navigation.navigate('NewHousemate')}} />
            <Text style={{fontWeight: 'bold', fontSize: 18, textAlign: 'center', margin: 20}}>Select a housemate:</Text>
                <FlatList
                    contentContainerStyle={{paddingBottom: 100}}
                    data={state.housemates}
                    numColumns={2}
                    keyExtractor={(housemate) => String(housemate.id)}
                    renderItem={({item}) => {
                        return (
                            <View style={{width: '40%', height: 100, margin: 14, borderWidth: 1, borderColor: 'black', borderRadius: 16, paddingVertical: 12,  paddingHorizontal: 20, flexDirection: 'column', justifyContent: 'space-around'}}>
                                <Text style={{textAlign: 'center'}}>{item.name}</Text>
                                <Button title="Select User" onPress={() => {
                                    setCurrentUser(item.id, item.name)
                                    navigation.navigate('UserHome')
                                }}/>
                            </View>  
                        )
                    }}
                />
        </View>
    )
}



 
export default withNavigation(HousematesIndexScreen);