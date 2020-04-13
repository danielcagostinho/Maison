import React from 'react';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import HousemateCard from '../HousemateCard/HousemateCard';
import { useFonts } from '@use-expo/font';
const gridList = (props) => {
    let [fontsLoaded] = useFonts({
        'Product-Sans': require('../../assets/fonts/Product-Sans-Regular.ttf'),
        'Product-Sans-Bold': require('../../assets/fonts/Product-Sans-Bold.ttf'),
      });
    return ( 
        <View style={styles.gridListContainer}>
            <FlatList style={styles.gridList} numColumns={2}
            data={props.items}
        contentContainerStyle = {{width: '100%', paddingHorizontal: 8}}
        columnWrapperStyle={{justifyContent:'space-between'}}
        renderItem={({item}) => {
            console.log(item);
            return <HousemateCard name={item.name} amount={item.amount} status={item.status}/>
        }}/>
        </View>
     );
}
 
export default gridList;

const styles = StyleSheet.create({
    gridList : {
        paddingTop: 0,
    },
    
});