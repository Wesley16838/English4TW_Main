import React from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  View,
  Button as ExpoButton,
  Pressable
} from "react-native";
import { Colors } from "styles";
import IButton from "types/components/button";

export const getButtonStyle = (type: string, status: any, isDisabled: boolean) => {
  switch (type) {
    case "1":
      if (isDisabled) {
        return {
          backgroundColor: Colors.button_primary_disable,
          borderColor: Colors.button_primary_disable,
        };
      } else if(status.hover) {
        return {
          backgroundColor: Colors.button_primary_press,
          borderColor: Colors.button_primary_press,
        };
      } else {
        return {
          backgroundColor: Colors.primary,
          borderColor: Colors.primary,
        };
      }
    case "2":
      if (isDisabled) {
        return {
          backgroundColor: Colors.button_secondary_disable,
          borderColor: Colors.button_secondary_disable,
        };
      } else if(status.hover) {
        return {
          backgroundColor: Colors.button_secondary_press,
          borderColor: Colors.button_secondary_press,
        };
      } else {
        return {
          backgroundColor: Colors.secondary,
          borderColor: Colors.secondary,
        };
      }
    case "facebook":
      if (status.hover) {
        return {
          backgroundColor: Colors.facebook_color_press,
          borderColor: Colors.facebook_color_press,
        };
      } else {
        return {
          backgroundColor: Colors.facebook_color,
          borderColor: Colors.facebook_color,
        };
      }
    case "text":
      return null
    default:
      return {
        backgroundColor: Colors.transparent,
      };
  }
};
const Button: React.FC<IButton> = ({
  title,
  onPress,
  customStyle,
  type,
  image,
  imageSize,
  fontStyle,
  isDisabled = false,
  accessText = "button",
}) => {
  const [status, setStatus] = React.useState({
    hover: false,
  });
  return (
    <Pressable
      accessible={true}
      accessibilityLabel={accessText}
      accessibilityHint={accessText}
      onPress={onPress}
      onPressIn={() => setStatus({...status, hover: true })}
      onPressOut={() => setStatus({...status, hover: false })}
      disabled={isDisabled}
      hitSlop={10}
      style={[getButtonStyle(type, status, isDisabled),customStyle]}
    >
      <View
        style={styles.button}
      >
        {(image && imageSize) && <Image
            style={{
              width: imageSize.width,
              height: imageSize.height,
              marginRight: imageSize.marginRight || 0,
              resizeMode: "contain",
            }}
            source={image}
          />}
        { !!title && <Text style={[styles.buttonText, fontStyle]} accessibilityLabel={title}>{title}</Text> }
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  button: {
    flex:1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.white,
  },
  isDisable: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  isHover: {
    backgroundColor: Colors.button_secondary_press,
    borderColor: Colors.button_secondary_press,
  },
  isDefault: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
});
export default Button;
