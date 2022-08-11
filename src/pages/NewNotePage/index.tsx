import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Text,
  Modal,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput
} from "react-native";
import Button from "components/Button/Button";
import InputBox from "components/InputBox/InputBox";
import TextArea from "components/TextArea/TextArea";
import ModalContainer from "components/Modal/Modal";
import Images from "assets/images";
import Tag from "components/Tag/Tag";
import ActionSheet from "components/ActionSheet/ActionSheet";
import { Colors, Spacing, Typography } from "styles";
import images from "assets/images";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "pages/SplashPage";
import { useNavigation, useRoute } from '@react-navigation/native';
import { RouteProp, NavigationProp, ParamListBase } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from "react-query";
import authDeviceStorage from "services/authDeviceStorage";
import axios from "axios";
import { getTag } from "services/tag";
import { getNoteById } from "services/note";
import { tagOptions } from "utils/constants"; 
// 新增標籤, deleteUserNoteTag, addUserNoteTag, addUserNoteNewTag if edit post, addUserTag if add post, deleteUserNote
const NewNotePage = () => {
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [mainModalVisible, setMainModalVisible] = useState({
    main: false,
    edit: false,
    delete: false,
    action: false
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const firstInput = React.createRef<TextInput>()
  const secondInput = React.createRef<TextInput>()
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const queryClient = useQueryClient();
  const route: RouteProp<{ params: { title: string, tags: [], id: number, content: string, type: string } }, 'params'> = useRoute();
  const { title, tags, content, id, type } = route.params;
  const [note, setNote] = useState<{title: string, content: string, featured_opt: number, tag_ids: number[]}>({
    title: title || "",
    content: content || "",
    featured_opt: 0,
    tag_ids: (tags && tags.map((tag:any) => tag?.id)) || []
  });
  const [tag, setTag] = useState({
    id: "",
    name: ""
  });

  const onSuccessFetchNoteById = (data: any) => {
    setNote({
      ...note,
      title: data.title,
      content: data.content,
      tag_ids: [...data.tags.map((tag:any) => tag?.id)]
    });
  }
  const onErrorFetchNoteById = (data: any) => {}
  const { mutate: handleOngetNoteById } = getNoteById(onSuccessFetchNoteById, onErrorFetchNoteById)
  useEffect(() => {
    if(type === "edit")  handleOngetNoteById(id.toString())
  }, [])

  const onSuccessFetchTags = (data: any) => {}
  const onErrorFetchTags = (data: any) => {}
  const {data: tagsData, isLoading: tagLoading, error: tagError, isError: tagIsError} = getTag([], onSuccessFetchTags, onErrorFetchTags)
  let selectedTag = {
    id: "",
    name: ""
  };
  let token: null = null;

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
      duration: 300,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
  };

  /* 
    Add Form: Add user tag
    Edit Form: Add user-note new tag
  */
  const {mutate:handleOnAddTag} = useMutation(
    async() => {
      try{
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        const data = {...(type === 'edit' && {note_id: id}), tag_name: tag.name}
        await axios.post(`https://www.english4tw.com/api/${type === 'add' ? 'addUserTag' : 'addUserNoteNewTag'}`, data,{ 
          headers: {
            "Authorization" : `Bearer ${token}`,
            "content-type" : "application/json"
          }
        })
      }catch(err){
        console.log(err)
      }
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries('tags')
        setTag({
          id: "",
          name: ""
        })
        setAddModalVisible(!addModalVisible)
      }
    }
  )
  const {mutate:handleOnUpdateTag} = useMutation(
    async() => {
      try{
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        const res = await axios.post("https://www.english4tw.com/api/updateUserTag", { tag_id: parseInt(tag.id), tag_name: tag.name },{ 
          headers: {
            "Authorization" : `Bearer ${token}`,
            "content-type" : "application/json"
          }
        })
      }catch(err){

      }
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries('tags')
        setTag({
          id: "",
          name: ""
        })
        setMainModalVisible({
          ...mainModalVisible,
          edit: false,
          main: false,
        })
      }
    }
  )
  const {mutate:handleOnDeleteTag} = useMutation(
    async() => {
      try{
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        await axios.post("https://www.english4tw.com/api/deleteUserTag", { tag_id: tag.id },{ 
          headers: {
            "Authorization" : `Bearer ${token}`,
            "content-type" : "application/json"
          }
        })
      }catch(err){

      }
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries('tags')
        setTag({
          id: "",
          name: ""
        })
        setMainModalVisible({
          ...mainModalVisible,
          delete: false,
          main: false
        })
      }
    }
  )
  const {mutate:handleOnDeleteNoteTag, isLoading: deleteTagLoading} = useMutation(
    async() => {
      try{
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        const res = await axios.post("https://www.english4tw.com/api/deleteUserNoteTag", { note_id: id, tag_id: tag.id },{ 
          headers: {
            "Authorization" : `Bearer ${token}`,
            "content-type" : "application/json"
          }
        })
      }catch(err){

      }
    },
    {
      onSuccess: () => {
        setNote({...note, tag_ids: note.tag_ids.filter(tagId => tagId !== parseInt(tag.id))})
        setTag({
          id: "",
          name: ""
        })
      }
    }
  )
  const {mutate:handleOnAddNoteTag, isLoading: addTagLoading} = useMutation(
    async() => {
      try{
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        const data = await axios.post("https://www.english4tw.com/api/addUserNoteTag", { note_id: id, tag_id: tag.id },{ 
          headers: {
            "Authorization" : `Bearer ${token}`,
            "content-type" : "application/json"
          }
        })
        return data.data
      }catch(err){

      }
    },
    {
      onSuccess: (data) => {
        setNote({ ...note, tag_ids:[...note.tag_ids, parseInt(tag.id)]})
        setTag({
          id: "",
          name: ""
        })
      }
    }
  )
  const {mutate:handleOnDeleteNote, isLoading: DeleteNoteLoading} = useMutation(
    async() => {
      try{
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        await axios.post("https://www.english4tw.com/api/deleteUserNote", { note_id: id },{ 
          headers: {
            "Authorization" : `Bearer ${token}`,
            "content-type" : "application/json"
          }
        })
      }catch(err){

      }
    },
    {
      onSuccess: () => navigation.navigate('NotePage')
    }
  )
  const {mutate:handleOnSubmit, isLoading} = useMutation(
    async() => {
      try{
        const result = await authDeviceStorage.getItem("JWT_TOKEN");
        if(result) token = JSON.parse(result).token
        switch (type) {
          case 'add':
            await axios.post("https://www.english4tw.com/api/addUserNote", note,{ 
              headers: {
                "Authorization" : `Bearer ${token}`,
                "content-type" : "application/json"
              }
            })
            break;
          case 'edit':
            await axios.post("https://www.english4tw.com/api/updateUserNote", {
              note_id: id,
              title: note.title,
              content: note.content,
              featured_opt: 0,
            },{ 
              headers: {
                "Authorization" : `Bearer ${token}`,
                "content-type" : "application/json"
              }
            })
            break;
        }
      }catch(e){
        throw e
      }
    },
    {
      onSuccess: () => navigation.goBack(),
      onError: (err) => console.log('err,', err)
    }
  )

  const slideUp = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0.01, 1],
          outputRange: [0, -.93 * DEVICE_HEIGHT],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const handleOnAction = (str: string) => {
    switch (str) {
      case "重新命名":
        setMainModalVisible({
          ...mainModalVisible,
          edit: true,
          action: false
        })
        break;
      case "刪除":
        setMainModalVisible({
          ...mainModalVisible,
          delete: true,
          action: false
        })
        break;
    }
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={DeleteNoteLoading || deleteTagLoading || addTagLoading}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={[StyleSheet.absoluteFill, styles.centeredView]}>
          <ActivityIndicator size="large" />
        </View> 
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <ModalContainer
          children={
            <InputBox
              OnChangeText={(str: string) => setTag({...tag, name: str})}
              customStyle={{
                width: 240,
                height: 40,
                marginBottom: 35,
              }}
              placeHolder={"輸入標籤"}
              placeHolderTextColor={Colors.primary_light}
              value={tag.name}
            />
          }
          title={"新增標籤"}
          onCancel={() => setAddModalVisible(!addModalVisible)}
          onConfirm={() => handleOnAddTag()}
        />
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={mainModalVisible.main}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        {
          mainModalVisible.edit && <ModalContainer
            children={
              <InputBox
                OnChangeText={(str: string) => setTag({...tag, name: str})}
                customStyle={{
                  width: 240,
                  height: 40,
                  marginBottom: 35,
                }}
                placeHolder={"輸入標籤"}
                placeHolderTextColor={Colors.primary_light}
                value={tag.name}
              />
            }
            title={"重新命名"}
            onCancel={() => {
              setMainModalVisible({
                ...mainModalVisible,
                main: false,
                edit: false,
              })
            }}
            onConfirm={() =>handleOnUpdateTag()}
          />
        }
        {
          mainModalVisible.delete && <ModalContainer
            title={"刪除"}
            subtitle={"確定要刪除標籤？"}
            onCancel={() => {
              setMainModalVisible({
                ...mainModalVisible,
                main: false,
                delete: false,
              })
            }}
            onConfirm={() => handleOnDeleteTag()}
            confirmString={"確定"}
          />
        }
        {
          mainModalVisible.action && <ActionSheet
            OnCancel={() => setMainModalVisible({
              ...mainModalVisible,
              main: false,
              action: false
            })}
            OnClick={(action: string) => handleOnAction(action)}
            options={tagOptions}
          />
        }
         
      </Modal>
      <View style={styles.container}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.cover, backdrop]}
        />
        <View style={[styles.sheet]}>
          <Animated.View style={[styles.popup, slideUp]}>
            <View style={[styles.sectionRow, {justifyContent: type === "edit" ? "space-between" : "flex-end"}]}>
              {
                type === "edit" &&
                <Button
                  title=""
                  image={images.icons.delete_icon}
                  buttonStyle={{ height: 30, width: 30 }}
                  imageSize={{ height: 30, width: 30 }}
                  type=""
                  onPress={() => handleOnDeleteNote()}
                />
              }
              <Button
                title=""
                image={images.icons.close_icon}
                buttonStyle={{ height: 30, width: 30 }}
                imageSize={{ height: 30, width: 30, marginRight: 0 }}
                type=""
                onPress={() => handleClose()}
              />
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}>
              <ScrollView contentContainerStyle={{flexGrow: 1}} contentInset={{bottom: 80}} showsVerticalScrollIndicator={false}>
                <View style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}>
                  <InputBox
                    OnChangeText={(str: string) => setNote({ ...note, title: str })}
                    customStyle={{
                    width: DEVICE_WIDTH - 40,
                    height: 40,
                    marginBottom: Spacing.space_l,
                    marginTop: 20
                    }}
                    placeHolder={"輸入標題"}
                    placeHolderTextColor={Colors.primary_light}
                    value={note.title}
                    isDisabled={isLoading}
                    onClick={() => {
                      secondInput.current?.focus();
                    }}
                    ref={firstInput}
                  />
                  <TextArea
                    OnChangeText={(str: string) => setNote({ ...note, content: str })}
                    source={Images.icons.microCircle_icon}
                    placeHolder={"輸入內容"}
                    customStyle={{
                      width: DEVICE_WIDTH - 40,
                      height: 270,
                      marginBottom: Spacing.space_l,
                    }}
                    placeHolderTextColor={Colors.primary_light}
                    limit={1000} 
                    value={note.content}  
                    isDisabled={isLoading}
                    ref={secondInput}
                  />
                  <View style={styles.sectionContainer}>
                    <Button
                      title="+"
                      buttonStyle={{
                        width: 38,
                        height: 24,
                        borderRadius: 25,
                        marginRight: 5,
                        marginBottom: 5,
                      }}
                      type="1"
                      onPress={() => setAddModalVisible(true)}
                      isDisabled={isLoading}
                    />
                    {tagsData &&
                      tagsData.map((tag: any, index: React.Key | null | undefined) => {
                        return (
                          <Tag
                            key={index}
                            title={tag['tag_name']}
                            onPressIn={()=>setTag({
                              id: tag.id,
                              name: tag.tag_name
                            })}
                            onPress={() => {
                              if(note.tag_ids.includes(tag['id'])){
                                if(type === "add") {
                                  setNote({...note, tag_ids: note.tag_ids.filter(tagId => tagId !== parseInt(tag.id))})
                                } else {
                                  setNote({...note, tag_ids: note.tag_ids.filter(tagId => tagId !== parseInt(tag.id))})
                                  handleOnDeleteNoteTag(tag['id'])
                                }
                              } else {
                                if(type === "add") {
                                  setNote({ ...note, tag_ids:[...note.tag_ids, parseInt(tag.id)]})
                                } else {
                                  setNote({ ...note, tag_ids:[...note.tag_ids, parseInt(tag.id)]})
                                  handleOnAddNoteTag(tag['tag_name'])
                                }
                              }
                            }}
                            onLongPress={() => {
                              setMainModalVisible({
                                ...mainModalVisible,
                                main: true,
                                action: true
                              })
                            }}
                            customStyle={{
                              paddingHorizontal: 15,
                              paddingVertical: 3,
                              marginRight: 5,
                              marginBottom: 5,
                              height: 24,
                            }}
                            disable={isLoading}
                            isChoosed={note.tag_ids.includes(tag['id'])}
                          />
                        );
                      })}
                  </View>
                  <View style={{ paddingHorizontal: Spacing.space_l }}>
                    <View style={styles.row}>
                      <View style={styles.bullet}>
                        <Text>{"\u2022" + " "}</Text>
                      </View>
                      <View style={styles.bulletText}>
                        <Text
                          style={styles.info}
                        >
                          你可以新增英文和中文到筆記裡,
                          英文可以使用發音和單字查詢功能, 中文則無.
                        </Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.bullet}>
                        <Text>{"\u2022" + " "}</Text>
                      </View>
                      <View style={styles.bulletText}>
                        <Text
                          style={styles.info}
                        >
                          為避免影響音擋播放功能,
                          點擊播放鍵後開始20秒內將無法操作其他功能.
                        </Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.bullet}>
                        <Text>{"\u2022" + " "}</Text>
                      </View>
                      <View style={styles.bulletText}>
                        <Text
                          style={styles.info}
                        >
                          若要改變音擋的播放段落, 將文章依需求段行即可
                        </Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.bullet}>
                        <Text>{"\u2022" + " "}</Text>
                      </View>
                      <View style={styles.bulletText}>
                        <Text
                          style={styles.info}
                        >
                          長按標籤即可進行編輯/刪除
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Button
                    title="完成"
                    buttonStyle={{
                      width: 335,
                      height: 50,
                      borderRadius: 25,
                      marginTop: 25,
                    }}
                    fontStyle={{
                      ...Typography.base_bold
                    }}
                    type="1"
                    onPress={() => handleOnSubmit()}
                    isDisabled={isLoading}
                  />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bullet: {
    
    width: 10,
  },
  bulletText: {},
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  container: {
    flex: 1,
  },
  cover: {
    backgroundColor: Colors.page_modal_background,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  sheet: {
    height: DEVICE_HEIGHT,
    justifyContent: "flex-end",
    position: "absolute",
    top: DEVICE_HEIGHT,
    left: 0,
    right: 0, 
  },
  topic: {
    flexDirection: "row",
    alignItems: "center",
    ...Typography.base_bold,
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
    height: DEVICE_HEIGHT,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    position: 'relative'
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: Colors.gray_4,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    paddingVertical: 20,
  },
  sectionContainer: {
    width: DEVICE_WIDTH,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 5,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 21,
  },
  actionsheet: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  info: {
    ...Typography.sm,
      color: Colors.gray_3,
  }
});

export default NewNotePage;
