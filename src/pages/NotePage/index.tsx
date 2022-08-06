import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useIsFocused, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Button from "components/Button/Button";
import images from "assets/images";
import { Colors, Spacing, Typography } from "styles";
import Tag from "components/Tag/Tag";
import { DEVICE_WIDTH } from "pages/SplashPage";
import { NItem } from "types/pages/note";
import LinearGradientLayout from "components/LinearGradientLayout";
import ModalContainer from "components/Modal/Modal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import authDeviceStorage from "services/authDeviceStorage";
import { getTag } from "services/tag";
import { getAllNotes } from "services/note";
import { shallowEqual, useSelector } from "react-redux";

const NoteItem: React.FC<NItem> = ({ word, index, id }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const handleOnNoteContent = () => {
    navigation.push("NoteContentPage", {
      id
    });
  };
  return (
    <TouchableOpacity onPress={() => handleOnNoteContent()} key={index}>
      <View
        style={[
          styles.noteItem,
          {
            borderTopWidth: index === 1 ? 1 : 0,
            borderTopColor: Colors.primary,
          },
        ]}
      >
        <Text style={{...Typography.base}}>
          {index}. {word}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const NotePage = ({ navigation }: { navigation: any }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState<any>([])
  const [tags, setTags] = useState<any>([])
  const [tagsData, setTagsData] = useState<any>([])
  const queryClient = useQueryClient();
  const {isLoggedIn}: any = useSelector(
    (state: any) => state.user,
    shallowEqual
  );
  const onSuccessFetchTags = (data: any) => {
    queryClient.setQueryData('tagsData', data);
    setTagsData(data)
  }
  const onErrorFetchTags = (data: any) => console.log('onErrorFetchTags')
  const {data: tagData, isLoading: tagLoading, error: tagError, isError: tagIsError, refetch: tagRefetch} = getTag([isLoggedIn], onSuccessFetchTags, onErrorFetchTags, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const onSuccessFetchNotes = (data: any) => {
    queryClient.setQueryData('notesData', data);
    setNotes(data);
  }
  const onErrorFetchNotes = (data: any) => console.log('onErrorFetchNotes')
  const {data: noteData, isLoading: noteLoading, error: noteError, isError: noteIsError, refetch: noteRefetch} = getAllNotes([isLoggedIn], onSuccessFetchNotes, onErrorFetchNotes,{
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  useFocusEffect(
    useCallback(() => {
      noteRefetch()
      tagRefetch()
      setTags([])
    }, [])
  )

  const insets = useSafeAreaInsets();

  const handleOnFilter = () => { 
    const newArr: number[] = []
    for(let i = 0; i<noteData.length; i++){
      if(tags.every((item:any) => noteData[i]['tag_ids'].includes(item))) newArr.push(noteData[i])
    }
    setNotes(newArr)
  };

  const handleOnAddNote = () => {
    if(!(notes.length === 5)) {
      navigation.push("NewNotePage", {
        type: "add"
      })
    } else {
      setModalVisible(true)
    }
  }

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
          title={"筆記數量已達上限, 請升級或刪除其他筆記!"}
          onCancel={() => setModalVisible(false)}
          onConfirm={() => {
            setModalVisible(false)
            navigation.navigate('SubscribePage')
          }}
          confirmString={"立即升級"}
        />
      </Modal>
      <LinearGradientLayout>
        <SafeAreaView
          style={{
            marginTop: StatusBar.currentHeight,
            paddingTop: 10,
            height: "100%",
            alignItems: "center",
            width: DEVICE_WIDTH,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <Button
            title="新增筆記"
            onPress={handleOnAddNote}
            customStyle={{
              width: 150,
              height: 40,
              borderRadius: 20,
              flexDirection: "row",
              marginBottom: 33,
            }}
            imageSize={{
              width: 16,
              height: 16,
              marginRight: 7,
            }}
            type="2"
            image={images.icons.add_icon}
            isDisabled={noteData === 'Unauthorized' && tagData === 'Unauthorized'}
          />
          {
            noteLoading && tagLoading ? <ActivityIndicator size="large" /> : 
            <>
              {
                (tagData !== undefined && tagData !== 'Unauthorized') && 
                <View style={styles.sectionRow}>
                  {
                    tagsData.map((tag:any, index: React.Key | null | undefined) => {
                      return (
                        <Tag
                          key={index}
                          title={tag['tag_name']}
                          onPress={()=>handleOnFilter()}
                          customStyle={{
                            paddingHorizontal: 15,
                            paddingVertical: 3,
                            marginRight: 5,
                            marginBottom: 5,
                            height: 24,
                          }}
                          disable={false}
                          onPressIn={() => {
                            if(tags.includes(tag['id'])){
                              setTags(tags.filter((item: number) => item!== tag['id']))
                            } else {
                              setTags([...tags, tag['id']])
                            }
                          }}
                          isChoosed = {tags.includes(tag['id'])}
                        />
                      );
                    })
                  }
                </View>
              }
              {
                (noteData !== 'Unauthorized' && noteData !== undefined) ? 
                (noteData.length === 0) ? 
                  <View
                    style={{
                      flex: 1,
                      paddingBottom: 83,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={styles.imagenotestyle}
                      source={images.icons.note_icon}
                    />
                    <Text style={{ color: Colors.gray_4 }}>尚未新增筆記</Text>
                  </View>
                  :
                  <FlatList
                    contentContainerStyle={{
                      flexGrow: 1,
                    }}
                    showsVerticalScrollIndicator={false}
                    data={notes}
                    renderItem={({ item, index }) => (
                      <NoteItem key={index} word={item.title} index={index + 1} id={item.id} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                : 
                <View
                    style={{
                      flex: 1,
                      paddingBottom: 83,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={styles.imagenotestyle}
                      source={images.icons.note_icon}
                    />
                    <Text style={{ color: Colors.gray_4 }}>尚未登入</Text>
                  </View>
              }
            </>
          }
        </SafeAreaView>
      </LinearGradientLayout>
    </>
  );
};
const styles = StyleSheet.create({
  sectionRow: {
    width: DEVICE_WIDTH,
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
    height: 60,
    justifyContent: "center",
    paddingHorizontal: Spacing.space_l,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 1,
    backgroundColor: Colors.white,
  },
  imagenotestyle: {
    width: 355,
    height: 255,
    resizeMode: "contain",
  },
});

export default NotePage;
