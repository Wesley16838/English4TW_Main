import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingPage from "pages/SettingPage";
import LoginPage from "pages/LoginPage";
import CreateAccountPage from "pages/CreateAccountPage";
import ResetPasswordPage from "pages/ResetPasswordPage";
import ReviewPage from "pages/ReviewPage";
import SubscribePage from "pages/SubscribePage";
import OrderHistoryPage from "pages/OrderHistoryPage";
import PersonalProfilePage from "pages/PersonalProfilePage";
import PrivacyPolicyPage from "pages/PrivacyPolicyPage";
import { shallowEqual, useSelector } from "react-redux";
const SettingStack = createStackNavigator();

const SettingStackNavigator = () => {
  const {isLoggedIn}: any = useSelector(
    (state: any) => state.user,
    shallowEqual
  );
  const forFade = ({ current }: {current: any}) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });
  return (
    <SettingStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SettingPage"
    >
      <SettingStack.Screen
        name={"SettingPage"}
        component={SettingPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
      />
      {!isLoggedIn && <SettingStack.Screen
        name={"LoginPage"}
        component={LoginPage}
        options={{ gestureEnabled: false, cardStyleInterpolator: forFade}}
      />}
      <SettingStack.Screen
        name={"CreateAccountPage"}
        component={CreateAccountPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ title: "創建帳戶" }}
      />
      <SettingStack.Screen
        name={"ResetPasswordPage"}
        component={ResetPasswordPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ title: "重設密碼" }}
      />
      <SettingStack.Screen
        name={"ReviewPage"}
        component={ReviewPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ title: "意見回饋" }}
      />
      <SettingStack.Screen
        name={"SubscribePage"}
        component={SubscribePage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ title: "進階訂閱" }}
      />
      <SettingStack.Screen
        name={"OrderHistoryPage"}
        component={OrderHistoryPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ title: "訂單記錄" }}
      />
      <SettingStack.Screen
        name={"PersonalProfilePage"}
        component={PersonalProfilePage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ title: "個人資訊" }}
      />
      <SettingStack.Screen
        name={"PrivacyPolicyPage"}
        component={PrivacyPolicyPage}
        options={{ animationEnabled: false, gestureEnabled: false }}
        initialParams={{ title: "隱私權與使用條款" }}
      />
    </SettingStack.Navigator>
  );
};

export default SettingStackNavigator;
