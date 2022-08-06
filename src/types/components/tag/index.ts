export default interface ITag {
    title: string;
    customStyle: object;
    disable?: boolean;
    onPressIn?: ()=> void;
    onLongPress?: ()=> void;
    onPress?: ()=> void;
    onPressOut?: ()=> void;
    isChoosed?: boolean;
  };