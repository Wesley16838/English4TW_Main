import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from "react-native";
import { Colors, Spacing } from "styles";
import IInputbox from "types/components/inputbox";
const InputBox: React.FC<IInputbox> = ({
  OnChangeText,
  customStyle,
  placeHolder,
  placeHolderTextColor,
  value,
  title,
  key,
  isDisabled
}) => {
  return (
    <View style={{ flexDirection: "column" }}>
      {title && <Text>{title}</Text>}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View>
          <TextInput
            key={key}
            multiline={false}
            numberOfLines={1}
            style={[styles.inputBox, customStyle]}
            placeholder={placeHolder}
            onChangeText={(str) => {
              if(OnChangeText) OnChangeText(str);
            }}
            underlineColorAndroid="transparent"
            placeholderTextColor={placeHolderTextColor}
            value={value}
            autoCapitalize="none"
            returnKeyType="next"
            editable={!isDisabled}
            selectTextOnFocus={!isDisabled}
            // onSubmitEditing={Keyboard.dismiss}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
const styles = StyleSheet.create({
  inputBox: {
    textAlignVertical: "center",
    borderRadius: 20,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: Spacing.space_m,
    backgroundColor: Colors.white,
  },
});
export default InputBox;
