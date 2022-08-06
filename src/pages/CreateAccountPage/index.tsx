import React from "react";
import {
  StyleSheet,
  View,
  Animated,
  Image,
  Text,
  Modal,
  Alert,
  TextStyle,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { NavigationProp, ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Button from "components/Button/Button";
import InputBox from "components/InputBox/InputBox";
import CheckBox from "components/Checkbox/Checkbox";
import ProfileImage from "components/ProfileImage/ProfileImage";
import ActionSheet from "components/ActionSheet/ActionSheet";
import images from "assets/images";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "pages/SplashPage";
import api from "services/api"
import { Colors, Spacing, Typography } from "styles";

const CreateAccountPage = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const route: RouteProp<{ params: { title: string } }, 'params'> = useRoute();
  const [animation, setAnimation] = React.useState(new Animated.Value(0));
  const { title } = route.params;
  const [account, setAccount] = React.useState({
    fullname: "",
    email: "",
    password: "",
    secondpassword: "",
    tos: false,
  });
  const [checked, onCheck] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [actionsheet, openActionsheet] = React.useState(false);
  const [pickedImagePath, setPickedImagePath] = React.useState("");
  const options = ["移除目前的相片", "相機", "從相簿"];
  const onCreateAccountNext = async () => {
    try {
      let formData = new FormData();
      formData.append("data", JSON.stringify(account));
      await api.post("/registration", {
        formData,
      });
      setStep(2);
    } catch (err) {
      console.log("err,", err);
    }
  };
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
    navigation.navigate("LoginPage");
  };
  const handleBack = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    navigation.goBack();
  };

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

  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }
    openActionsheet(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }
    openActionsheet(false);
    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  };

  const handleOnAction = (str: string) => {
    switch (str) {
      case "移除目前的相片":
        setPickedImagePath("");
        break;
      case "相機":
        openCamera();
        break;
      case "從相簿":
        showImagePicker();
        break;
    }
  };
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={actionsheet}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <ActionSheet
          OnCancel={() => openActionsheet(false)}
          OnClick={(action: string) => handleOnAction(action)}
          options={options}
        />
      </Modal>
      <View style={styles.container}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.cover, backdrop]}
        />
        <View style={[styles.sheet]}>
          <Animated.View style={[styles.popup, slideUp]}>
            <View style={styles.sectionRow}>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                {step === 1 && (
                  <Button
                    image={images.icons.leftarrow_icon}
                    imageSize={{ height: 20, width: 12, marginRight: 0 }}
                    type=""
                    onPress={() => handleBack()}
                  />
                )}
              </View>
              <Text style={ Typography.pageTitle as TextStyle }>
                {title}
              </Text>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Button
                  image={images.icons.close_icon}
                  imageSize={{ height: 30, width: 30, marginRight: 0 }}
                  type=""
                  onPress={() => handleClose()}
                />
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: "center"}}>
              <View>
                {step === 2 && (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingBottom: 66,
                    }}
                  >
                    <Image
                      source={images.icons.success_icon}
                      style={{ width: 205, height: 205, resizeMode: "contain" }}
                    />
                    <Text
                      style={{
                        ...Typography.base_secondary
                      }}
                    >
                      請至電子郵件收發帳戶認證信件, 方能完成註冊程序.
                    </Text>
                  </View>
                )}
                {step === 1 && (
                  <>
                    <View style={{marginVertical: 20,}}>
                      <ProfileImage
                        name={
                          pickedImagePath !== ""
                            ? pickedImagePath
                            : images.icons.default_profileimage
                        }
                        customStyle={{
                          height: 130,
                          width: 130,
                          
                          marginBottom: 30,
                          borderRadius: 65,
                          alignSelf: "center"
                        }}
                      />
                      <View style={{alignSelf: 'center'}}>
                        <Button
                          type="text"
                          fontStyle={{
                            ...Typography.base_secondary,
                          }}
                          title="變更頭像"
                          onPress={() => openActionsheet(!actionsheet)}
                        />
                      </View>                   
                    </View>
                    <InputBox
                      OnChangeText={(str: string) =>
                        setAccount({
                          ...account,
                          fullname: str,
                        })
                      }
                      customStyle={styles.inputSection}
                      placeHolder={"例如：王小明"}
                      placeHolderTextColor={Colors.primary_light}
                      value={account.email}
                      title={"姓名"}
                    />
                    <InputBox
                      OnChangeText={(str: string) =>
                        setAccount({
                          ...account,
                          email: str,
                        })
                      }
                      customStyle={styles.inputSection}
                      placeHolder={"例如：XXXXXX@gmail.com"}
                      placeHolderTextColor={Colors.primary_light}
                      value={account.email}
                      title={"電子信箱"}
                    />
                    <InputBox
                      OnChangeText={(str: string) =>
                        setAccount({
                          ...account,
                          password: str,
                        })
                      }
                      customStyle={styles.inputSection}
                      placeHolder={"需有大小寫字母加數字"}
                      placeHolderTextColor={Colors.primary_light}
                      value={account.email}
                      title={"密碼"}
                    />
                    <InputBox
                      OnChangeText={(str: string) =>
                        setAccount({
                          ...account,
                          secondpassword: str,
                        })
                      }
                      customStyle={styles.inputSection}
                      placeHolder={"再一次輸入密碼"}
                      placeHolderTextColor={Colors.primary_light}
                      value={account.email}
                      title={"確認密碼"}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignSelf: "flex-start",
                      }}
                    >
                      <CheckBox
                        checked={checked}
                        OnClick={() =>
                          setAccount({
                            ...account,
                            tos: !account.tos,
                          })
                        }
                        customStyle={{
                          width: 20,
                          height: 20,
                        }}
                        title={"我已閱讀並同意English4Tw的隱私政策"}
                      />
                    </View>
                    <View style={{flexGrow: 1}}/>
                  </>
                )}
              </View>
              <Button
                  title={step === 1 ? "下一步" : "完成"}
                  onPress={
                    step === 1
                      ? onCreateAccountNext
                      : () => {
                          navigation.navigate("LoginPage");
                        }
                  }
                  customStyle={styles.button}
                  type="1"
              />
              
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
    backgroundColor: Colors.page_modal_background,
  },
  sheet: {
    height: DEVICE_HEIGHT,
    justifyContent: "flex-end",
    position: "absolute",
    top: DEVICE_HEIGHT,
    left: 0,
    right: 0,
  },
  popup: {
    height: DEVICE_HEIGHT,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: Spacing.space_l,
    paddingVertical: Spacing.space_l,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray_4,
  },
  actionsheet: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputSection: {
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginTop: 6,
    marginBottom: 20,
  },
  button: {
    width: DEVICE_WIDTH - 40,
    height: 50,
    borderRadius: 25,
  }
});

export default CreateAccountPage;
