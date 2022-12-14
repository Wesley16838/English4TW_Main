import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import ModalContainer from "components/Modal/Modal";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import SearchBox from "components/SearchBox/SearchBox";
import TextArea from "components/TextArea/TextArea";
import InputBox from "components/InputBox/InputBox";
import Button from "components/Button/Button";
import Images from "assets/images";
import Card from "components/Card/Card";
import { Colors, Spacing, Typography } from "styles";
import { DEVICE_WIDTH } from "pages/SplashPage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import LinearGradientLayout from "components/LinearGradientLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import words from "assets/words/words.json";
import WordList from "components/WordList";
import { Dispatch } from "redux";
import { setSetting } from "actions/setting";
import * as Speech from "expo-speech";
import Toast from "react-native-root-toast";
import { getUserWords } from "services/word";
import { levelOptions } from "utils/constants";
import { StackNavigationProp } from "@react-navigation/stack";
// daily word change everytime
const HomePage = () => {
  const [searchWord, setSearchWord] = useState("");
  const [sentence, setSentence] = useState("");
  const [compareWords, setCompareWords] = useState({
    first: "",
    second: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [usersWord, setUsersWord] = useState<any>("")
  const firstInput = React.createRef<TextInput>();
  const secondInput = React.createRef<TextInput>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch: Dispatch<any> = useDispatch();
  const { isLoggedIn }: any = useSelector(
    (state: any) => state.user,
    shallowEqual
  );
  const { dailyword }: any = useSelector(
    (state: any) => state.word,
    shallowEqual
  );
  const { level }: any = useSelector(
    (state: any) => state.setting,
    shallowEqual
  );

  const onSuccessFetchUserWords = (data: any) => {
    if (data === "Unauthorized") {
    } else {
      const word = data[levelOptions.indexOf(level)][Math.floor(Math.random() * 2)];
      setUsersWord(word)
    }
  };

  const onErrorFetchUserWords = (data: any) => {};

  const { data, isLoading, refetch } = getUserWords(
    [],
    onSuccessFetchUserWords,
    onErrorFetchUserWords,
    {
      enable: false
    }
  );

  useEffect(()=> {
    if(isLoggedIn) refetch()
  }, [isLoggedIn])

  const filterData = words.filter(
    (word) => searchWord && word.indexOf(searchWord.toUpperCase()) === 0
  );

  const handleOnChange = (str: string) => {
    setSearchWord(str);
  };

  const handleOnSearch = async () => {
    try {
      if (isLoggedIn) {
        if (searchWord.length === 0) {
          Toast.show("???????????????", {
            duration: Toast.durations.SHORT,
            shadow: false,
          });
        } else {
          const result = await AsyncStorage.getItem("@word_history");
          navigation.push("WordDetailPage", {
            word: searchWord,
            history: result ? result : "[]",
          });
        }
      } else {
        Toast.show("????????????", {
          duration: Toast.durations.SHORT,
          shadow: false,
        });
      }
    } catch (err) {
      console.log("err,", err);
    }
  };

  const handleOnCompare = () => {
    if (isLoggedIn) {
      if (!!compareWords.first && !!compareWords.second) {
        navigation.push("WordComparePage", {
          first: compareWords.first,
          second: compareWords.second,
        });
        setCompareWords({
          first: "",
          second: "",
        });
      } else {
        Toast.show("????????????????????????", {
          duration: Toast.durations.SHORT,
          shadow: false,
        });
      }
    } else {
      Toast.show("????????????", {
        duration: Toast.durations.SHORT,
        shadow: false,
      });
    }
  };

  const handleOnAnalyze = (str: string) => {
    if (isLoggedIn) {
      if (str.length === 0) {
        Toast.show("???????????????", {
          duration: Toast.durations.SHORT,
          shadow: false,
        });
      } else {
        navigation.push("SentenceAnalysisPage", {
          sentence: str,
        });
        setSentence("");
      }
    } else {
      Toast.show("????????????", {
        duration: Toast.durations.SHORT,
        shadow: false,
      });
    }
  };

  const handleOnwordDetailPage = (str: string) => {
    if (isLoggedIn) {
      navigation.push("WordDetailPage", {
        word: str,
      });
    } else {
      Toast.show("????????????", {
        duration: Toast.durations.SHORT,
        shadow: false,
      });
    }
  };

  const handleOnWordPlay = (str: string) => {
    Speech.speak(str);
  };

  // const userWord =
  //   isLoggedIn &&
  //   data !== undefined &&
  //   data[levelOptions.indexOf(level)][Math.floor(Math.random() * 2)];

  const reset = () => {
    if (!!sentence) setSentence("");
    if (!!searchWord) setSearchWord("");
    if (!!compareWords.first || !!compareWords.second)
      setCompareWords({
        first: "",
        second: "",
      });
  };

  const isFocused = useIsFocused();

  if (!isFocused) reset();

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
          content={levelOptions}
          title={"????????????"}
          onCancel={() => setModalVisible(!modalVisible)}
          defaultValue={level}
          onConfirm={(option: string) => {
            dispatch(setSetting({ level: option }));
            const word = data[levelOptions.indexOf(level)][Math.floor(Math.random() * 2)];
            setUsersWord(word)
            setModalVisible(!modalVisible);
          }}
        />
      </Modal>
      <LinearGradientLayout>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={40}
          style={styles.container}
        >
          <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
            <SearchBox
              customStyle={{
                width: DEVICE_WIDTH - 40,
                marginHorizontal: 20,
                marginVertical: 10,
              }}
              OnChange={(str: string) => handleOnChange(str)}
              OnClick={() => handleOnSearch()}
              placeHolder={"???????????????????????????"}
              placeHolderTextColor={"rgba(196, 129, 72, 0.5)"}
              value={searchWord}
            />
            {searchWord.length === 0 ? (
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.section}>
                  <View style={styles.topic}>
                    <Image
                      style={styles.topicIcon}
                      source={Images.icons.arrow_icon}
                    />
                    <Text style={Typography.base_bold}>????????????</Text>
                  </View>
                  <TextArea
                    OnChangeText={(str: string) => setSentence(str)}
                    value={sentence}
                    OnClick={() => handleOnAnalyze(sentence)}
                    placeHolder={"????????????"}
                    customStyle={{ width: DEVICE_WIDTH - 40, height: 150 }}
                    placeHolderTextColor={Colors.primary_light}
                    limit={100}
                  />
                </View>
                <View style={styles.section}>
                  <View style={styles.topic}>
                    <Image
                      style={styles.topicIcon}
                      source={Images.icons.arrow_icon}
                    />
                    <Text style={Typography.base_bold}>????????????</Text>
                  </View>
                  <View style={[styles.sectionCol]}>
                    <InputBox
                      OnChangeText={(str: string) =>
                        setCompareWords({ ...compareWords, first: str })
                      }
                      customStyle={{
                        width: "auto",
                        alignSelf: "stretch",
                        height: 40,
                      }}
                      placeHolder={"????????????"}
                      placeHolderTextColor={Colors.primary_light}
                      value={compareWords.first}
                      onClick={() => {
                        secondInput.current?.focus();
                      }}
                      ref={firstInput}
                    />
                    <Text
                      style={{
                        alignSelf: "center",
                        height: 30,
                        lineHeight: 30,
                        textAlignVertical: "center",
                        marginHorizontal: 10,
                        fontSize: 20,
                        color: "rgba(0, 0, 0, 0.4)",
                      }}
                    >
                      vs
                    </Text>
                    <InputBox
                      OnChangeText={(str: string) =>
                        setCompareWords({ ...compareWords, second: str })
                      }
                      customStyle={{
                        width: "auto",
                        alignSelf: "stretch",
                        height: 40,
                        marginBottom: 10,
                      }}
                      placeHolder={"????????????"}
                      placeHolderTextColor={Colors.primary_light}
                      value={compareWords.second}
                      ref={secondInput}
                      returnKeyType={"done"}
                    />
                    <Button
                      title="??????"
                      onPress={() => handleOnCompare()}
                      buttonStyle={{
                        width: 72,
                        height: 30,
                        borderRadius: 16,
                        alignSelf: "flex-end",
                      }}
                      type="1"
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.section,
                    { marginBottom: isLoggedIn ? 0 : 75 },
                  ]}
                >
                  <View style={styles.topic}>
                    <Image
                      style={styles.topicIcon}
                      source={Images.icons.arrow_icon}
                    />
                    <Text style={Typography.base_bold}>????????????</Text>
                  </View>
                  <Card
                    title={dailyword}
                    OnClick={() => handleOnwordDetailPage(dailyword)}
                    customStyle={{ width: DEVICE_WIDTH - 40 }}
                    buttons={[
                      {
                        name: "volumn",
                        path: Images.icons.volume_icon,
                        onClick: () => handleOnWordPlay(dailyword),
                      },
                    ]}
                  />
                </View>
                {isLoggedIn && data !== undefined && (
                  <View style={[styles.section, { marginBottom: 75 }]}>
                    <View style={styles.topicOther}>
                      <View style={{ flexDirection: "row" }}>
                        <Image
                          style={styles.topicIcon}
                          source={Images.icons.arrow_icon}
                        />
                        <Text style={Typography.base_bold}>????????????</Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(true);
                        }}
                      >
                        <Image
                          style={styles.filterIcon}
                          source={Images.icons.filter_icon}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.daily}>
                      <Card
                        title={usersWord.uw}
                        detail={usersWord.def}
                        OnClick={() => handleOnwordDetailPage(usersWord.uw)}
                        customStyle={{ width: DEVICE_WIDTH - 40 }}
                        buttons={[
                          {
                            name: "volumn",
                            path: Images.icons.volume_icon,
                            onClick: () => handleOnWordPlay(usersWord.uw),
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </ScrollView>
            ) : (
              <WordList data={filterData} />
            )}
          </SafeAreaView>
        </KeyboardAvoidingView>
      </LinearGradientLayout>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: Spacing.space_l,
    marginTop: 20,
  },
  topic: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  topicOther: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  topicIcon: {
    height: 16,
    width: 16,
    resizeMode: "contain",
    marginRight: 5,
  },
  sectionRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionCol: {
    flexDirection: "column",
  },
  daily: {
    flexDirection: "column",
  },
  filterIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
  },
});

export default HomePage;
