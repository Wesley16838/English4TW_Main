import * as actionTypes from "actions/actionTypes";

export const setDailyWord = (word: string) => ({
  type: actionTypes.SET_DAILY_WORD,
  word,
});
