import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import Button from "components/Button/Button";
import InputBox from "components/InputBox/InputBox";
import Label from "components/Label/Label";
import images from "assets/images";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "pages/SplashPage";
import { Colors, Typography } from "styles";
import { getWords } from "services/word";
import { speechObj } from "utils/constants";
import Images from "assets/images";

const WordComparePage = () => {
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const route: RouteProp<{ params: { first: string, second: string } }, 'params'> = useRoute();
  const { first, second } = route.params;
  const [compareWord, setCompareWord] = useState("");
  const screenHeight = Dimensions.get("window").height;

  const backdrop = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 0.01],
          outputRange: [screenHeight, 0],
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
    // setTimeout(() => {
    //   navigation.goBack();
    // }, 200);
  };
  const handleBack = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
    // setTimeout(() => {
    //   navigation.goBack();
    // }, 200);
  };
  const handleNext = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
    // setTimeout(() => {
    //   navigation.push("sentenceAnalysisPage");
    // }, 200);
  };

  const slideUp = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0.01, 1],
          outputRange: [0, -.93 * screenHeight],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const handleOnWordPlay = (str: string) => {
    Speech.speak(str);
  }

  const {data: firstData, isLoading: isLoadingFirst} = getWords(first)
  const {data: secondData, isLoading: isLoadingSecond} = getWords(second)
  console.log('first,', firstData, isLoadingFirst)
  console.log('second,', secondData, isLoadingSecond)
  let speech = ""
  if(!isLoadingFirst && !isLoadingSecond) {
    const firstSpeechArr = Object.keys(firstData.content)
    const secondSpeechArr = Object.keys(secondData.content)
    const firstLength = firstSpeechArr.length
    const secondLength = secondSpeechArr.length
    if(firstLength>=secondLength){
      secondSpeechArr.every(item => {
        if(firstSpeechArr.includes(item)){
          speech = item
          return false
        }  
        return true
      })
    } else {
      firstSpeechArr.every(item => {
        if(secondSpeechArr.includes(item)){
          speech = item
          return false
        }  
        return true
      })
    }
  }
  return (
    <View style={styles.container}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.cover, backdrop]}
      />
      <View style={[styles.sheet]}>
        <Animated.View style={[styles.popup, slideUp]}>
          <View style={styles.sectionRow}>
            <Button
              title=""
              image={images.icons.close_icon}
              customStyle={{}}
              imageSize={{ height: 30, width: 30, marginRight: 0 }}
              type=""
              onPress={() => handleClose()}
            />
          </View>
          <ScrollView contentInset={{top: 0}} showsVerticalScrollIndicator={false} automaticallyAdjustContentInsets={false}>
            {
              isLoadingFirst || isLoadingSecond ? 
                <View style={styles.centeredView}>
                  <ActivityIndicator size="large" />
                </View> 
                :
                <View style={styles.sectionColumn}>
                  <View
                    style={{
                      marginBottom: 30,
                      marginTop: 20,
                    }}
                  >
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={styles.compareWord}>{first}</Text>
                      <TouchableWithoutFeedback onPress={() => handleOnWordPlay(first)}>
                        <Image
                          source={Images.icons.volume_icon}
                          style={{ width: 30, height: 30 }}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                  
                    <View style={styles.labelContainer}>
                      <Label title={speechObj[speech]}/>
                    </View>
                    <View style={styles.desWrapper}>
                      {
                        firstData.content[speech]['simple'].map((obj: any) => {
                          return obj['definitions'].map((def: string) => {
                            return <Text style={styles.compareWordDes}>{def}</Text>
                          })
                        })
                      }
                    </View>
                  </View>
                  <View
                    style={{
                      alignItems: "center",
                      height: 20,
                      justifyContent: "center",
                      flexDirection: "row"
                    }}
                  >
                    <View style={{borderBottomColor: "#4F4F4F", borderBottomWidth: 1, flex: 1}}/>
                    <Text style={{marginHorizontal: 10, color: "#828282", fontWeight: "bold", fontSize: 17}}>VS</Text>
                    <View style={{borderBottomColor: "#4F4F4F", borderBottomWidth: 1, flex: 1}}/>
                  </View>
                  <View
                    style={{
                      marginBottom: 30,
                      marginTop: 20,
                    }}
                  >
                    {second.length === 0 ? (
                      <>
                        <InputBox
                          OnChangeText={(str: string) => setCompareWord(str)}
                          customStyle={{
                            width: DEVICE_WIDTH - 40,
                            height: 40,
                            marginTop: 20,
                          }}
                          placeHolder={"輸入內容"}
                          placeHolderTextColor={Colors.primary_light}
                          value={compareWord}
                        />
                        {false && (
                          <>
                            <Text style={styles.compareWordKK}>{second}</Text>
                            <View style={styles.labelContainer}>
                              <Label title={speechObj[speech]} />
                            </View>
                            <Text style={styles.compareWordDes}>{second}</Text>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                         <View style={{flexDirection: "row", alignItems: "center"}}>
                          <Text style={styles.compareWord}>{second}</Text>
                          <TouchableWithoutFeedback onPress={() => handleOnWordPlay(second)}>
                            <Image
                              source={Images.icons.volume_icon}
                              style={{ width: 30, height: 30 }}
                            />
                          </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.labelContainer}>
                          <Label title={speechObj[speech]}/>
                        </View>
                        <View style={styles.desWrapper}>
                          {
                            secondData.content[speech]['simple'].map((obj: any) => {
                              return obj['definitions'].map((def: string) => {
                                return <Text style={styles.compareWordDes}>{def}</Text>
                              })
                            })
                          }
                        </View>
                      </>
                    )}
                  </View>
                </View>
            }
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
  popup: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    minHeight: Dimensions.get("window").height - 54,
    height: DEVICE_HEIGHT,
  },
  sectionRow: {
    height: 67,
    flexDirection: "row",
    justifyContent: "flex-end",
    borderBottomColor: Colors.gray_4,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  actionsheet: {
    width: 77,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingBottom: 20,
    alignItems: "flex-start",
  },
  compareWord: {
    ...Typography.xxl,
    marginRight: 10,
  },
  compareWordKK: {
    ...Typography.sm,
    color: Colors.gray_3,
    marginTop: 5,
    marginBottom: 20,
  },
  compareWordDes: {
    ...Typography.base,
    lineHeight: 25,
  },
  labelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 30,
  },
  desWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5
  },
  centeredView: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WordComparePage;
