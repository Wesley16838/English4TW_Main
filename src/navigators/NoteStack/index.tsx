import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NotePage from "pages/NotePage";
import NewNotePage from "pages/NewNotePage";
import NoteContentPage from "pages/NoteContentPage";
const NoteStack = createStackNavigator();

const NoteStackNavigator = () => {
  return (
    <NoteStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="NotePage"
    >
      <NoteStack.Screen
        name={"NotePage"}
        component={NotePage}
        options={{ animationEnabled: false, gestureEnabled: false }}
      />
      <NoteStack.Screen
        name={"NewNotePage"}
        component={NewNotePage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ title: "" }}
      />
      <NoteStack.Screen
        name={"NoteContentPage"}
        component={NoteContentPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
      />
    </NoteStack.Navigator>
  );
};

export default NoteStackNavigator;
