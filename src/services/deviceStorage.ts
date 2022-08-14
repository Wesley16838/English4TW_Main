import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceStorage = {
  async setItem(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      if (e instanceof Error) {
        console.log("Set deviceStorage Error: " + e.message);
      }
    }
  },
  async getItem(key: string) {
    try {
      const res = await AsyncStorage.getItem(key);
      return res !== null ? JSON.parse(res) : null;
    } catch (e) {
      if (e instanceof Error) {
        console.log("Get deviceStorage Error: " + e.message);
      }
    }
  },
};

export default deviceStorage;
