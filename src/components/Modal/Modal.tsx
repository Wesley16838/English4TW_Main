import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Images from "assets/images";
import { BlurView } from "expo-blur";
import { Colors, Typography } from "styles";
import IModal from "types/components/modal";
import { shallowEqual, useSelector } from "react-redux";

const Modal: React.FC<IModal> = ({
  title,
  subtitle,
  customStyle,
  onCancel,
  onConfirm,
  content,
  confirmString,
  children,
  defaultValue
}) => {
  // const {speed, level, play_paragraph, sort}: any = useSelector(
  //   (state: any) => state.setting,
  //   shallowEqual
  // );
  // let val:any = {
  //   "播放段落": play_paragraph,
  //   "播放速度": speed,
  //   "字彙難度": level,
  //   "排序": sort
  // }

  const [selected, setSelected] = React.useState((content && defaultValue) || "");
  const onCheck = (option: string) => {
    setSelected(option);
  };
  const renderOption = () => {
    return (
      Array.isArray(content) &&
      content.map((option, index) => {
        return (
          <TouchableOpacity
            onPress={() => onCheck(option)}
            style={styles.listItem}
            key={index}
          >
            <Text>{option}</Text>
            {selected === option && (
              <Image source={Images.icons.check_icon} style={styles.checked} />
            )}
          </TouchableOpacity>
        );
      })
    );
  };
  const handleOnCancel = () => {
    if (onCancel) onCancel();
  };
  const handleOnConfirm = () => {
    if (onConfirm) onConfirm(selected);
  };
  return (
    <BlurView
      tint="dark"
      intensity={100}
      style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}
    >
      <View style={styles.modalContainer}>
        <Text
          style={styles.modalTitle}
        >
          {title}
        </Text>
        { subtitle && <Text style={styles.modalContent}>{subtitle}</Text> }
        { children ? <View>{children}</View> : <View>{renderOption()}</View> }
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => handleOnCancel()}
            style={styles.button}
          >
            <Text style={Typography.base_primary}>取消</Text>
          </TouchableOpacity>
          <View style={{
             borderLeftWidth: 0.5,
             borderLeftColor: Colors.modal_line,
          }}/>
          <TouchableOpacity
            onPress={() => handleOnConfirm()}
            style={styles.button}
          >
            <Text style={Typography.base_primary}>
              {confirmString ? confirmString : "完成"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
};
const styles = StyleSheet.create({
  modalWrapper: {
    width: "100%",
    height: "100%",
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 20,
  },
  modalContainer: {
    width: 270,
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingTop: 19,
    borderRadius: 14,
  },
  checked: {
    width: 14,
    height: 14,
    resizeMode: "contain",
  },
  nonBlurredContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    textAlign: "center",
    marginBottom: 20,
    marginHorizontal: 20,
    color: Colors.secondary,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
    marginHorizontal: 20,
    ...Typography.base_bold_secondary
  },
  button: {
    width: 135,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
  },
  buttonWrapper: {
    width: "100%", 
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: Colors.modal_line,
  },
  listItem: {
    width: 270,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 17,
    paddingHorizontal: 16,
  },
});
export default Modal;
