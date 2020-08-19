import React, { useState, useEffect } from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import * as Font from "expo-font";

import colors from './src/constants/colors';

import { Provider as TransactionProvider } from "./src/context/TransactionContext";
import { Provider as HousemateProvider } from "./src/context/HousemateContext";

import SigninScreen from "./src/screens/SigninScreen";
import HousematesIndexScreen from "./src/screens/HousematesIndexScreen";
import NewTransactionScreen from "./src/screens/NewTransactionScreen";
import TransactionsIndexScreen from "./src/screens/TransactionsIndexScreen";
import ShowTransactionScreen from "./src/screens/ShowTransactionScreen";
import NewHousemateScreen from "./src/screens/NewHousemateScreen";
import UserHomeScreen from "./src/screens/UserHomeScreen";
import ActivityScreen from "./src/screens/ActivityScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RecurringScreen from "./src/screens/RecurringScreen";
import UserTransactionsIndexScreen from "./src/screens/UserTransactionsIndexScreen";
import SettleUpScreen from "./src/screens/SettleUpScreen";
import { Image } from "react-native";

import HomeTabIcon from "../maison-app/assets/imgs/nav/home-nav.png";
import ActivityTabIcon from "../maison-app/assets/imgs/nav/activity-nav.png";
import RecurringTabIcon from "../maison-app/assets/imgs/nav/recurring-nav.png";
import ProfileTabIcon from "../maison-app/assets/imgs/nav/profile-nav.png";

const homeFlow = createSwitchNavigator({
  UserHome: UserHomeScreen,
  NewTransaction: NewTransactionScreen,
  TransactionsIndex: TransactionsIndexScreen,
  UserTransactionsIndex: UserTransactionsIndexScreen,
  ShowTransaction: ShowTransactionScreen,
  SettleUp: SettleUpScreen,
  
});

const switchNavigator = createSwitchNavigator(
  {
    mainFlow: createBottomTabNavigator({
      Home: {
        screen: homeFlow,
        navigationOptions: {
          title: "Home",
          tabBarIcon: (
            <Image source={HomeTabIcon} style={{ height: 28, width: 28 }} />
          ),
          tabBarOptions: {
            activeTintColor: colors.PRIMARY,
            inactiveTintColor: colors.LIGHT_GRAY,
          },
        },
      },
      Activity: {
        screen: ActivityScreen,
        navigationOptions: {
          title: "Activity",
          tabBarIcon: (
            <Image source={ActivityTabIcon} style={{ height: 28, width: 28 }} />
          ),
          tabBarOptions: {
            activeTintColor: colors.PRIMARY,
            inactiveTintColor: colors.LIGHT_GRAY,
          },
        },
      },
      Recurring: {
        screen: RecurringScreen,
        navigationOptions: {
          title: "Recurring",
          tabBarIcon: (
            <Image
              source={RecurringTabIcon}
              style={{ height: 28, width: 28 }}
            />
          ),
          tabBarOptions: {
            activeTintColor: colors.PRIMARY,
            inactiveTintColor: colors.LIGHT_GRAY,
          },
        },
      },
      Profile: {
        screen: ProfileScreen,
        navigationOptions: {
          title: "Profile",
          tabBarIcon: (
            <Image source={ProfileTabIcon} style={{ height: 28, width: 28 }} />
          ),
          tabBarOptions: {
            activeTintColor: colors.PRIMARY,
            inactiveTintColor: colors.LIGHT_GRAY,
          },
        },
      },
    }),
    HousematesIndex: HousematesIndexScreen,
    NewHousemate: NewHousemateScreen,
    Signin: SigninScreen
  },
  {
    initialRouteName: "HousematesIndex",
    defaultNavigationOptions: {
      title: "Maison",
    },
  }
);
const App = createAppContainer(switchNavigator);

export default () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loading = async () => {
      await Font.loadAsync({
        ProductSansRegular: require("./assets/fonts/ProductSansRegular.ttf"),
        ProductSansBold: require("./assets/fonts/ProductSansBold.ttf"),
        ProductSansItalic: require("./assets/fonts/ProductSansItalic.ttf"),
        ProductSansBoldItalic: require("./assets/fonts/ProductSansBoldItalic.ttf"),
      });
      setFontLoaded(true);
    };
    loading();
  }, []);

  return (
    <HousemateProvider>
      <TransactionProvider>
        {fontLoaded ? <App /> : null} 
      </TransactionProvider>
    </HousemateProvider>
  );
};
