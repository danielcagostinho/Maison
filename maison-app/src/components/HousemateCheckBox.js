import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native'
import CheckBox from '@react-native-community/checkbox';

const HousemateCheckBox = ({name}) => {
  const [selected, setSelected] = useState(false);

  const isSelected = () => {
    return selected;
  }

  return ( 
    <View style={styles.card}>
      <Text style={styles.label}>{name}</Text>
      <CheckBox 
        value={selected} 
        onChange={() => selected ? setSelected(false): setSelected(true)}/>
    </View>
   );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
  },
})

 
export default HousemateCheckBox;