import { createStore, applyMiddleware } from "redux";
import projectState from "../reducers/projectReducer";
import thunk from "redux-thunk";

export default () => {
  return createStore(projectState, applyMiddleware(thunk));
};
