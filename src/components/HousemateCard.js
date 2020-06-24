import React, {useState} from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const HousemateCard = ({housemate, last, top, isNew}) => {
    
    let [selected, setSelected] = useState(false);
    
    let cardStyle= !selected ? styles.card : styles.selectedCard;
   
    let cardStyles = [cardStyle, top ? styles.topCard : styles.notTopCard, last ? styles.lastCard : styles.notLastCard];

    
    let amountStyle = [styles.amountTextStyle];
    switch(housemate.owed.status) {
        case 'is owed':
            amountStyle = [...amountStyle, styles.isOwed];
            break;
        case 'owes you':
            amountStyle = [...amountStyle, styles.owesYou];
            break;
        case 'we good':
            amountStyle = [...amountStyle, styles.good];
            break;
        default:
            break;
    }
    const status = isNew ? null : <Text style={styles.status}>{housemate.owed.status}</Text>
    const amount = ( isNew ? 
        <TextInput 
            style={{color: '#4900A7', fontSize: 17}} 
            placeholder="$00.00" 
        /> : 
        <Text style={amountStyle}>${housemate.owed.amount}</Text>
        );
    return ( 
        <TouchableOpacity onPress={() => setSelected(!selected)} style={cardStyles}>
            <View style={styles.displayPic}></View>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{housemate.name}</Text>
                {status}
            </View>
            {amount}
        </TouchableOpacity>
     );
}

const styles = StyleSheet.create({
    card : {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        borderRadius: 16,
        height: 176,
        flex: 1/2,
        alignItems: 'center',
    },
    selectedCard: {
        borderRadius: 16,
        flex: 1/2,
        height: 176,
        backgroundColor: '#D1CCED',
        alignItems: 'center',
    },
    topCard: {
        marginTop: 0
    },
    notTopCard: {
        marginTop: 8
    },
    notLastCard:{
        margin: 8,
    },
    lastCard: {
        marginLeft: 8,
        marginBottom: 8,
        marginRight: 24,
    },
    displayPic:{
        width: 60,
        height: 60,
        borderRadius: 50,
        borderColor: 'red',
        borderWidth: 1,
        marginTop: 16,
        marginBottom: 8
    },
    name: {
        fontSize: 15,
        textAlign: "center",
    },
    status: {
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center'
    },
    textContainer: {
        // borderColor: 'red',
        // borderWidth: 1
    },
    amountTextStyle: {
        fontSize: 17,
        fontWeight: 'bold',
        margin: 16,
    },
    isOwed: {
        color: '#DC0344'
    },
    owesYou: {
        color: '#00A469'
    },
    good: {
        color: 'rgba(0,0,0,0.5)'
    },

})

 
export default HousemateCard;