import React from "react";
import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from 'react-query'
import { SafeAreaProvider } from "react-native-safe-area-context";
import store from "./src/store";
import Icon from "components/Icon/Icon";
import Navigator from "./src/navigators";
import Images from "./src/assets/images";
import { Colors } from "styles"
import Layout from "components/Layout";
import { DEVICE_WIDTH } from "pages/SplashPage";
import { RootSiblingParent } from 'react-native-root-siblings';

const Tab = createBottomTabNavigator();

export default function App() {
  const queryClient = new QueryClient()
  const getTabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = [
      "OrderHistoryPage",
      "SubscribePage",
      "PersonalProfilePage",
      "NewNotePage",
      "NoteContentPage",
      "SentenceAnalysisPage",
      "WordComparePage",
      "SentenceExamplesPage",
      "WordDetailPage",
      "LoginPage",
      "CreateAccountPage",
      "ResetPasswordPage",
      "ReviewPage",
      "PrivacyPolicyPage",
      "SplashPage"
    ];
    if (
      (route.name === "首頁" && routeName === undefined) ||
      (routeName && hideOnScreens.indexOf(routeName) > -1)
    )
      return true;
    return false;
  };
  const tabStyles: any = (route: string) => {
    return {
      display: getTabBarVisibility(route) ? 'none' : 'flex',
      backgroundColor: Colors.bottom_tab_bar,
      borderTopWidth: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      position: "absolute",
      bottom: 0,
      zIndex: 8,
      width: DEVICE_WIDTH,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    }
  }

  return (
    <RootSiblingParent>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <SafeAreaProvider>
                <NavigationContainer>
                  <Tab.Navigator
                    screenOptions={{
                      tabBarActiveTintColor: Colors.primary,
                      tabBarInactiveTintColor: Colors.gray_4,
                      headerShown: false,
                    }}
                  >
                    <Tab.Screen
                      name="首頁"
                      component={Navigator.HomeStackNavigator}
                      options={({ route }: { route: any }) => ({
                        tabBarStyle: tabStyles(route),
                        tabBarIcon:  ({focused, color, size}: {focused: any, color: any, size: any}) => (
                          <Icon name={focused ? Images.tabBarItems.home_focus : Images.tabBarItems.home} size={size} color={color} />
                        )
                      })}
                    />
                    <Tab.Screen
                      name="字典"
                      component={Navigator.DictionaryStackNavigator}
                      options={({ route }: { route: any }) => ({
                        tabBarStyle: tabStyles(route),
                        tabBarIcon:  ({focused, color, size}: {focused: any, color: any, size: any}) => (
                          <Icon name={focused ? Images.tabBarItems.dictionary_focus : Images.tabBarItems.dictionary} size={size} color={color} />
                        )
                      })}
                    />
                    <Tab.Screen
                      name="筆記"
                      component={Navigator.NoteStackNavigator}
                      options={({ route }: { route: any }) => ({
                        tabBarStyle: tabStyles(route),
                        tabBarIcon:  ({focused, color, size}: {focused: any, color: any, size: any}) => (
                          <Icon name={focused ? Images.tabBarItems.note_focus : Images.tabBarItems.note} size={size} color={color} />
                        )
                      })}
                    />
                    <Tab.Screen
                      name="設定"
                      component={Navigator.SettingStackNavigator}
                      options={({ route }: { route: any }) => ({
                        tabBarStyle: tabStyles(route),
                        tabBarIcon:  ({focused, color, size}: {focused: any, color: any, size: any}) => (
                          <Icon name={focused ? Images.tabBarItems.setting_focus : Images.tabBarItems.setting} size={size} color={color} />
                        )
                      })}
                    />
                  </Tab.Navigator>
                </NavigationContainer>
              
            </SafeAreaProvider>
          </Layout>
        </QueryClientProvider>
      </Provider>
    </RootSiblingParent>
  );
}
