import { useMutation, useQuery } from "react-query";
import authDeviceStorage from "./authDeviceStorage";
import api from "./api";
import { getToken } from "utils/helper";
export const fetchAllNotes = async () => {
  try {
    const token = await getToken();
    const result = await api.get("api/getUserAllNotes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (result.data.message === "Unauthorized") throw new Error("Unauthorized");
    return result.data.data.notes;
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
  }
};

export const fetchNoteById = async (id: string) => {
  try {
    const token = await getToken();
    const res = await api.post(
      "api/getUserNote",
      { note_id: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.message === "Unauthorized") throw new Error("Unauthorized");
    return res.data.data.note;
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    }
  }
};

export const getAllNotes = (
  keys: any[],
  onSuccess: (data: any) => void,
  onError: (data: any) => void,
  parameters: any
) => {
  return useQuery("notes", fetchAllNotes, {
    onSuccess,
    onError,
    refetchOnMount: parameters?.refetchOnMount || false,
    refetchOnWindowFocus: parameters?.refetchOnWindowFocus || false,
  });
};

export const getNoteById = (
  onSuccess: (data: any) => void,
  onError: (data: any) => void
) => {
  return useMutation(async (id: string) => await fetchNoteById(id), {
    onSuccess,
    onError,
  });
};
