import createDataContext from "./createDataContext";
import maisonApi from "../api/maison";

const transactionReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: action.payload };
    case "GET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload.transactions,
        housemateDebts: action.payload.housemateDebts,
      };
    case "CLEAR_TRANSACTIONS":
      return { transactions: [] };
    default:
      return state;
  }
};

const addTransaction = (dispatch) => async (transaction) => {
  const transactionId = await maisonApi.post("/transactions", transaction);
  dispatch({ type: "ADD_TRANSACTION", payload: transactionId.data });
};

const getTransactions = (dispatch) => async (currentId, housemateId) => {
  dispatch({ type: "CLEAR_TRANSACTIONS" });
  const transactions = await maisonApi.get("/transactions", {
    params: { currentId, housemateId },
  });
  const housemateDebts = await maisonApi.get("/updatedebts", {
    params: { currentId },
  });
  dispatch({
    type: "GET_TRANSACTIONS",
    payload: {
      transactions: transactions.data,
      housemateDebts: housemateDebts.data,
    },
  });
};

const payTransaction = (dispatch) => async (id) => {
  maisonApi.put("/transactions", { _id: id });
};


export const { Context, Provider } = createDataContext(
  transactionReducer,
  {
    addTransaction,
    getTransactions,
    payTransaction
  },
  [{ housemateDebts: [], transactions: [] }]
);
