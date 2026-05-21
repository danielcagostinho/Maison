import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { Text, ListItem, Left, Body, Icon, Right, Title } from "native-base";

const listData = [{ name: "Pending", header: true },
{ name: "Interstellar", header: false },
{ name: "Dark Knight", header: false },
{ name: "Pop", header: false },
{ name: "Pulp Fiction", header: false },
{ name: "Burning Train", header: false },
{ name: "Past Transactions", header: true },
{ name: "Adams", header: false },
{ name: "Nirvana", header: false },
{ name: "Amrit Maan", header: false },
{ name: "Oye Hoye", header: false },
{ name: "Eminem", header: false },
{ name: "Places", header: true },
{ name: "Jordan", header: false },
{ name: "Punjab", header: false },
{ name: "Ludhiana", header: false },
{ name: "Jamshedpur", header: false },
{ name: "India", header: false },
{ name: "People", header: true },
{ name: "Jazzy", header: false },
{ name: "Appie", header: false },
{ name: "Baby", header: false },
{ name: "Sunil", header: false },
{ name: "Arrow", header: false },
{ name: "Things", header: true },
{ name: "table", header: false },
{ name: "chair", header: false },
{ name: "fan", header: false },
{ name: "cup", header: false },
{ name: "cube", header: false }]
const StickyList = ({dataToDisplay}) =>  {
  console.log(dataToDisplay)
  const [data, setData] = useState(dataToDisplay);
  const [stickyHeaderIndices, setStickyHeaderIndices]= useState([0]);
  useEffect(() => { 
    var arr = [];
    data.map(obj => {
      if (obj.header) {
        arr.push(data.indexOf(obj));
      }
    });
    arr.push(0);
    setStickyHeaderIndices(arr);
  },[])
  
  const renderItem = ({ item }) => {
    if (item.header) {
      return (
        <ListItem itemDivider style={{ marginLeft: 0 , paddingLeft: 0}}>
          <Body>
            <Text>{item.title}</Text>
          </Body>
        </ListItem>
      );
    } else if (!item.header) {
      return (
        <ListItem style={{ marginLeft: 0 }}>
          <Body>
            <Text>{item.title}</Text>
          </Body>
        </ListItem>
      );
    }
  };
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.name}
        stickyHeaderIndices={stickyHeaderIndices}
      />
    );
  
}

export default StickyList;
