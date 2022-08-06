import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "components/Button/Button";
import ModalContainer from "components/Modal/Modal";
import images from "assets/images";
import * as Speech from 'expo-speech';
import Card from "components/Card/Card";
import { DEVICE_WIDTH } from "pages/SplashPage";
import { SItem } from "types/pages/note";
import { Colors, Typography } from "styles";
import LinearGradientLayout from "components/LinearGradientLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSavedWords } from "services/word";
import { useFocusEffect } from "@react-navigation/native";
import authDeviceStorage from "services/authDeviceStorage";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import api from "services/api";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { setSetting } from "actions/setting";
import { sortOptions } from "utils/constants";
interface IPinPush {
  id: number,
  pinned: number
}

const SavedItem: React.FC<SItem> = ({ title, detail, buttons, OnClick, OnCompare }) => {
  return (
    <Card
      title={title}
      OnClick={OnClick}
      customStyle={{ marginBottom: 20 }}
      detail={detail}
      buttons={buttons}
      manualCompare={true}
    />
  );
};

// { word: "test1", detail: "A test1", speech: "v. 動詞", subtitle: "可數與不可數 --" }
const SavedWordPage = ({ navigation }: { navigation: any }) => {
  const choices = ["最近", "最早", "A - Z", "Z - A", "詞性"]
  const [selected, setSelected] = useState((choices && choices[0]) || "");
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch: Dispatch<any> = useDispatch()
  const queryClient = useQueryClient()
  const insets = useSafeAreaInsets();
  const {isLoggedIn}: any = useSelector(
    (state: any) => state.user,
    shallowEqual
  );
  const handleBack = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
  };

  const onSuccessFetchSavedWords = (data: any) => {
    if(data==='Unauthorized'){

    } else{
      console.log('onSuccessFetchSavedWords')
    }
    
  }
  const onErrorFetchSavedWords = (data: any) => console.log('onErrorFetchNotes')
  const {data, isLoading, error, isError, refetch} = getSavedWords([], onSuccessFetchSavedWords, onErrorFetchSavedWords,{
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

 useFocusEffect(
    useCallback(() => {
      refetch()
    }, [])
  )

  const handleOnWordPlay = (str: string) => {
    Speech.speak(str);
  }
   
  const {mutate:handleOnPushPinClick } = useMutation(
    async({id, pinned}: IPinPush) => {
      try{
        let token = null;
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        const res = await api.post(`api/toggleUserWordPinned`, { word_id: id} ,{ 
          headers: {
            "Authorization" : `Bearer ${token}`,
            "content-type" : "application/json"
          }
        })
        return {id, pinned}
      }catch(err){
        console.log(err)
      }
    },
    {
      onSuccess: (data: any) => {
        const {id, pinned} = data
        queryClient.setQueryData('saved_words', (prev: any) => {
          const newArr = prev.map((item:any) => {
            if(item.id === id){
              return {
                ...item,
                pinned: pinned === 1 ? 0 : 1
              }
            } else {
              return item
            }
          })
          return newArr;
        })
      }
    }
  )

  const {mutate:handleOnDeletedWord} = useMutation(
    async(id: number) => {
      try{
        let token = null;
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        const res = await api.post(`api/deleteUserWord`, { word_id: id} ,{ 
          headers: {
            "Authorization" : `Bearer ${token}`,
            "content-type" : "application/json"
          }
        })

        return id
      }catch(err){
        console.log(err)
      }
    },
    {
      onSuccess: (word_id) => {
        queryClient.setQueryData('saved_words', (prev: any) => {
          const newArr = prev.filter((data:any) => data.id !== word_id)
          return newArr;
        })
      }
    }
  )

  const handleOnWordCompare = (str: string) => {
    navigation.push("WordComparePage", {
      first: str
    });
  };

  const handleOnWordClick = async(str: string) => {
    const result = await AsyncStorage.getItem('@word_history')
      navigation.push("WordDetailPage", {
        word: str,
        history: result ? result : '[]'
      });
  }
  const {sort}: any = useSelector(
    (state: any) => state.setting,
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
          content={sortOptions}
          title={"排序"}
          onCancel={() => setModalVisible(!modalVisible)}
          defaultValue={sort}
          onConfirm={(option: string) => {
            dispatch(setSetting({sort: option}))
            setModalVisible(!modalVisible)
          }}
        />
      </Modal>
      <LinearGradientLayout>
        <SafeAreaView
          style={{
            marginTop: 10,
            height: "100%",
            alignItems: "center",
            width: DEVICE_WIDTH,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20
            }}
          >
            <View
              style={{ flex: 1, alignItems: "flex-start" }}
            >
              <Button
                title=""
                image={images.icons.leftarrow_icon}
                customStyle={{}}
                imageSize={{ height: 20, width: 12, marginRight: 0 }}
                type=""
                onPress={() => handleBack()}
              />
            </View>

            <Text
              style={ Typography.pageTitle as TextStyle }
            >
              儲存字彙
            </Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() => {
                  // setIsOpenModal(true);
                  setModalVisible(true);
                }}
              >
                <Image
                  style={styles.iconotestyle}
                  source={images.icons.filter_btn_icon}
                />
              </TouchableOpacity>
            </View>
          </View>
          { isLoading ? <ActivityIndicator size="large" /> : 
          data === 'Unauthorized' ? 
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                paddingBottom: 83,
              }}
            >
              <Image
                style={styles.imagefavstyle}
                source={images.icons.non_favorite_icon}
              />
              <Text style={{ color: Colors.gray_4 }}>
                尚未登入
              </Text>
            </View>
              : data.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                paddingBottom: 83,
              }}
            >
              <Image
                style={styles.imagefavstyle}
                source={images.icons.non_favorite_icon}
              />
              <Text style={{ color: Colors.gray_4 }}>
                尚未儲存字彙
              </Text>
            </View>
          ) : (
              <View
                style={{ width: "100%", paddingHorizontal: 20, marginTop: 30 }}
              >
                <FlatList
                  contentContainerStyle={{
                    flexGrow: 1,
                  }}
                  showsVerticalScrollIndicator={false}
                  data={data}
                  renderItem={({ item, index }) => (
                    <SavedItem
                      key={index}
                      title={item.word}
                      detail={item.def}
                      buttons={[
                        {
                          name: 'volumn',
                          path: images.icons.volume_icon,
                          onClick: () => handleOnWordPlay(item.word)
                        },
                        {
                          name: 'favorite',
                          path: images.icons.favorited_icon,
                          onClick: () => handleOnDeletedWord(parseInt(item.id))
                        },
                        {
                          name: 'pushpin',
                          path: item.pinned === 1 ? images.icons.push_pin_selected_icon : images.icons.push_pin_icon,
                          onClick: () =>  handleOnPushPinClick({id: parseInt(item.id), pinned: item.pinned})
                        },
                        {
                          name: 'compare',
                          path: images.icons.compare_icon,
                          onClick: () =>  handleOnWordCompare(item.word)
                        },
                      ]}
                      OnClick={() => handleOnWordClick(item.word)}
                      OnCompare={() => handleOnWordCompare(item.word)}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
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
  noteItem: {
    width: DEVICE_WIDTH,
    paddingHorizontal: 20,
    height: 60,
    justifyContent: "center",
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
    backgroundColor: Colors.white,
  },
  imagefavstyle: {
    resizeMode: "contain",
    width: 355,
    height: 255,
  },
  iconotestyle: {
    resizeMode: "contain",
    width: 30,
    height: 30,
  },
});

export default SavedWordPage;
