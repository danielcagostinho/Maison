import React, {useState, useContext} from 'react';
import { Context } from '../context/MaisonContext';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';

const NewHousemateScreen = ({navigation}) => {
  const {addHousemate} = useContext(Context);
  const [housemate, setHousemate] = useState({name: '', id: Math.floor(Math.random()*99999)});
  return ( 
    <View>
      <Text style={styles.textStyle}>Housemate Name</Text>
      <TextInput 
        style={styles.inputStyle}
        placeholder="Enter your name"
        value={housemate.name}
        onChangeText={(newText) => {
          setHousemate({...housemate, name: newText});
        }}
      />
        <Button 
            onPress={() => {
              console.log(housemate)
              addHousemate(housemate)
              navigation.navigate("HousematesIndex");
            }} 
            title="Add New Housemate"
        />
    </View>
   );
}

const styles = StyleSheet.create({
  textStyle : {
    fontSize: 28
},
inputStyle: {
    fontSize: 28,
    padding: 4,
    backgroundColor: 'white'
},
})

 
export default NewHousemateScreen;