import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DictionaryPage from "pages/DictionaryPage";
import SavedWordPage from "pages/SavedWordPage";
import WordDetailPage from "pages/WordDetailPage";
import WordComparePage from "pages/WordComparePage";
const DictionaryStack = createStackNavigator();

const DictionaryStackNavigator = () => {
  return (
    <DictionaryStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="DictionaryPage"
    >
      <DictionaryStack.Screen
        name={"DictionaryPage"}
        component={DictionaryPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
      />
      <DictionaryStack.Screen
        name={"SavedWordPage"}
        component={SavedWordPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
      />
      <DictionaryStack.Screen
        name={"WordDetailPage"}
        component={WordDetailPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ word: "" }}
      />
      <DictionaryStack.Screen
        name={"WordComparePage"}
        component={WordComparePage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ first: "", second: "" }}
      />
    </DictionaryStack.Navigator>
  );
};

export default DictionaryStackNavigator;
