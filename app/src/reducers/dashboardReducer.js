import { actionTypes } from "../actions/action-types";

const dashboardReducerDefaultState = {
  activeTab: 0,
};

export const dashboardReducer = (
  state = dashboardReducerDefaultState,
  action = {}
) => {
  switch (action.type) {
    case actionTypes.task.onTabChange:
      return {
        activeTab: action.data,
      };

    default:
    	return state;  
   } 	
}
