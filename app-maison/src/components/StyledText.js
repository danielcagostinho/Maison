import React from 'react';

import { Text, StyleSheet} from 'react-native';

const StyledText = (props) => {
  const {style, ...rest}= props;
  return ( 
    <Text style={[styles.text, style]}>
      {rest.children}
    </Text>
   );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'ProductSansRegular'
  }
});
 
export default StyledText;