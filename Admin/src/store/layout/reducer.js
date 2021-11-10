import {
  SET_SIDEBAR
} from "./actionTypes";

const INIT_STATE = {
  sidebarShow: true
};

const Layout = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_SIDEBAR:
      return {
        ...state,
        sidebarShow: action.payload.show
      };
    default:
      return state;
  }
};

export default Layout;
