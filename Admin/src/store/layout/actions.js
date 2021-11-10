import {
  SET_SIDEBAR
} from "./actionTypes";

export const setSidebar = show => ({
  type: SET_SIDEBAR,
  payload: { show }
});
