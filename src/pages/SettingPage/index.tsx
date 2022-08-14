import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSelector, shallowEqual, useDispatch } from "react-redux";
import ProfileImage from "components/ProfileImage/ProfileImage";
import Button from "components/Button/Button";

import images from "assets/images";
import ModalContainer from "components/Modal/Modal";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
  Switch,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { DEVICE_WIDTH } from "pages/SplashPage";
import { Colors, Typography } from "styles";
import LinearGradientLayout from "components/LinearGradientLayout";
import { setSetting } from "actions/setting";
import { Dispatch } from "redux";
import { speedOptions } from "utils/constants";

const SettingPage = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const dispatch: Dispatch<any> = useDispatch();
  const { speed }: any = useSelector(
    (state: any) => state.setting,
    shallowEqual
  );
  const [modalVisible, setModalVisible] = useState(false);
  const isLoggedIn: any = useSelector(
    (state: any) => state.user.isLoggedIn,
    shallowEqual
  );
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <ModalContainer
          content={speedOptions}
          title={"播放速度"}
          onCancel={() => setModalVisible(false)}
          defaultValue={speed}
          onConfirm={(option: string) => {
            dispatch(setSetting({ speed: option }));
            setModalVisible(false);
          }}
        />
      </Modal>
      <LinearGradientLayout>
        <SafeAreaView
          style={{
            height: "100%",
            alignItems: "center",
            width: DEVICE_WIDTH,
          }}
        >
          <ScrollView
                contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
                contentInset={{bottom: 70}}
                showsVerticalScrollIndicator={false}
              >
          <ProfileImage
            name={images.icons.default_profileimage}
            customStyle={{
              height: 130,
              width: 130,
              marginTop: 25,
              marginBottom: 20,
              borderRadius: 65,
            }}
          />
          {!isLoggedIn && (
            <Button
              title="登入"
              onPress={() => navigation.push("LoginPage")}
              buttonStyle={{
                width: 150,
                height: 36,
                borderRadius: 20,
                flexDirection: "row",
                marginBottom: 44,
              }}
              type="2"
            />
          )}
          {isLoggedIn && <Text style={styles.username}>{"Wesley Wong"}</Text>}

          <View>
            {isLoggedIn && (
              <TouchableWithoutFeedback
                accessible={true}
                accessibilityLabel={"個人資訊"}
                accessibilityHint={"個人資訊"}
                onPress={() => navigation.push("PersonalProfilePage")}
              >
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionText}>{"個人資訊"}</Text>
                  <Image
                    style={styles.sectionArrow}
                    source={images.icons.rightarrow_icon}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
            <TouchableWithoutFeedback
              accessible={true}
              accessibilityLabel={"特色介紹"}
              accessibilityHint={"特色介紹"}
              onPress={() => {}}
            >
              <View style={styles.sectionRow}>
                <Text style={styles.sectionText}>{"特色介紹"}</Text>
                <Image
                  style={styles.sectionArrow}
                  source={images.icons.rightarrow_icon}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              accessible={true}
              accessibilityLabel={"意見回饋"}
              accessibilityHint={"意見回饋"}
              onPress={() => navigation.push("ReviewPage")}
            >
              <View style={styles.sectionRow}>
                <Text style={styles.sectionText}>{"意見回饋"}</Text>
                <Image
                  style={styles.sectionArrow}
                  source={images.icons.rightarrow_icon}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              accessible={true}
              accessibilityLabel={"開發版號"}
              accessibilityHint={"開發版號"}
              onPressIn={() => {}}
              onPressOut={() => {}}
            >
              <View
                style={[
                  styles.sectionRow,
                  {
                    borderBottomColor: Colors.primary_light,
                    borderBottomWidth: isLoggedIn ? 0 : 1,
                  },
                ]}
              >
                <Text style={styles.sectionText}>{"開發版號"}</Text>
                <Text style={styles.version}>{"0.2.1"}</Text>
              </View>
            </TouchableWithoutFeedback>
            {isLoggedIn && (
              <TouchableWithoutFeedback
                accessible={true}
                accessibilityLabel={"離線模式"}
                accessibilityHint={"離線模式"}
                onPressIn={() => {}}
                onPressOut={() => {}}
              >
                <View style={[styles.sectionRow]}>
                  <Text style={styles.sectionText}>{"離線模式"}</Text>
                  <Switch
                    trackColor={{
                      false: "rgba(120, 120, 128, 0.16)",
                      true: Colors.primary,
                    }}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>
              </TouchableWithoutFeedback>
            )}
            {isLoggedIn && (
              <>
                <TouchableWithoutFeedback
                  accessible={true}
                  accessibilityLabel={"播放速度"}
                  accessibilityHint={"播放速度"}
                  onPress={() => setModalVisible(true)}
                >
                  <View style={[styles.sectionRow]}>
                    <Text style={styles.sectionText}>{"播放速度"}</Text>
                    <Image
                      style={styles.sectionArrow}
                      source={images.icons.rightarrow_icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  accessible={true}
                  accessibilityLabel={"隱私權與使用條款"}
                  accessibilityHint={"隱私權與使用條款"}
                  onPress={() => navigation.push("PrivacyPolicyPage")}
                >
                  <View
                    style={[
                      styles.sectionRow,
                      {
                        borderBottomColor: Colors.primary_light,
                        borderBottomWidth: 1,
                      },
                    ]}
                  >
                    <Text style={styles.sectionText}>{"隱私權與使用條款"}</Text>
                    <Image
                      style={styles.sectionArrow}
                      source={images.icons.rightarrow_icon}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </>
            )}
          </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradientLayout>
    </>
  );
};
const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: "row",
    height: 60,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    width: DEVICE_WIDTH,
    borderTopColor: Colors.primary_light,
    borderTopWidth: 1,
    backgroundColor: Colors.white,
  },
  sectionText: {},
  version: {
    color: Colors.info,
  },
  sectionArrow: {
    width: 7,
    height: 12,
  },
  username: {
    ...Typography.lg_bold,
    color: Colors.secondary,
    marginBottom: 40,
  },
});

export default SettingPage;
