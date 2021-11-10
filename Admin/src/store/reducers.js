import { combineReducers } from "redux";

import App from "./app/reducer";
// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";

const rootReducer = combineReducers({
  // public
  App,
  Layout,
  Login
});

export default rootReducer;
