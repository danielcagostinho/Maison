import createDataContext from './createDataContext';
import maisonApi from '../api/maison';
const housemateReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_HOUSEMATE':
            return {...state, housemates: [...state.housemates, action.payload]};
        case 'GET_HOUSEMATES':
            return {...state, housemates: action.payload};
        case 'SET_USER':
            return {...state, currentUser:{displayName: action.payload.displayName, id: action.payload.id}};
        default:
            return state;
    }
}

const addHousemate = dispatch => async ({firstName, lastName}) => {
    const displayName = firstName.concat(" " + lastName.substring(0,1)+ ".")
    await maisonApi.post('/housemates', {firstName, lastName, displayName});
    dispatch({type: "ADD_HOUSEMATE", payload: {firstName, lastName, displayName}})
}

const getHousemates = dispatch => async () => {
    const response = await maisonApi.get('/housemates');
    dispatch({type: "GET_HOUSEMATES", payload: response.data})
}

const setCurrentUser = dispatch => async (id, displayName) => {
    dispatch({type: "SET_USER", payload: { id, displayName }})
}


export const { Context, Provider} = createDataContext(
    housemateReducer,
    { addHousemate, getHousemates, setCurrentUser},
    {housemates: [], currentUser: null}
) 