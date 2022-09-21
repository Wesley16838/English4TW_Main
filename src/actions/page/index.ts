import * as actionTypes from "actions/actionTypes";

export const setNextPage = (data: any) => ({
    type: actionTypes.SET_NEXT_PAGE,
    page: data.page,
    parameter: data.parameter,
});

export const resetNextPage = () => ({
    type: actionTypes.RESET_NEXT_PAGE,
});