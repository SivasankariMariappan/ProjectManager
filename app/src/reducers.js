import { ProjectReducer } from "./reducers/projectReducer";
import { combineReducers } from "redux";

export default allReducers =>
  combineReducers({
    projectUser: ProjectReducer
  });
