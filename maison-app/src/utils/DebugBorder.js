import React from 'react';

import { View, StyleSheet } from 'react-native';

const DebugBorder = ({children}) => {
  return ( 
    <View style={styles.border}>
      {children}
    </View>
   );
}

const styles = StyleSheet.create({
  border: {
    borderColor: 'red',
    borderWidth: 1
  }
});
 
export default DebugBorder;