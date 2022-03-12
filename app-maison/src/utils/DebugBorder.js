import React from 'react';

import { View, StyleSheet } from 'react-native';

const DebugBorder = ({children, color}) => {
  return ( 
    <View style={{borderWidth: 1, borderColor: color}}>
      {children}
    </View>
   );
}

 
export default DebugBorder;