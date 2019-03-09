import { userReducer } from "./reducers/userReducer";
import { projectReducer } from "./reducers/projectReducer";
import { combineReducers } from "redux";

const allReducers = combineReducers({
    projectUser: userReducer,
    project: projectReducer
  });

console.log('allReducers', allReducers)
export default allReducers;
