import React, { forwardRef, useRef } from "react";
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
const InputBox = forwardRef<TextInput, IInputbox>(
  (
    {
      OnChangeText,
      customStyle,
      placeHolder,
      placeHolderTextColor,
      value,
      title,
      key,
      isDisabled,
      onClick,
      returnKeyType,
      setFocused,
    },
    ref
  ) => {
    const localRef = useRef(null);
    const inputRef = ref || localRef;
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
                if (OnChangeText) OnChangeText(str);
              }}
              underlineColorAndroid="transparent"
              placeholderTextColor={placeHolderTextColor}
              value={value}
              autoCapitalize="none"
              returnKeyType={returnKeyType || "next"}
              editable={!isDisabled}
              selectTextOnFocus={!isDisabled}
              onSubmitEditing={() => {
                if (onClick) onClick();
              }}
              ref={inputRef}
              secureTextEntry={title === "密碼"}
              onFocus={setFocused && setFocused(true)}
              onBlur={setFocused && setFocused(false)}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
);
const styles = StyleSheet.create({
  container: {},
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
