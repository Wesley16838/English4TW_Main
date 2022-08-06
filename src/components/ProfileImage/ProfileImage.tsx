import React from "react";
import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Text,
} from "react-native";
export type Props = {
  name: any;
  customStyle: any;
};
const ProfileImage: React.FC<Props> = ({
  name,
  customStyle,
}) => {

  return (
    <Image
      style={[
        customStyle,
        styles.profileimage,
        // { resizeMode: Platform.OS === "ios" ? "contain" : "cover" },
      ]}
      source={typeof name === 'string' ? { uri: name } : name}
    />
  );
};
const styles = StyleSheet.create({
  profileimage: {
    borderWidth: 2,
    borderColor: "#CCCCCC",
    resizeMode: 'cover'
  },
});
export default ProfileImage;
