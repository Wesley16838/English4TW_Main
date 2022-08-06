import * as actionTypes from "actions/actionTypes";

const initialState: any = {
  speed: '中',
  level: '初級',
  play_paragraph: '一次播放',
  sort: 'A - Z'
};

const setting = (state: any = initialState, action: any): any => {
  switch (action.type) {
    case actionTypes.SET_SETTING:
      return {
        ...state,
        ...action.payload,
      };
  }
  return state;
};

export default setting;
