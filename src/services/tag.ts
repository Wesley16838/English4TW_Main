import { useQuery } from "react-query";
import authDeviceStorage from "./authDeviceStorage";
import api from "./api";

export const fetchTags = async () => {
  try {
    const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
    const token = userInfo && JSON.parse(userInfo).token;
    const result = await api.get("api/getUserTags", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (result.data.message === "Unauthorized") throw new Error("Unauthorized");
    return result.data.data.tags;
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
  }
};

export const getTag = (
  keys: any[],
  onSuccess: (data: any) => void,
  onError: (data: any) => void,
  parameters?: any
) => {
  return useQuery("tags", fetchTags, {
    onSuccess,
    onError,
    refetchOnMount: parameters?.refetchOnMount || false,
    refetchOnWindowFocus: parameters?.refetchOnWindowFocus || false,
  });
};
