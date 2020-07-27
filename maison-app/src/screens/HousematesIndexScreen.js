import React, { useContext } from "react";
import { withNavigation, NavigationEvents } from "react-navigation";

import { Context as HousemateContext } from "../context/HousemateContext";

import { Text, View, FlatList, Button } from "react-native";

const HousematesIndexScreen = ({ navigation }) => {
  let { state, getHousemates, setCurrentUser } = useContext(HousemateContext);
  return (
    <View>
      <NavigationEvents onWillFocus={getHousemates} />
      <Button
        title="Add New Housemate"
        onPress={() => {
          navigation.navigate("NewHousemate");
        }}
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
          textAlign: "center",
          margin: 20,
        }}
      >
        Select a housemate:
      </Text>
      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={state.housemates}
        numColumns={2}
        keyExtractor={(housemate) => housemate._id}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width: "40%",
                height: 100,
                margin: 14,
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 20,
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <Text style={{ textAlign: "center" }}>
                {item.name.displayName}
              </Text>
              <Button
                title="Select User"
                onPress={() => {
                  setCurrentUser(item._id, item.name.displayName);
                  navigation.navigate("UserHome");
                }}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default withNavigation(HousematesIndexScreen);
