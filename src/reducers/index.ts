import { combineReducers } from "redux";
import user from "./user";
import word from "./word";
import page from "./page";
import setting from "./setting";
export default combineReducers({
  user,
  word,
  page,
  setting,
});
