import { createStore, applyMiddleware } from "redux";
import allReducers from "../reducers";
import thunk from "redux-thunk";

export default () => {
  return createStore(allReducers, applyMiddleware(thunk));
};
