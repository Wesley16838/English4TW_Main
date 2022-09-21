import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Text,
  Image,
  Modal,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Button from "components/Button/Button";
import ModalContainer from "components/Modal/Modal";
import Images from "assets/images";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "pages/SplashPage";
import { Colors, Typography } from "styles";
import { compose, Dispatch } from "redux";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setSetting } from "actions/setting";
import { speedOptions } from "utils/constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery } from "react-query";
import api from "services/api";
import images from "assets/images";
import * as Speech from "expo-speech";
import authDeviceStorage from "services/authDeviceStorage";
import { setNextPage } from "actions/page";

const SentenceExamplesPage = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const route: RouteProp<
    { params: { sentence: string } },
    "params"
  > = useRoute();
  const { sentence } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch: Dispatch<any> = useDispatch();
  const { speed }: any = useSelector(
    (state: any) => state.setting,
    shallowEqual
  );
  const { nextPage, parameter }: any = useSelector(
    (state: any) => state.page,
    shallowEqual
  );
  const fetchSentences = async () => {
    try {
      let token = null;
      const result = await authDeviceStorage.getItem("JWT_TOKEN");
      if (result) token = JSON.parse(result).token;
      const param = encodeURI("lay ...(事) on the line:");
      const res: any = await api.get(
        `https://www.english4tw.com/api/sentences?usage=${param}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
        }
        )
      if (res.data.message === "Unauthorized")
        throw new Error("Unauthorized");
      
      return res.data.data.s[0];
    } catch (err) {
      console.log(err);
    }
  }
  const {data, isLoading} = useQuery(sentence, fetchSentences)
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
    console.log('handleBack')
    const nextPageArr = ["SentenceExamplesPage"]
    const parameterArr = [sentence]
    dispatch(setNextPage({
      page: nextPageArr,
      parameter: parameterArr
    }))
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
  };

  const handleOnPlay = (str: string) => {
    Speech.speak(str, {
      rate: ({
        慢: 0.8,
        中: 1,
        快: 1.3,
      } as any)[speed],
    });
  };
  const renderSentencesSection = () => {
    return data && (data as []).map((sentence, index) => {
      return (
        <View key={index} style={styles.sectionBody}>
           <Button
              image={images.icons.volume_icon}
              buttonStyle={{ height: 30, width: 30 }}
              imageSize={{ height: 30, width: 30, marginRight: 0 }}
              type=""
              onPress={() => handleOnPlay(sentence)}
            />
          <Text
            style={{
              width: DEVICE_WIDTH - 85,
              fontSize: 17,
              lineHeight: 25.5,
              marginLeft: 10,
            }}
          >
            {sentence}
          </Text>
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
              contentInset={{ top: 0 }}
              showsVerticalScrollIndicator={false}
              automaticallyAdjustContentInsets={false}
            >
              <View style={styles.topic}>
                <Image
                  style={styles.topicIcon}
                  source={Images.icons.arrow_icon}
                />
                <Text style={styles.topicTitle}> 例句 -</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    style={styles.speedIcon}
                    source={Images.icons.speed_icon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.title}>{sentence}</Text>
              <View style={{ marginBottom: 90 }}>
                {renderSentencesSection()}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    backgroundColor: Colors.modal_background,
  },
  sheet: {
    position: "absolute",
    top: DEVICE_HEIGHT,
    left: 0,
    right: 0,
    height: DEVICE_HEIGHT,
    justifyContent: "flex-end",
  },
  volumeIcon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    marginRight: 10,
  },
  topic: {
    ...Typography.base_bold,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 25,
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
  speedIcon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
    marginLeft: 5,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: Colors.gray_4,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    paddingBottom: 20,
  },

  sectionBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 25,
    marginTop: 15,
  },
  actionsheet: {
    width: 77,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  popup: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    minHeight: DEVICE_HEIGHT - 54,
    height: DEVICE_HEIGHT,
    paddingTop: 26,
  },
  sentence_example: {
    fontSize: 17,
    lineHeight: 25.5,
    marginBottom: 6,
  },
  title: {
    ...Typography.lg_bold,
    lineHeight: 24,
    color: Colors.secondary,
    paddingHorizontal: 25,
    marginTop: 14,
  },
});

export default SentenceExamplesPage;
