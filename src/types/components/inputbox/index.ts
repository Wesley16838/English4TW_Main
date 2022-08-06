import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

export default interface IInputbox {
    OnChangeText?: (str: string)=> void;
    customStyle: object;
    placeHolder: string;
    placeHolderTextColor: string;
    value: string;
    title?: string;
    key?: string;
    isDisabled?:boolean;
  };