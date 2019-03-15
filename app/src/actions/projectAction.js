import axios from "../axios/axios";
import { actionTypes } from "./action-types";
import moment from "moment";

export const onProjectFieldChange = projectObj => dispatch => {
  dispatch({
    type: actionTypes.project.onProjectChange,
    data: projectObj
  });
};

export const _addProject = addedProject => ({
  type: actionTypes.project.addProject,
  data: addedProject
});

export const addProject = () => {
  return (dispatch, getState) => {
    let project = getState().project;
    const { projectName, startDate, endDate, priority, userId } = project;
    const payload = {
      projectName,
      startDate,
      endDate,
      priority,
      userId
    };

    return axios.post("project", payload).then(result => {
      project.projectId = result.data.projectId;
      project.taskNumber = result.data.taskNumber;
      project.completedTaskNumber = result.data.completedTaskNumber;

      dispatch(_addProject(project));
    });
  };
};

export const _removeProject = (projectId = {}) => ({
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

export const _editProject = updatedProjectObj => ({
  type: actionTypes.project.editProject,
  data: updatedProjectObj
});

export const editProject = () => {
  return (dispatch, getState) => {
    const project = getState().project;
    const {
      projectId,
      projectName,
      startDate,
      endDate,
      priority,
      userId
    } = project;
    const payload = {
      projectId,
      projectName,
      startDate,
      endDate,
      priority,
      userId
    };
    return axios.put("project", payload).then(result => {
      dispatch(_editProject(project));
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
  data: {
    ...project,
    startDate: project.startDate ? moment(project.startDate) : null,
    endDate: project.endDate ? moment(project.endDate) : null
  }
});

export const onDeleteClick = projectId => ({
  type: actionTypes.project.onProjectDeleteClick,
  data: projectId
});
