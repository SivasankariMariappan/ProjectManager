import { actionTypes } from "../actions/action-types";

const projectObj = {
  projectId: "",
  projectName: "",
  startDate: null,
  endDate: null,
  priority: 0,
  userId: "",
  manager: "",
};
const projectReducerDefaultState = {
  ...projectObj,
    projectList: [],
};

export const projectReducer = (
  state = projectReducerDefaultState,
  action = {}
) => {
  switch (action.type) {
    case actionTypes.project.onProjectChange:
      return {
        ...state,
        ...action.data,
      };
    case actionTypes.project.loadProjectList:
      return {
        ...state,
          ...action.data,
      };
    case actionTypes.project.addProject:
      const newProject = action.data;
      let projectList = [...state.projectList];
      projectList.push(newProject);
      return {
        ...state,
        ...projectObj,
          projectList
      };
    case actionTypes.project.onProjectEditClick:
      const {projectId, projectName, startDate, endDate, priority, userId, manager} = action.data;
      return {
        ...state,
        projectId,
        projectName,
        startDate,
        endDate,
        priority,
        userId,
        manager
      };
    case actionTypes.project.editProject:
      const updatedProject = action.data;
      const projectListForEdit = [...state.projectList];
      let index = projectListForEdit.findIndex(
        project => project.projectId === updatedProject.projectId
      );
      if (index > -1) projectListForEdit[index] = updatedProject;
      return {
        ...state,
        ...projectObj,
        projectList: projectListForEdit,
      };
    case actionTypes.project.removeProject:
      const projectListForRemove = state.projectList.filter(
        project => project.projectId !== action.data
      );
      return {
        ...state,
          ...projectObj,
          projectList: projectListForRemove,
      };
    case actionTypes.project.resetProject:
      return {
        ...state,
        ...projectObj,
      };
    default:
      return state;
  }
};
