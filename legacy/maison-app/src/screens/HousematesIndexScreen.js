import React, { useContext } from "react";
import { withNavigation, NavigationEvents } from "react-navigation";

import { Context as HousemateContext } from "../context/HousemateContext";

import { View, FlatList, Button } from "react-native";
import StyledText from '../components/StyledText';

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
      <StyledText
        style={{
          fontSize: 18,
          textAlign: "center",
          margin: 20,
        }}
      >
        Select a housemate:
      </StyledText>
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
              <StyledText style={{ textAlign: "center" }}>
                {item.name.displayName}
              </StyledText>
              <Button
                title="Select User"
                onPress={() => {
                  setCurrentUser(item._id, item.name.displayName, item.avatarURL);
                  navigation.navigate("Signin");
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
