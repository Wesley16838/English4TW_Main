import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  Animated,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Button from "components/Button/Button";
import Images from "assets/images";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "pages/SplashPage";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Dispatch } from "redux";
import { Colors, Typography } from "styles";
import { useMutation, useQuery } from "react-query";
import { RouteProp, useRoute } from "@react-navigation/native";
import * as Speech from "expo-speech";
import api from "services/api";
import authDeviceStorage from "services/authDeviceStorage";
const SentenceAnalysisPage = ({ navigation }: { navigation: any }) => {
  const dispatch: Dispatch<any> = useDispatch();
  const route: RouteProp<
    { params: { sentence: string } },
    "params"
  > = useRoute();
  const { sentence } = route.params;
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [analysis, setAnalysis] = useState([]);

  const { mutate, isLoading } = useMutation(
    async () => {
      try {
        let token = null;
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if (result) token = JSON.parse(result).token;
        const res_analysis: any = await api.post(
          `api/analyze`,
          { ori_sentence: sentence },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          }
        );
        if (res_analysis.data.message === "Unauthorized")
          throw new Error("Unauthorized");
        return res_analysis.data.data.output;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: (data) => setAnalysis(data),
    }
  );

  const backdrop = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 0.01],
          outputRange: [DEVICE_HEIGHT, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0.01, 0.5],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  useEffect(() => mutate(), [sentence]);

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  const handleClose = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
  };
  const handleBack = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
  };
  const handleNext = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.push("SentenceAnalysisPage");
  };

  const renderAnalysisSection = () => {
    return analysis.map((anal, index) => {
      return (
        <View key={index}>
          <Text style={styles.sentence_analysis}>{anal}</Text>
          {/* <View style={{ flexDirection: "row", marginBottom: 6 }}>
            <Text
              style={{
                ...Typography.lg_bold,
                marginBottom: 6,
                lineHeight: 23,
                color: Colors.secondary,
              }}
            >
              (人) put a spin on (事)
            </Text>
            <Text
              style={{
                ...Typography.lg_bold,
                color: "#00B4B4",
                lineHeight: 25,
                marginLeft: 10,
              }}
              onPress={() => {
                  navigation.push("SentenceExamplesPage", {
                    sentence: "put a spin on",
                  })
                }
              }
            >
              &#60; 看例句 &#62;
            </Text>
          </View>
          <Text
            style={{
             ...Typography.lg_bold,
              marginBottom: 30,
              lineHeight: 23,
              color: Colors.secondary,
            }}
          >
            對...加油添醋
          </Text> */}
        </View>
      );
    });
  };
  const slideUp = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0.01, 1],
          outputRange: [0, -0.93 * DEVICE_HEIGHT],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const handleOnWordPlay = (str: string) => {
    Speech.speak(str);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.cover, backdrop]}
      />
      <View style={[styles.sheet]}>
        <Animated.View style={[styles.popup, slideUp]}>
          <View style={styles.sectionRow}>
            <View style={styles.actionsheet}>
              <Button
                title=""
                image={Images.icons.leftarrow_icon}
                buttonStyle={{ height: 20, width: 12 }}
                imageSize={{ height: 20, width: 12, marginRight: 0 }}
                type=""
                onPress={() => handleBack()}
              />
              <Button
                title=""
                image={Images.icons.rightarrow_disable_icon}
                buttonStyle={{ height: 20, width: 12 }}
                imageSize={{ height: 20, width: 12, marginRight: 0 }}
                type=""
                onPress={() => handleNext()}
              />
            </View>
            <Button
              title=""
              image={Images.icons.close_icon}
              buttonStyle={{ height: 30, width: 30 }}
              imageSize={{ height: 30, width: 30, marginRight: 0 }}
              type=""
              onPress={() => handleClose()}
            />
          </View>
          <ScrollView
            contentInset={{ bottom: 15, top: 0 }}
            showsVerticalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
          >
            <View style={styles.content}>
              <View style={styles.topic}>
                <Image
                  style={styles.topicIcon}
                  source={Images.icons.arrow_icon}
                />
                <Text style={styles.topicTitle}> 原文 -</Text>
              </View>
              <View
                style={{
                  width: DEVICE_WIDTH - 40,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                  backgroundColor: Colors.white,
                  marginBottom: 30,
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row",
                }}
              >
                <TouchableWithoutFeedback
                  onPress={() => handleOnWordPlay(sentence)}
                >
                  <Image
                    source={Images.icons.volume_icon}
                    style={{ width: 30, height: 30 }}
                  />
                </TouchableWithoutFeedback>

                <View style={{ width: DEVICE_WIDTH - 30 - 30 - 10 - 40 }}>
                  <Text
                    style={{
                      ...Typography.base,
                      lineHeight: 25,
                    }}
                  >
                    {sentence}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.content_analysis}>
              <View style={styles.topic}>
                <Image
                  style={styles.topicIcon}
                  source={Images.icons.arrow_icon}
                />
                <Text style={styles.topicTitle}> 解析 -</Text>
              </View>
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size="large" />
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    marginBottom: 30,
                    flexDirection: "column",
                    flexWrap: "wrap",
                  }}
                >
                  {renderAnalysisSection()}
                </View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    backgroundColor: Colors.page_modal_background,
  },
  sheet: {
    position: "absolute",
    top: DEVICE_HEIGHT,
    left: 0,
    right: 0,
    height: DEVICE_HEIGHT,
    justifyContent: "flex-end",
  },
  topic: {
    ...Typography.base_bold,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  topicTitle: {
    ...Typography.base_bold,
  },
  topicIcon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    marginRight: 5,
  },
  popup: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    height: DEVICE_HEIGHT,
    paddingTop: 26,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: Colors.gray_4,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    paddingBottom: 20,
  },
  actionsheet: {
    width: 77,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  content: {
    width: DEVICE_WIDTH - 40,
    borderBottomColor: Colors.gray_4,
    borderBottomWidth: 0.5,
    marginHorizontal: 20,
    marginTop: 30,
  },
  content_analysis: {
    marginTop: 30,
    width: DEVICE_WIDTH - 40,
    marginHorizontal: 20,
    flexDirection: "column",
  },
  sentence_analysis: {
    fontSize: 17,
    lineHeight: 25.5,
    marginBottom: 6,
  },
});

export default SentenceAnalysisPage;
