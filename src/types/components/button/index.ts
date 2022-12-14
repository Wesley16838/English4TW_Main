import { ImageSourcePropType } from "react-native";

export default interface IButton {
  onPress: () => void;
  type: string;
  title?: string;
  buttonStyle?: any;
  image?: ImageSourcePropType;
  imageSize?: {
    width: number;
    height?: number;
    marginRight?: number;
  };
  fontStyle?: object;
  isDisabled?: boolean;
  accessText?: string;
}
