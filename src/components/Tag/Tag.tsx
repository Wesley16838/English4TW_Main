import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { Colors } from "styles";
import ITag from "types/components/tag";
/*
[Tag] is touchable component
disable means tag isn't clickable. Ex:筆記內容頁
*/
const Tag: React.FC<ITag> = ({
  title,
  onPress,
  onLongPress,
  onPressOut,
  onPressIn,
  customStyle,
  disable,
  isChoosed,
}) => {
  const [status, setStatus] = React.useState({
    hover: false,
    // press: isChoosed || false,
  });

  return (
    <Pressable
      accessible={true}
      accessibilityLabel={title}
      accessibilityHint={title}
      onPressIn={() => {
        if (!disable) setStatus({ ...status, hover: true });
        if (!disable && onPressIn) onPressIn();
      }}
      onPressOut={() => {
        if (!disable && onPressOut) onPressOut();
      }}
      onLongPress={() => {
        if (!disable && onLongPress) {
          setStatus({ ...status, hover: false });
          onLongPress();
        }
      }}
      onPress={() => {
        if (!disable) setStatus({ ...status, hover: false });
        if (!disable && onPress) onPress();
      }}
      delayLongPress={750}
    >
      <View
        style={[
          styles.tag,
          customStyle,
          status.hover
            ? styles.isHover
            : isChoosed
            ? styles.isPress
            : styles.isDefault,
        ]}
      >
        <Text
          style={[
            status.hover
              ? styles.whiteText
              : isChoosed
              ? styles.whiteText
              : styles.isDefaultText,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 15,
  },
  isPress: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 20,
  },
  isHover: {
    backgroundColor: Colors.button_primary_press,
    borderColor: Colors.button_primary_press,
    borderWidth: 1,
    borderRadius: 20,
  },
  isDefault: {
    backgroundColor: Colors.white,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 20,
  },
  isDefaultText: {
    color: Colors.secondary,
  },
  whiteText: {
    color: Colors.white,
  },
});
export default Tag;
// react memo
