import * as actionTypes from "actions/actionTypes";

export const setSetting = (data: any) => ({
    type: actionTypes.SET_SETTING,
    payload: data,
});