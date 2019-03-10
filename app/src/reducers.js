import { userReducer } from "./reducers/userReducer";
import { projectReducer } from "./reducers/projectReducer";
import { taskReducer } from "./reducers/taskReducer";
import { dashboardReducer } from "./reducers/dashboardReducer";
import { combineReducers } from "redux";

const allReducers = combineReducers({
    projectUser: userReducer,
    project: projectReducer,
    task: taskReducer,
    dashboard: dashboardReducer,
  });

export default allReducers;
