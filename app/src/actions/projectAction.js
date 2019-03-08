import axios from "../axios/axios";
import { actionTypes } from "./action-types";

/*export const onUserChange = userObj => dispatch => {
  dispatch({
    type: actionTypes.user.onUserChange,
    data: userObj
  });
};*/
const _addProject = addedProject => ({
  type: actionTypes.project.addProject,
  data: addedProject
});

export const addProject = () => {
  return (dispatch, getState) => {
    const {
      projectName,
      startDate,
      endDate,
      priority,
      userId
    } = getState().project;
    const payload = {
      projectName,
      startDate,
      endDate,
      priority,
      userId
    };

    return axios.post("project", payload).then(result => {
      dispatch(_addProject(result.data));
    });
  };
};

const _removeProject = (projectId = {}) => ({
  type: actionTypes.project.removeProject,
  data: projectId
});

export const removeProject = ({ projectId } = {}) => {
  return dispatch => {
    return axios.delete(`project/${projectId}`).then(() => {
      dispatch(_removeProject(projectId));
    });
  };
};

const _editProject = updatedProjectObj => ({
  type: actionTypes.project.editProject,
  data: updatedProjectObj
});

export const editProject = () => {
  return (dispatch, getState) => {
    const {
      projectId,
      projectName,
      startDate,
      endDate,
      priority
    } = getState().project;
    const payload = {
      projectId,
      projectName,
      startDate,
      endDate,
      priority
    };
    return axios.put("project", payload).then(result => {
      dispatch(_editProject(result.data));
    });
  };
};

export const _getProjects = projects => ({
  type: actionTypes.project.loadProjectList,
  data: { projectList: projects }
});

export const getProjects = () => {
  return dispatch => {
    return axios.get("project/all").then(result => {
      const projects = [];

      result.data.forEach(project => {
        projects.push(project);
      });

      dispatch(_getProjects(projects));
    });
  };
};

export const resetProject = () => ({
  type: actionTypes.project.resetProject
});

export const onEditClick = project => ({
  type: actionTypes.project.onProjectEditClick,
  data: project
});

export const onDeleteClick = projectId => ({
  type: actionTypes.project.onProjectDeleteClick,
  data: projectId
});
