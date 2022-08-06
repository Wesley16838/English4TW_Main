import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  Platform,
} from "react-native";
import { Colors, Spacing } from "styles";

export type Props = {
  OnClick?: any;
  customStyle: any;
  source?: any;
  placeHolder: string;
  placeHolderTextColor: string;
  limit: number;
  button?: string;
  buttonStyle?: any;
  OnChangeText?: (str: string) => void;
  value: string;
  isDisabled?: boolean;
};
const TextArea: React.FC<Props> = ({
  OnChangeText,
  OnClick,
  customStyle,
  placeHolder,
  placeHolderTextColor,
  limit,
  value,
  isDisabled,
  button,
  buttonStyle
}) => {
  const [textNumber, setTextNumber] = React.useState(0);

  const handleOnSubmit = () => {
    if(OnClick) OnClick()
  };
  const heightTop = customStyle.height - 46;
  return (
    <View style={[styles.textAreaSection, customStyle]}>
      <TextInput
        // returnKeyType="done"
        blurOnSubmit={true}
        multiline={true}
        textAlignVertical="top"
        numberOfLines={5}
        style={{
          height: heightTop,
          width: "100%",
          paddingTop: 10,
          paddingHorizontal: 15,
        }}
        placeholder={placeHolder}
        onChangeText={(str) => {
          if (str.length > limit) return false;
          setTextNumber(str.length)
          if(OnChangeText) OnChangeText(str)
        }}
        returnKeyType='none'
        onSubmitEditing={() => handleOnSubmit()}
        underlineColorAndroid="transparent"
        placeholderTextColor={placeHolderTextColor}
        keyboardType="default"
        value={value}
        autoCorrect={false}
        editable={!isDisabled}
        selectTextOnFocus={!isDisabled}
      />
      <View style={styles.textAreaBottom}>
        <Text style={styles.textAreaText}>
          {textNumber}/{limit}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  textAreaSection: {
    height: 150,
    flexDirection: "column",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  input: {
    width: "100%",
    paddingTop: Spacing.space_xs,
    paddingHorizontal: Spacing.space_s,
  },
  textAreaBottom: {
    width: "100%",
    height: 46,
    paddingHorizontal: Spacing.space_s,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopColor: Colors.textarea_line,
    borderTopWidth: 1,
  },
  textAreaBottomImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  textAreaText: {
    marginTop: 2,
    color: Colors.gray_3,
  },
});
export default TextArea;
