import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { Sound } from "expo-av/build/Audio/Sound";
import * as Device from "expo-device";
import * as FileSystem from "expo-file-system";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import Button from "components/Button/Button";
import images from "assets/images";
import { Colors, Spacing, Typography } from "styles";
import Tag from "components/Tag/Tag";
import ModalContainer from "components/Modal/Modal";
import { DEVICE_WIDTH } from "pages/SplashPage";
import ActionButton from "components/ActionButton/ActionButton";
import LinearGradientLayout from "components/LinearGradientLayout";
import {
  useNavigation,
  RouteProp,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useQueryClient } from "react-query";
import authDeviceStorage from "services/authDeviceStorage";
import axios from "axios";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setSetting } from "actions/setting";
import { Dispatch } from "redux";
import { playOptions, speedOptions } from "utils/constants";

//  setOnPlaybackStatusUpdate(({ shouldPlay, isLoaded }) => { ... })
const NoteContentPage = () => {
  const navigation = useNavigation();
  const route: RouteProp<{ params: { id: number } }, "params"> = useRoute();
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [isPreviousPlay, setIsPreviousPlay] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [playbackObject, setPlaybackObject] = useState<Sound | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<any>({});
  const [errMsg, setErrMsg] = useState("");
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const [speedModalVisible, setSpeedModalVisible] = useState(false);
  const [paragraphModalVisible, setParagraphModalVisible] = useState(false);
  const [noteContent, setNoteContent] = useState<any>(null);
  const dispatch: Dispatch<any> = useDispatch();
  const { speed, play_paragraph }: any = useSelector(
    (state: any) => state.setting,
    shallowEqual
  );
  const isFocused = useIsFocused();
  const actionList = [
    {
      name: "播放速度",
      func: () => {
        setIsOptionVisible(false);
        setSpeedModalVisible(true);
      },
    },
    {
      name: "播放段落",
      func: () => {
        setIsOptionVisible(false);
        setParagraphModalVisible(true);
      },
    },
  ];
  const { id } = route.params;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (playbackObject === null) {
      setPlaybackObject(new Audio.Sound());
    }
  }, []);

  useEffect(() => {
    const fetchAudio = async () => {
      const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
      const token = userInfo && JSON.parse(userInfo).token;
      axios
        .post(
          "https://www.english4tw.com/api/getUserNote",
          { note_id: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const audioContent = encodeURIComponent(res.data.data.note.content);
          const uri = `https://www.english4tw.com/blog/get/tts?text=${audioContent}&from_lang=en&to_lang=zh-CHT`;
          if (Device.osName === "Android") {
            playbackObject &&
              playbackObject
                .loadAsync({
                  uri,
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                  console.log("playbackObject,", playbackObject);

                  playbackObject.getStatusAsync().then((res: any) => {
                    console.log("Object Status,", res);
                    setPlaybackStatus(res);
                    setDuration(res.durationMillis);
                    setIsFinish(false);
                  });
                  playbackObject.setOnPlaybackStatusUpdate(
                    _onPlaybackStatusUpdate
                  );
                })
                .catch((err: React.SetStateAction<string>) => setErrMsg(err));
          } else {
            FileSystem.downloadAsync(
              uri,
              FileSystem.documentDirectory + "english4tw.mp3",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then(() => {
                playbackObject &&
                  playbackObject
                    .loadAsync({
                      uri: FileSystem.documentDirectory + "english4tw.mp3",
                    })
                    .then(() => {
                      playbackObject.getStatusAsync().then((res: any) => {
                        setPlaybackStatus(res);
                        setDuration(res.durationMillis);
                        setIsFinish(false);
                      });
                      playbackObject.setOnPlaybackStatusUpdate(
                        _onPlaybackStatusUpdate
                      );
                    })
                    .catch((err: React.SetStateAction<string>) =>
                      setErrMsg(err)
                    );
              })
              .catch((error) => {
                setErrMsg(error);
              });
          }
          setNoteContent(res.data.data.note);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (playbackObject !== null && isFocused) {
      fetchAudio();
    }
    return () => {
      playbackObject && playbackObject.unloadAsync();
    };
  }, [playbackObject, isFocused]);

  const _onPlaybackStatusUpdate = (playbackStatus: any) => {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update your UI for the loaded state

      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
        setTime(playbackStatus.positionMillis);
        if (playbackStatus.positionMillis === playbackStatus.durationMillis) {
          setIsFinish(true);
          setIsPlay(false);
          setIsPreviousPlay(false);
        }
      } else {
        setTime(playbackStatus.positionMillis);
        // Update your UI for the paused state
      }

      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
    }
  };

  const handleAudioPlayPause = async () => {
    if (playbackObject && isFinish) {
      const status = await playbackObject.replayAsync();
      setIsPlay(true);
      setIsFinish(false);
      return setPlaybackStatus(status);
    } else {
      // It will pause our audio
      if (playbackObject && isPlay) {
        const status = await playbackObject.pauseAsync();
        setIsPlay(false);
        setIsPreviousPlay(false);
        return setPlaybackStatus(status);
      }

      // It will resume our audio
      if (playbackObject && !isPlay) {
        const status = await playbackObject.playAsync();
        setIsPlay(true);
        setIsPreviousPlay(true);
        return setPlaybackStatus(status);
      }
    }
  };

  const onSlidingCompleted = async (e: any) => {
    if (playbackObject) {
      //is finish or not
      // await playbackObject.setPositionAsync(value);
      if (isPreviousPlay && !isFinish) {
        //Previous is playing and isn't finish
        const status = await playbackObject.playAsync();
        setIsPlay(true);
        return setPlaybackStatus(status);
      } else if (!isPreviousPlay && isFinish) {
        const status = await playbackObject.playAsync();
        setIsPlay(true);
        setIsFinish(false);
        return setPlaybackStatus(status);
      }
    }
  };

  const onSlidingStarted = async (e: any) => {
    if (playbackObject && isPlay) {
      await playbackObject.pauseAsync();
      setIsPlay(false);
    }
  };

  const onSliderValueChanging = async (value: any) => {
    if (playbackObject) {
      setTime(value);
    }
  };

  const changeSpeed = (rate: number) => {
    playbackObject && playbackObject.setRateAsync(rate, true);
  };
  const changePosition = (millis: number) => {
    playbackObject && playbackObject.setPositionAsync(millis);
  };

  const handleBack = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
  };

  const isDisable = !noteContent;
  const contentArr =
    noteContent &&
    noteContent.content.split("\n").map((noteItem: any) => noteItem);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={speedModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <ModalContainer
          content={speedOptions}
          title={"播放速度"}
          onCancel={() => setSpeedModalVisible(false)}
          defaultValue={speed}
          onConfirm={(option: string) => {
            dispatch(setSetting({ speed: option }));
            setSpeedModalVisible(false);
          }}
        />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={paragraphModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <ModalContainer
          content={playOptions}
          title={"播放段落"}
          onCancel={() => setParagraphModalVisible(false)}
          defaultValue={play_paragraph}
          onConfirm={(option: string) => {
            dispatch(setSetting({ play_paragraph: option }));
            setParagraphModalVisible(false);
          }}
        />
      </Modal>
      <LinearGradientLayout>
        <SafeAreaView
          style={{
            marginTop: Spacing.space_xs,
            height: "100%",
            alignItems: "center",
            width: DEVICE_WIDTH,
            paddingBottom: insets.bottom + Spacing.space_l,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: Spacing.space_l,
            }}
          >
            <View style={{ flex: 1, alignItems: "flex-start" }}>
              <Button
                title=""
                image={images.icons.leftarrow_icon}
                buttonStyle={{ height: 20, width: 12 }}
                imageSize={{ height: 20, width: 12, marginRight: 0 }}
                type=""
                onPress={() => handleBack()}
              />
            </View>

            <Text style={Typography.pageTitle as TextStyle}>
              {noteContent && noteContent.title}
            </Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("NewNotePage", {
                    title: noteContent && noteContent.title,
                    content: noteContent && noteContent.content,
                    tags: noteContent && noteContent.tags,
                    id,
                    type: "edit",
                  });
                }}
              >
                <Image
                  style={styles.iconnotestyle}
                  source={images.icons.edit_icon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.sliderWrapper}>
            <Text style={styles.timer}>
              {new Date(time).toISOString().substr(14, 5)}
            </Text>
            <Slider
              style={{ height: 40, width: DEVICE_WIDTH - 120 }}
              value={time}
              minimumValue={0}
              maximumValue={duration}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.range_slider}
              onValueChange={onSliderValueChanging}
              onSlidingComplete={onSlidingCompleted}
              onSlidingStart={(val) => onSlidingStarted(val)}
              disabled={isDisable}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setIsOptionVisible(!isOptionVisible);
              }}
            >
              <Image
                style={styles.filterIcon}
                source={images.icons.filter_icon}
              />
            </TouchableOpacity>
            {isOptionVisible && <ActionButton options={actionList} />}
          </View>
          <View style={styles.audioActions}>
            <TouchableOpacity onPress={() => {}} disabled={isDisable}>
              <Image
                source={images.icons.previous_icon}
                style={styles.audioIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleAudioPlayPause();
              }}
              disabled={isDisable}
            >
              <Image
                source={
                  isDisable
                    ? images.icons.disable_play_icon
                    : isPlay
                    ? images.icons.pause_icon
                    : images.icons.play_icon
                }
                style={styles.audioIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} disabled={isDisable}>
              <Image source={images.icons.next_icon} style={styles.audioIcon} />
            </TouchableOpacity>
          </View>
          {isDisable ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <View style={styles.noteContainer}>
                {contentArr.map((note: any, index: any) => {
                  return (
                    <View style={{ marginTop: index !== 0 ? 20 : 0 }}>
                      <Text key={note} style={Typography.base}>
                        {note}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <View style={styles.sectionContainer}>
                {noteContent.tags.map((tag: { [x: string]: string }) => {
                  return (
                    <View key={tag["tag_id"]}>
                      <Tag
                        title={tag["tag_name"]}
                        customStyle={{
                          paddingHorizontal: 15,
                          paddingVertical: 3,
                          marginRight: 5,
                          marginBottom: 5,
                        }}
                        disable={true}
                      />
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </SafeAreaView>
      </LinearGradientLayout>
    </>
  );
};
const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 5,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 21,
  },
  sliderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.space_l,
    marginTop: Spacing.space_l,
    position: "relative",
    zIndex: 1000,
  },
  timer: {
    width: 40,
    textAlign: "center",
    color: Colors.primary,
  },
  noteItem: {
    width: DEVICE_WIDTH,
    paddingHorizontal: Spacing.space_l,
    height: 60,
    justifyContent: "center",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
    backgroundColor: Colors.white,
  },
  noteWord: {},
  imagefavstyle: {
    resizeMode: "contain",
    width: 355,
    height: 255,
  },
  iconnotestyle: {
    resizeMode: "contain",
    width: 30,
    height: 30,
  },
  filterIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
  },
  filterButton: {
    width: 40,
    alignItems: "center",
    position: "relative",
  },
  audioIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  audioActions: {
    flexDirection: "row",
    width: 170,
    justifyContent: "space-between",
    marginTop: 10,
  },
  sectionContainer: {
    width: DEVICE_WIDTH - 40,
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 0.5,
    borderTopColor: Colors.gray_2,
    marginTop: Spacing.space_l,
    paddingTop: Spacing.space_l,
  },
  noteContent: {
    ...Typography.base,
    lineHeight: 25,
    marginTop: 10,
  },
  noteContainer: {
    width: DEVICE_WIDTH - 40,
    textAlign: "left",
    marginTop: 20,
  },
});
export default NoteContentPage;
