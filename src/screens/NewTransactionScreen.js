import React, {useState, useContext, useEffect} from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { Context } from '../context/MaisonContext';
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const NewTransactionScreen = (props) => {
    const {state, addTransaction, getHousemates, getCurrentUser} = useContext(Context);
    useEffect(()=> {
        getHousemates();
        getCurrentUser();
    }, []);

    const [transaction, setTransaction] = useState({
        id: Math.floor(Math.random() * 99999),
        name:'', 
        amount: '', 
        date: getDateString(), 
        housemates: [],
        isPaid: false,
        owner: null
    });

    const [housemates, setHousemates] = useState(
        state.housemates.map((housemate) => {
            return {...housemate, isSelected: housemate.id === state.currentUser.id, share: 0}
        })
    )
    
    const clearForm = () => {
        setTransaction({id: Math.floor(Math.random() * 99999), name:'', total:'', date: getDateString(), housemates:[],owner: null, isPaid: false})
        setHousemates(housemates.map((housemate) => {
            return {...housemate,   isSelected: housemate.id === state.currentUser.id, share: 0};
        }));
    }

    const setSelected = (index) => {
        setHousemates(housemates.map((housemate, i) => {
            return {...housemate, isSelected: (i === index ? !housemate.isSelected : housemate.isSelected)}
        }));
    }
    
    const onSubmit = () => {
        console.log("[NewTransactionScreen] Submitting...")
        const selectedHousemates = housemates.filter((housemate)=>{
            return housemate.isSelected
        });

        // Set Share
        const updatedHousemates = selectedHousemates.map(housemate => {
            const share = (Number(transaction.total)/selectedHousemates.length).toFixed(2);
            return {...housemate, share}
        });

        const owner = state.currentUser;
        
        const newTransaction = {...transaction}
        newTransaction.housemates = updatedHousemates;
        newTransaction.owner = owner;
        setTransaction(newTransaction)
        addTransaction({payload: newTransaction});
        clearForm();
        props.navigation.navigate("TransactionsIndex");
    }

    return ( 
        <View>
            <Text style={styles.textStyle}>What is this for?</Text>
            <TextInput 
                style={styles.inputStyle} 
                placeholder="Dinner, groceries, rent, etc."
                value={transaction.name}
                onChangeText={(newText) => {
                    let newTransaction = {...transaction};
                    newTransaction.name = newText;
                    setTransaction(newTransaction);
                }}
            />
            <Text style={styles.textStyle}>How much was lunch?</Text>
            <TextInput 
                style={styles.inputStyle} 
                value={transaction.total}
                placeholder="$00.00"
                onChangeText={(newText) => {
                    let newTransaction = {...transaction};
                    newTransaction.total = newText;
                    setTransaction(newTransaction);
                }}
            />
            <Text style={styles.textStyle}>Splitting amount with:</Text>
            <FlatList
                style={styles.list}
                data={housemates}
                keyExtractor={(item) => item.name }
                numColumns={2}
                renderItem={({item, index}) => {
                    return (
                    // <HousemateCard isNew={true} last={(index == housemates.length-1)} housemate={item}/>
                        <View style={styles.card}>
                            <Text style={styles.label}>{item.name}</Text>
                            <CheckBox value={item.isSelected} disabled={item.id === state.currentUser.id} conChange={() => setSelected(index)}/>
                        </View>
                    )
                }}
            /> 
            <Button 
                onPress={() => onSubmit()} 
                title="Continue"
            />
        </View>
     );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
    },
    textStyle : {
        fontSize: 28
    },
    inputStyle: {
        fontSize: 28,
        padding: 4,
        backgroundColor: 'white'
    },
    list: {
        marginHorizontal: 8,
    },
})

const getDateString = () => {
    const today = new Date();
    let day = String(today.getDate());
    let month = today.getMonth();
    let year = today.getFullYear();
    let date = `${MONTHS[month]} ${day}, ${year}`;
    return date;
} 

export default NewTransactionScreen;