import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DictionaryPage from "pages/DictionaryPage";
import SavedWordPage from "pages/SavedWordPage";
import WordDetailPage from "pages/WordDetailPage";
import WordComparePage from "pages/WordComparePage";
import { shallowEqual, useSelector } from "react-redux";
const DictionaryStack = createStackNavigator();

const DictionaryStackNavigator = () => {
  const {isLoggedIn}: any = useSelector(
    (state: any) => state.user,
    shallowEqual
  );
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
      {isLoggedIn && <DictionaryStack.Screen
        name={"SavedWordPage"}
        component={SavedWordPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
      />}
      
      {isLoggedIn && <DictionaryStack.Screen
        name={"WordDetailPage"}
        component={WordDetailPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ word: "" }}
      />}
      {isLoggedIn && <DictionaryStack.Screen
        name={"WordComparePage"}
        component={WordComparePage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ first: "", second: "" }}
      />}
    </DictionaryStack.Navigator>
  );
};

export default DictionaryStackNavigator;
