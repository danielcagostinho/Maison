import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Provider as TransactionProvider } from './src/context/TransactionContext';
import { Provider as HousemateProvider } from './src/context/HousemateContext';

import HousematesIndexScreen from './src/screens/HousematesIndexScreen';
import NewTransactionScreen from './src/screens/NewTransactionScreen';
import TransactionsIndexScreen from './src/screens/TransactionsIndexScreen';
import ShowTransactionScreen from './src/screens/ShowTransactionScreen';
import NewHousemateScreen from './src/screens/NewHousemateScreen';
import UserHomeScreen from './src/screens/UserHomeScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RecurringScreen from './src/screens/RecurringScreen';
import UserTransactionsIndexScreen from './src/screens/UserTransactionsIndexScreen';
import SettleUpScreen from './src/screens/SettleUpScreen';



const homeFlow = createStackNavigator({
  UserHome: UserHomeScreen,
  NewTransaction: NewTransactionScreen,
  TransactionsIndex: TransactionsIndexScreen,
  UserTransactionsIndex: UserTransactionsIndexScreen,
  ShowTransaction: ShowTransactionScreen,
  SettleUp: SettleUpScreen,
})
const switchNavigator = createSwitchNavigator({
  mainFlow: createBottomTabNavigator({
      Home: homeFlow,
      Activity: ActivityScreen,
      Recurring: RecurringScreen,
      Profile: ProfileScreen
    }),
    HousematesIndex: HousematesIndexScreen,
    NewHousemate: NewHousemateScreen,

  },{
      initialRouteName: 'HousematesIndex',
      defaultNavigationOptions : {
        title: 'Maison'
      }
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <HousemateProvider>
      <TransactionProvider>
          <App/>
      </TransactionProvider>
    </HousemateProvider>
  )
}