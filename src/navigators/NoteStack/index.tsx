import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NotePage from "pages/NotePage";
import NewNotePage from "pages/NewNotePage";
import NoteContentPage from "pages/NoteContentPage";
import { shallowEqual, useSelector } from "react-redux";
const NoteStack = createStackNavigator();

const NoteStackNavigator = () => {
  const { isLoggedIn }: any = useSelector(
    (state: any) => state.user,
    shallowEqual
  );
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
      {isLoggedIn && (
        <NoteStack.Screen
          name={"NewNotePage"}
          component={NewNotePage}
          options={{ animationEnabled: false, gestureEnabled: false }}
          initialParams={{ title: "" }}
        />
      )}
      {isLoggedIn && (
        <NoteStack.Screen
          name={"NoteContentPage"}
          component={NoteContentPage}
          options={{ animationEnabled: false, gestureEnabled: false }}
        />
      )}
    </NoteStack.Navigator>
  );
};

export default NoteStackNavigator;
