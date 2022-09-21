import { useQuery } from "react-query";
import authDeviceStorage from "./authDeviceStorage";
import api from "./api";
import deviceStorage from "./deviceStorage";

// { word: "test1", detail: "A test1", speech: "v. 動詞", subtitle: "可數與不可數 --" }
export const fetchSavedWords = async () => {
  try {
    const res = [];
    const promises: any[] = [];
    const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
    const token = userInfo && JSON.parse(userInfo).token;
    const result = await api.get("api/getUserWords", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (result.data.message === "Unauthorized") throw new Error("Unauthorized");
    return result.data.data.words;
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
  }
};

export const getSavedWords = (
  keys: any[],
  onSuccess: (data: any) => void,
  onError: (data: any) => void,
  parameters?: any
) => {
  return useQuery("saved_words", fetchSavedWords, {
    onSuccess,
    onError,
    refetchOnMount: parameters?.refetchOnMount || false,
    refetchOnWindowFocus: parameters?.refetchOnWindowFocus || false,
  });
};

export const fetchUserWords = async () => {
  try {
    const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
    const token = userInfo && JSON.parse(userInfo).token;

    if (!token) throw new Error("Unauthorized");
    const result = await api.get("api/loginFetch", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (result.data.message === "Unauthorized") throw new Error("Unauthorized");
    const userWord = result.data.data.today_words.map((word: string[]) => {
      return word.map((str: string) => {
        return result.data.data.today_defs[str];
      });
    });

    return userWord;
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
  }
};

export const getUserWords = (
  keys: any[],
  onSuccess: (data: any) => void,
  onError: (data: any) => void,
  parameters?: any
) => {
  return useQuery(["user_words", ...keys], fetchUserWords, {
    onSuccess,
    onError,
    refetchOnMount: parameters?.refetchOnMount || false,
    refetchOnWindowFocus: parameters?.refetchOnWindowFocus || false,
    enabled: parameters?.enable || true
  });
};

export const getWords = (
  word: string,
  onSuccess?: (data: any) => void,
  onError?: (data: any) => void,
  parameters?: any
) => {
  return useQuery(
    word,
    async () => {
      const wordInfo = await deviceStorage.getItem(word);
      const halfDayExpire = 1000 * 60 * 60 * 12;
      if (
        wordInfo === null ||
        (wordInfo.word !== null && Date.now() - wordInfo.date > halfDayExpire)
      ) {
        const userInfo = await authDeviceStorage.getItem("JWT_TOKEN");
        const token = userInfo && JSON.parse(userInfo).token;
        const res = await api.get(`api/word3?word=${word}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data.data;
      } else {
        return wordInfo.word;
      }
    },
    {
      onSuccess,
      onError,
      refetchOnMount: parameters?.refetchOnMount || false,
      refetchOnWindowFocus: parameters?.refetchOnWindowFocus || false,
    }
  );
};
