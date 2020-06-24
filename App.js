import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import HousematesIndexScreen from './src/screens/HousematesIndexScreen';
import NewTransactionScreen from './src/screens/NewTransactionScreen';
import TransactionsIndexScreen from './src/screens/TransactionsIndexScreen';
import ShowTransactionScreen from './src/screens/ShowTransactionScreen';
import NewHousemateScreen from './src/screens/NewHousemateScreen';
import UserHomeScreen from './src/screens/UserHomeScreen';
import { Provider } from './src/context/MaisonContext';

const navigator = createStackNavigator({
  HousematesIndex: HousematesIndexScreen,
  NewTransaction: NewTransactionScreen,
  TransactionsIndex: TransactionsIndexScreen,
  ShowTransaction: ShowTransactionScreen,
  NewHousemate: NewHousemateScreen,
  UserHome: UserHomeScreen,

},{
  initialRouteName: 'HousematesIndex',
  defaultNavigationOptions : {
    title: 'Maison'
  }
});

const App = createAppContainer(navigator);

export default () => {
  return <Provider><App/></Provider>
}