import * as SecureStore from "expo-secure-store";

const authDeviceStorage = {
  async saveItem(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      if (e instanceof Error) {
        console.log("Add authDeviceStorage Error: " + e.message);
      }
    }
  },
  async deleteItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      if (e instanceof Error) {
        console.log("Remove authDeviceStorage Error: " + e.message);
      }
    }
  },
  async getItem(key: string) {
    try {
      const res = await SecureStore.getItemAsync(key);
      return res;
    } catch (e) {
      if (e instanceof Error) {
        console.log("Get authDeviceStorage Error: " + e.message);
      }
    }
  },
};

export default authDeviceStorage;
