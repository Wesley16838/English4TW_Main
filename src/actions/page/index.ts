import * as actionTypes from "actions/actionTypes";

export const setNextPage = (page: string, parameter?: object) => ({
    type: actionTypes.SET_NEXT_PAGE,
    page,
    parameter,
});

export const resetNextPage = (page: string, parameter: object) => ({
    type: actionTypes.RESET_NEXT_PAGE,
});