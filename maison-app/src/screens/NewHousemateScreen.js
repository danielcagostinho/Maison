import React, { useState, useContext } from "react";
import { Context as HousemateContext } from "../context/HousemateContext";
import { Text, View, StyleSheet, TextInput, Button } from "react-native";

const NewHousemateScreen = ({ navigation }) => {
  const { addHousemate } = useContext(HousemateContext);
  const [housemate, setHousemate] = useState({
    firstName: "",
    lastName: "",
    avatarURL: "",
  });
  return (
    <View>
      <Text style={styles.textStyle}>First Name</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter your first name"
        value={housemate.firstName}
        onChangeText={(newText) => {
          setHousemate({ ...housemate, firstName: newText });
        }}
      />
      <Text style={styles.textStyle}>Last Name</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter your last name"
        value={housemate.lastName}
        onChangeText={(newText) => {
          setHousemate({ ...housemate, lastName: newText });
        }}
      />
      <Text style={styles.textStyle}>Avatar Url</Text>
      <TextInput
        style={styles.inputStyle}
        placeholder="Avatar Url"
        value={housemate.avatarURL}
        onChangeText={(newText) => {
          setHousemate({ ...housemate, avatarURL: newText });
        }}
      />
      <Button
        onPress={() => {
          addHousemate(housemate);
          navigation.navigate("HousematesIndex");
        }}
        title="Add New Housemate"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 28,
  },
  inputStyle: {
    fontSize: 28,
    padding: 4,
    backgroundColor: "white",
  },
});

export default NewHousemateScreen;
