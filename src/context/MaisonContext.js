import createDataContext from './createDataContext';

const maisonReducer = (state, action) => {
    switch(action.type){
        case 'ADD_TRANSACTION':
            const transaction = action.payload.transaction.payload;
            return {...state, transactions: [...state.transactions, transaction]}
        case 'SHOW_TRANSACTION':
            console.log(action.payload.id);
            return state.transactions;
        case 'EDIT_TRANSACTION':
            let transactionToPay = state.transactions.find(
                (transactionToPay) => transactionToPay.id == action.payload.id
            )
            transactionToPay.isPaid = action.payload.isPaid;
            return {...state, transaction: {...state.transactions, transactionToPay}};
        case 'ADD_HOUSEMATE':
            const housemate = action.payload.housemate;
            return {...state, housemates: [...state.housemates, housemate]};
        case 'GET_HOUSEMATES':
            return state;
        case 'SET_USER':
            console.log(action.payload.id, action.payload.name)
            return {...state, currentUser:{name: action.payload.name, id: action.payload.id}};
        case 'GET_USER':
            return state;
        default:
            return state;
    }
}

const addTransaction = (dispatch) => {
    return (transaction) => {
        dispatch({type: 'ADD_TRANSACTION', payload: {transaction}})
    }
}

const showTransaction = (dispatch) => {
    return (id) => {
        dispatch({type: 'SHOW_TRANSACTION', payload: {id : id}})
    }
}

const editTransaction = (dispatch) => {
    return (id, isPaid) => {
        dispatch({type: 'EDIT_TRANSACTION', payload: {id, isPaid}})
    }
}

const addHousemate = (dispatch) => {
    return (housemate) => {
        dispatch({type: 'ADD_HOUSEMATE', payload: {housemate}})
    }
}

const getHousemates = (dispatch) => {
    return () => {
        dispatch({type: 'GET_HOUSEMATES'})
    }
}

const setCurrentUser = (dispatch) => {
    return (id, name) => {
        dispatch({type: 'SET_USER', payload: {id, name}})
    }
}

const getCurrentUser = (dispatch) => {
    return () => {
        dispatch({type: 'GET_USER'})
    }
}


export const { Context, Provider } = createDataContext( 
    maisonReducer, 
    {addTransaction, showTransaction, getHousemates, editTransaction, addHousemate, setCurrentUser, getCurrentUser}, 
    {housemates: [
        {
            name: 'John H.',
            id: 1,
        },
        {
            name: 'Billie E.',
            id: 2,
        },
        {
            name: 'Auden K.',
            id: 3,
        },
        {
            name: 'Bernard J.',
            id: 4,
        },
        {
            name: 'Daniel A.',
            id: 5,
        },
    ], transactions: [], currentUser: {id:'', name:''}});