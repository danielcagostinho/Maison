import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from './StyledText';
import CheckBox from '@react-native-community/checkbox';

const HousemateCheckBox = ({name}) => {
  const [selected, setSelected] = useState(false);

  const isSelected = () => {
    return selected;
  }

  return ( 
    <View style={styles.card}>
      <StyledText style={styles.label}>{name}</StyledText>
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