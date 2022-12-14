import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "pages/HomePage";
import SentenceAnalysisPage from "pages/SentenceAnalysisPage";
import WordComparePage from "pages/WordComparePage";
import WordDetailPage from "pages/WordDetailPage";
import SentenceExamplesPage from "pages/SentenceExamplesPage";
import SplashPage from "pages/SplashPage";
import { shallowEqual, useSelector } from "react-redux";
const HomeStack = createStackNavigator();
const forFade = ({ current }: { current: any }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});
const HomeStackNavigator = () => {
  const { isLoggedIn }: any = useSelector(
    (state: any) => state.user,
    shallowEqual
  );
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="SplashPage"
    >
      <HomeStack.Screen
        name={"SplashPage"}
        component={SplashPage}
        options={{
          gestureEnabled: false,
        }}
      />
      <HomeStack.Screen
        name={"HomePage"}
        component={HomePage}
        options={{ animationEnabled: false, gestureEnabled: false }}
      />
      {isLoggedIn && (
        <HomeStack.Screen
          name={"SentenceAnalysisPage"}
          component={SentenceAnalysisPage}
          options={{ cardStyleInterpolator: forFade, gestureEnabled: false }}
        />
      )}
      {isLoggedIn && (
        <HomeStack.Screen
          name={"WordComparePage"}
          component={WordComparePage}
          options={{ cardStyleInterpolator: forFade, gestureEnabled: false }}
          initialParams={{ first: "", second: "" }}
        />
      )}
      {isLoggedIn && (
        <HomeStack.Screen
          name={"SentenceExamplesPage"}
          component={SentenceExamplesPage}
          options={{ cardStyleInterpolator: forFade, gestureEnabled: false }}
          initialParams={{ sentence: "" }}
        />
      )}
      {isLoggedIn && (
        <HomeStack.Screen
          name={"WordDetailPage"}
          component={WordDetailPage}
          options={{ animationEnabled: false, gestureEnabled: false }}
          initialParams={{ word: "" }}
        />
      )}
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
