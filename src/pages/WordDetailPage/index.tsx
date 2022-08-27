import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Modal,
  Alert,
  Share,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import _ from "lodash";
import Button from "components/Button/Button";
import ModalContainer from "components/Modal/Modal";
import Label from "components/Label/Label";
import images from "assets/images";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "pages/SplashPage";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { Colors, Spacing, Typography } from "styles";
import LinearGradientLayout from "components/LinearGradientLayout";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { IItem } from "types/pages/word";
import Accordion from "components/Accordion";
import authDeviceStorage from "services/authDeviceStorage";
import api from "services/api";
import deviceStorage from "services/deviceStorage";
import * as Speech from "expo-speech";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { setSetting } from "actions/setting";
import Toast from "react-native-root-toast";
import { propertyObj, speechObj, speedOptions } from "utils/constants";
import { StackNavigationProp } from "@react-navigation/stack";
import { getSavedWords } from "services/word";
import { isCloseToBottom, isCloseToTop } from "utils/helper";
import TabView from "components/TabView/TabView";

let layoutOrder: any[] = [[], []];
let cloneLayoutOrder: any[] = [[], []];
let layoutLength = [0, 0];

const WordDetailPage = () => {
 
  const [accordion, setAccordion] = useState<any>([[], []]);
  const [speedModalVisible, setSpeedModalVisible] = useState<boolean>(false);
  const [borderPosition, setBorderPosition] = useState({
    top: true,
    bottom: false
  })

  const dispatch: Dispatch<any> = useDispatch();
  const scrollViewRef: any = useRef(null);
  const queryClient = useQueryClient();

  let wordBody: any[] = []
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route: RouteProp<
    { params: { word: string; history: string } },
    "params"
  > = useRoute();
  const { word, history } = route.params;
  useEffect(() => {
    return () => {
        // componentwillunmount in functional component.
        // Anything in here is fired on component unmount.
      layoutOrder = [[], []];
      cloneLayoutOrder = [[], []];
      layoutLength = [0, 0];
    }
}, [])
  const { data: savedWordData, error, isError, refetch } = getSavedWords(
    [],
    () => {},
    () => {},
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );
  const saved =
    savedWordData && savedWordData.find(
      (item: any) => item.word.toLowerCase() === word.toLowerCase()
    );


  const { speed }: any = useSelector(
    (state: any) => state.setting,
    shallowEqual
  );
  const fetchWord = async () => {
    const wordInfo = await deviceStorage.getItem(word);
    const halfDayExpire = 1000 * 60 * 60 * 12;
    if (
      wordInfo === null ||
      (wordInfo.word !== null && Date.now() - wordInfo.date > halfDayExpire)
    ) {
      const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
      const token = userInfo && JSON.parse(userInfo).token;
      const res = await api.get(`api/word3?word=${word}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    } else {
      return wordInfo.word;
    }
  };

  const { data: wordInfo, isLoading, isSuccess } = useQuery(
    `${word}`,
    fetchWord,
    {
      onSuccess: async (data) => {
        const jsonValue = history ? JSON.parse(history) : [];
        const index = history
          ? jsonValue.map((e: IItem) => e.word)?.indexOf(word)
          : -1;
        if (index > -1) {
          jsonValue.splice(index, 1);
        }
        jsonValue.unshift({
          word: word,
          detail: "Word Detail",
        });
        await deviceStorage.setItem("@word_history", JSON.stringify(jsonValue));
        const loginDate = Date.now();
        await deviceStorage.setItem(
          `${word}`,
          JSON.stringify({ word: data, date: loginDate })
        );

      },
      onError: () => {},
      cacheTime: 1000 * 60 * 60 * 12, // half day
    }
  );

  const handleOnPlay = () => {
    Speech.speak(word, {
      rate: ({
        慢: 0.8,
        中: 1,
        快: 1.3,
      } as any)[speed],
    });
  };
  const handleBack = () => navigation.pop();
  const handleNext = () => navigation.push("SentenceAnalysisPage");

  const renderDef: any = (obj: any, defIndex: number) => {
    if (obj.hasOwnProperty("condition")) {
      const conditionArr = obj["condition"].split("|");
      return (
        <>
          {conditionArr.map((element: string, index: number) => (
            <Text
              key={`${element}${index}`}
              style={{
                color: conditionArr.length > 1 ? Colors.black : Colors.primary,
                marginTop: conditionArr.length > 1 ? 10 : 0,
                ...Typography.base,
              }}
            >
              {element}
            </Text>
          ))}
          {obj.hasOwnProperty("examples") &&
            obj["examples"].map((example: any, exampleIndex: number) => {
              return renderDef(example, exampleIndex);
            })}
        </>
      );
    } else {
      return (
        <View key={`def${defIndex}`}>
          <Text
            style={{
              ...Typography.base_primary,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {obj["name"]}
          </Text>
          {obj.hasOwnProperty("definitions") &&
            obj["definitions"].map((def: string) => {
              return <Text style={{ paddingLeft: 15 }}>{def}</Text>;
            })}
        </View>
      );
    }
  };

  const wordObjs = wordInfo && (wordInfo?.tabs ? wordInfo.tabs.map((tab: any) => tab.content) : [wordInfo.content])
  wordInfo && wordObjs.map((wordObj: any, wordObjIndex: number) => {
    const wordItem =
    isSuccess &&
    Object.keys(wordObj).map((words: any, wordIndex: number) => {
      if(words === "成語") return;
      return (
        /* 詞彙區 */
        <View style={{ flexDirection: "column" }} key={`wordBody${wordIndex}`}>
          {/* 定義區 */}
          <View style={styles.tabCard}>
            {/* 標題區 */}
            <View style={styles.wordSection}>
              <Text style={styles.wordName}>{word}</Text>
              <Button
                image={images.icons.volume_icon}
                buttonStyle={{ height: 30, width: 30 }}
                imageSize={{ height: 30, width: 30, marginRight: 0 }}
                type=""
                onPress={() => handleOnPlay()}
              />
            </View>
            {/* 複標題區 */}
            <View style={styles.subtitleSection}>
              <Label title={speechObj[words]} />
              {Object.keys(wordObj[words]).map((property) => {
                if (property !== "simple" && property !== "tags") {
                  return (
                    <Text
                      key={`${words}${propertyObj[property]}`}
                      style={styles.propertyText}
                      onPress={() => {
                        const index = layoutOrder[wordObjIndex].findIndex(
                          (i: { name: string; }) => i.name === `${words}_${property}`
                        );
                        scrollViewRef.current.scrollTo({
                          y: layoutOrder[wordObjIndex][index].height.y,
                          animated: true,
                        });
                        setAccordion((prev:boolean[][]) => {
                          const arr = JSON.parse(JSON.stringify(prev))
                          arr[wordObjIndex][index] = true
                          return arr
                        });
                      }}
                    >
                      &#60;{propertyObj[property]}&#62;
                    </Text>
                  );
                }
              })}
            </View>
            {/* 解釋區 */}
            {wordObj[words]["simple"] && wordObj[words]["simple"].map((def: any, index: number) => {
              return (
                <View
                  style={{ marginTop: index !== 0 ? 20 : 0 }}
                  key={`description${index}`}
                >
                  {renderDef(def)}
                </View>
              );
            })}
          </View>
          {/* 屬性區 */}
          {Object.keys(wordObj[words]).map(
            (property: string, propertyIndex: number) => {
              if (property !== "simple" && property !== "tags") {
                const index = layoutOrder[wordObjIndex].findIndex(
                  (i: { name: string; }) => i.name === `${words}_${property}`
                );
                if(index === -1) {
                  layoutOrder[wordObjIndex].push({ name: `${words}_${property}` });
                  layoutLength[wordObjIndex]++;
                  setAccordion((existingItems: any) => {
                    const arr = JSON.parse(JSON.stringify(existingItems))
                    arr[wordObjIndex].push(false)
                    return arr
                  });
                }
              }
              let accordionBody = null;
              accordionBody = wordObj[words][property].map(
                (prop: any, propIndex: number) => {
                  switch (property) {
                    case "phrases":
                      return (
                        <View
                          style={{ marginTop: propIndex !== 0 ? 20 : 0 }}
                          key={`accordionbody${propIndex}`}
                        >
                          {renderDef(prop)}
                        </View>
                      );
                    case "synonyms":
                      return (
                        <Text key={`accordionbody${propIndex}${prop}`}>
                          &#8226; {prop}
                        </Text>
                      );
                  }
                }
              );
              const layoutIndex = layoutOrder[wordObjIndex].findIndex(
                (i: { name: string; }) => i.name === `${words}_${property}`
              );
              return (
                <View
                  onLayout={(event) => {
                    // set base height for each section
                    if (property !== "simple" && property !== "tags") {
                     
                      const newHeight = event.nativeEvent.layout;
                      layoutOrder[wordObjIndex][layoutIndex] = {
                        ...layoutOrder[wordObjIndex][layoutIndex],
                        height: newHeight,
                      };
                      if (layoutLength[wordObjIndex] > 0) {
                        layoutLength[wordObjIndex]--;
                      }
                    }

                    if (layoutLength[wordObjIndex] === 0) {
                      for (let i = 0; i < layoutOrder[wordObjIndex].length - 1; i++) {
                        // 不同類別
                        if (
                          layoutOrder[wordObjIndex][i].name.split("_")[0] !==
                          layoutOrder[wordObjIndex][i + 1].name.split("_")[0]
                        ) {
                          if (cloneLayoutOrder[wordObjIndex].length === 0) {
                            layoutOrder[wordObjIndex][i + 1].height.y =
                              layoutOrder[wordObjIndex][i].height.y +
                              layoutOrder[wordObjIndex][i + 1].height.y;
                          } else {
                            // next height = current height + height difference between next and current + increased height
                            layoutOrder[wordObjIndex][i + 1].height.y =
                              layoutOrder[wordObjIndex][i].height.y +
                              (cloneLayoutOrder[wordObjIndex][i + 1].height.y -
                                cloneLayoutOrder[wordObjIndex][i].height.y) +
                              (layoutOrder[wordObjIndex][i].height.height -
                                cloneLayoutOrder[wordObjIndex][i].height.height);
                          }
                        } else {
                          // 同類別
                          layoutOrder[wordObjIndex][i + 1].height.y =
                            layoutOrder[wordObjIndex][i].height.y +
                            layoutOrder[wordObjIndex][i].height.height;
                        }
                      }
                      if (cloneLayoutOrder[wordObjIndex].length === 0){
                        cloneLayoutOrder[wordObjIndex] = _.cloneDeep(layoutOrder[wordObjIndex]);
                      }
                    }

                  }}
                  key={`${words}_${property}_${propertyIndex}`}
                >
                  {property !== "simple" && property !== "tags" && (
                    <Accordion
                      title={propertyObj[property]}
                      content={accordionBody}
                      key={`accordion${propertyIndex}`}
                      onOpen={() => {
                        
                        const obj = Object.keys(wordObj[words]);
                        layoutLength[wordObjIndex] =
                          obj.length -
                          obj.indexOf(property) -
                          (obj.indexOf("simple") > obj.indexOf(property)
                            ? 1
                            : 0);
                          setAccordion((prev:boolean[][]) => {
                            const arr = JSON.parse(JSON.stringify(prev))
                            arr[wordObjIndex][layoutIndex] = !arr[layoutIndex]
                            return arr
                          });
                      }}
                      isActived={accordion[wordObjIndex][layoutIndex]}
                    />
                  )}
                </View>
              );
            }
          )}
        </View>
      );
    });
    wordBody.push(wordItem)
  });
  // && wordObj[words][property].length !== 0 // && accordionBody.length !== 0

  const handleOnSearch = () =>
    navigation.navigate("字典", { screen: "DictionaryPage" });
  const handleOnShare = async () => {
    try {
      const result = await Share.share({
        title: "English4TW - Share Vocaburary",
        message: word,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (err) {
      console.log(err);
    }
  };
  const { mutate: handleOnSaveWord } = useMutation(
    async () => {
      try {
        let token = null;
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if (result) token = JSON.parse(result).token;
        const data = saved ? { word_id: saved.id } : { word };
        const res = await api.post(
          `api/${saved ? "deleteUserWord" : "addUserWord"}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          }
        );
        return !saved && res.data.data.word;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: (data: any) => {
        saved
          ? queryClient.setQueryData("saved_words", (prev: any) =>
              prev.filter(
                (item: any) =>
                  item.word.toLocaleLowerCase() !== word.toLocaleLowerCase()
              )
            )
          : queryClient.setQueryData("saved_words", (prev: any) => [
              ...prev,
              data,
            ]);
      },
    }
  );
  const handleOnChangeSpeed = () => setSpeedModalVisible(true);
  const {
    mutate: handleOnTogglePin,
    isLoading: togglePinLoading,
  } = useMutation(
    async (data: any) => {
      try {
        let token = null;
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if (result) token = JSON.parse(result).token;
        const res = await api.post(
          `api/toggleUserWordPinned`,
          { word_id: data.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          }
        );
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: (data: any) => {
        const { id, pinned } = data;
        queryClient.setQueryData("saved_words", (prev: any) => {
          return prev.map((item: any) => {
            if (item.id === id) {
              return {
                ...item,
                pinned: pinned === 1 ? 0 : 1,
              };
            } else {
              return item;
            }
          });
        });
      },
    }
  );

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
          onConfirm={(option: string) => {
            dispatch(setSetting({ speed: option }));
            setSpeedModalVisible(false);
          }}
          defaultValue={speed}
        />
      </Modal>
      <LinearGradientLayout>
        <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                if(isCloseToTop(event)) {
                  setBorderPosition({top: true, bottom: false})
                } else if (isCloseToBottom(event)) {
                  setBorderPosition({top: false, bottom: true})
                } else {
                  setBorderPosition({top: false, bottom: false})
                }
              }}
              scrollEventThrottle={400}
          >
            <View style={styles.sectionRow}>
              <View style={styles.actionsheet}>
                <Button
                  image={images.icons.leftarrow_icon}
                  buttonStyle={{ height: 20, width: 12 }}
                  imageSize={{ height: 20, width: 12, marginRight: 0 }}
                  type=""
                  onPress={() => handleBack()}
                />
                <Button
                  image={images.icons.rightarrow_disable_icon}
                  buttonStyle={{ height: 20, width: 12 }}
                  imageSize={{ height: 20, width: 12, marginRight: 0 }}
                  type=""
                  onPress={() => handleNext()}
                />
              </View>
              <Button
                image={images.icons.search_icon}
                buttonStyle={{ height: 30, width: 30 }}
                imageSize={{ height: 30, width: 30, marginRight: 0 }}
                type=""
                onPress={() => handleOnSearch()}
              />
            </View>
            <View
              style={{
                width: DEVICE_WIDTH - 40,
                marginHorizontal: 20,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                paddingBottom: 23,
              }}
            >
              <Button
                image={images.icons.share_icon}
                buttonStyle={{ height: 30, width: 30 }}
                imageSize={{ height: 30, width: 30, marginRight: 0 }}
                type=""
                onPress={() => handleOnShare()}
              />
              <Button
                image={
                  saved ? images.icons.favorited_icon : images.icons.saved_icon
                }
                buttonStyle={{ height: 30, width: 30 }}
                imageSize={{ height: 30, width: 30, marginRight: 0 }}
                type=""
                onPress={() => {
                  if (saved && saved.pinned === 1) {
                    Toast.show("請先移除圖釘", {
                      duration: Toast.durations.SHORT,
                      shadow: false,
                    });
                  } else {
                    handleOnSaveWord();
                  }
                }}
              />
              {saved && (
                <Button
                  image={
                    saved?.pinned === 1
                      ? images.icons.push_pin_selected_icon
                      : images.icons.push_pin_icon
                  }
                  buttonStyle={{ height: 30, width: 30 }}
                  imageSize={{ height: 30, width: 30, marginRight: 0 }}
                  type=""
                  onPress={() => handleOnTogglePin(saved)}
                />
              )}
              <Button
                image={images.icons.speed_secondary_icon}
                buttonStyle={{ height: 30, width: 30 }}
                imageSize={{ height: 30, width: 30, marginRight: 0 }}
                type=""
                onPress={() => handleOnChangeSpeed()}
              />
            </View>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <TabView
                titles={["發音一", "發音二"]}
                customStyle={{ width: DEVICE_WIDTH - 40, marginHorizontal: 20 }}
                children={wordBody}
              />
              // <View style={{ alignItems: "center" }}>{wordBody}</View>
            )}
          </ScrollView>
          <View style={{position: "absolute", right: 9, bottom: 9}}>
            <Button
              image={borderPosition.top ? images.icons.go_up_disable_icon : images.icons.go_up_icon}
              buttonStyle={{ height: 50, width: 50 }}
              imageSize={{ height: 50, width: 50, marginRight: 0 }}
              type=""
              onPress={() => {
                scrollViewRef.current.scrollTo({
                  y: 0,
                  animated: true,
                });
              }}
              isDisabled={borderPosition.top}
            />
            <Button
              image={ borderPosition.bottom ? images.icons.go_down_disable_icon : images.icons.go_down_icon }
              buttonStyle={{ height: 50, width: 50 }}
              imageSize={{ height: 50, width: 50, marginRight: 0 }}
              type=""
              onPress={() => scrollViewRef.current.scrollToEnd({ animated: true })}
              isDisabled={borderPosition.bottom}
            />
          </View>
        </SafeAreaView>
      </LinearGradientLayout>
    </>
  );
};

const styles = StyleSheet.create({
  cover: {
    backgroundColor: Colors.page_modal_background,
  },
  sheet: {
    position: "absolute",
    top: DEVICE_HEIGHT,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
  },
  topic: {
    ...Typography.base_bold,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  topicTitle: {
    fontWeight: "bold",
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
    minHeight: DEVICE_HEIGHT - 54,
    paddingTop: 26,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  actionsheet: {
    width: 77,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wordSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordName: {
    ...Typography.xxl,
    lineHeight: 41,
    marginRight: 10,
  },
  subtitleSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: Spacing.space_l,
    marginBottom: 10,
  },
  wordAddition: {
    ...Typography.xl,
    lineHeight: 30,
    marginRight: 10,
  },
  flexRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  flexColumn: {
    flexDirection: "column",
  },
  tabCard: {
    borderColor: "#00B4B4",
    borderWidth: 0.5,
    borderRadius: 20,
    padding: 15,
    width: DEVICE_WIDTH - 40,
    marginBottom: Spacing.space_xl,
  },
  subtitle: {
    ...Typography.base,
    color: Colors.white,
    textAlign: "center",
  },
  sectionContainer: {
    width: DEVICE_WIDTH - 40,
    borderRadius: 25,
    backgroundColor: Colors.button_primary_press,
    paddingVertical: 15,
    marginBottom: 10,
    height: 50,
    textAlign: "center",
  },
  sectionTitle: {
    ...Typography.base_bold,
    color: Colors.white,
    textAlign: "center",
  },
  propertyText: {
    ...Typography.base,
    color: Colors.red,
    marginLeft: 10,
  },
});

export default WordDetailPage;
function setSettingSpeed(setSettingSpeed: any): void {
  throw new Error("Function not implemented.");
}
