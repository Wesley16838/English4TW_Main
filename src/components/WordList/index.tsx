import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  StyleSheet,
  FlatList,
  TouchableHighlight,
  View,
  Text,
} from "react-native";
import Toast from "react-native-root-toast";
import { shallowEqual, useSelector } from "react-redux";
import { Colors, Spacing, Typography } from "styles";
import IWordList from "types/components/wordlist";

const renderWordItem = (item: string, onClick: () => void, number: number) => {
  return (
    <TouchableHighlight
      onPress={() => onClick()}
      activeOpacity={0.6}
      underlayColor={Colors.gray_3}
    >
      <View
        style={[
          styles.item,
          {
            borderTopWidth: number === 0 ? 1 : 0,
            borderTopColor: Colors.primary,
          },
        ]}
      >
        <Text style={styles.word}>{item}</Text>
      </View>
    </TouchableHighlight>
  );
};

const WordList: React.FC<IWordList> = ({ data }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isLoggedIn }: any = useSelector(
    (state: any) => state.user,
    shallowEqual
  );
  const onItemPress = async (word: string) => {
    if (isLoggedIn) {
      const result = await AsyncStorage.getItem("@word_history");
      navigation.push("WordDetailPage", {
        word,
        history: result ? result : "[]",
      });
    } else {
      Toast.show("請先登入", {
        duration: Toast.durations.SHORT,
        shadow: false,
      });
    }
  };

  return (
    <FlatList
      contentContainerStyle={{
        flexGrow: 1,
        marginTop: 30,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      data={data.splice(0, 30)}
      renderItem={({ item, index }) =>
        renderWordItem(item, () => onItemPress(item), index)
      }
      keyExtractor={(item) => item}
    />
  );
};
const styles = StyleSheet.create({
  word: {
    ...Typography.base,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: Spacing.space_l,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    backgroundColor: Colors.white,
  },
});
export default WordList;
