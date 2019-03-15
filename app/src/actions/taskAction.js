import axios from "../axios/axios";
import { actionTypes } from "./action-types";
import moment from "moment";

export const onTaskFieldChange = taskObj => dispatch => {
  dispatch({
    type: actionTypes.task.onTaskChange,
    data: taskObj
  });
};

export const onTabChange = tabValue => dispatch => {
  dispatch({
    type: actionTypes.task.onTabChange,
    data: tabValue
  });
};

export const _addTask = addedTask => ({
  type: actionTypes.task.addTask,
  data: addedTask
});

export const addTask = () => {
  return (dispatch, getState) => {
    let task = getState().task;
    const {
      projectId,
      taskName,
      parentTask,
      startDate,
      endDate,
      priority,
      userId,
      parentTaskId
    } = task;
    const payload = {
      projectId,
      taskName,
      parentTask,
      startDate,
      endDate,
      priority,
      userId,
      parentTaskId
    };

    return axios.post("task/add", payload).then(result => {
      dispatch(_addTask());
      if (parentTask) {
        dispatch(getParentTasks());
      } else {
        dispatch(getTasks());
      }
    });
  };
};

export const _removeTask = (taskId = {}) => ({
  type: actionTypes.task.removeTask,
  data: taskId
});

export const removeTask = ({ taskId } = {}) => {
  return dispatch => {
    return axios.delete(`task/${taskId}`).then(() => {
      dispatch(_removeTask(taskId));
    });
  };
};

export const _editTask = updatedTaskObj => ({
  type: actionTypes.task.editTask,
  data: updatedTaskObj
});

export const editTask = () => {
  return (dispatch, getState) => {
    const task = getState().task;
    const {
      taskId,
      projectId,
      taskName,
      parentTask,
      startDate,
      endDate,
      priority,
      userId,
      parentTaskId,
      status
    } = task;
    const payload = {
      taskId,
      projectId,
      taskName,
      parentTask,
      startDate,
      endDate,
      priority,
      userId,
      parentTaskId,
      status
    };
    return axios.put("task/update", payload).then(result => {
      dispatch(_editTask(task));
    });
  };
};

export const _getTasks = tasks => ({
  type: actionTypes.task.loadTaskList,
  data: { taskList: tasks }
});

export const getTasks = () => {
  return dispatch => {
    return axios.get("task/all").then(result => {
      const tasks = [];

      result.data.forEach(task => {
        tasks.push(task);
      });

      dispatch(_getTasks(tasks));
    });
  };
};

export const _getParentTasks = tasks => ({
  type: actionTypes.task.loadParentTaskList,
  data: { parentTaskList: tasks }
});

export const getParentTasks = () => {
  return dispatch => {
    return axios.get("parenttask/all").then(result => {
      const parentTasks = [];

      result.data.forEach(task => {
        parentTasks.push(task);
      });

      dispatch(_getParentTasks(parentTasks));
    });
  };
};

export const resetTask = () => ({
  type: actionTypes.task.resetTask
});

export const onEditClick = task => ({
  type: actionTypes.task.onTaskEditClick,
  data: {
    ...task,
    startDate: task.startDate ? moment(task.startDate) : null,
    endDate: task.endDate ? moment(task.endDate) : null
  }
});

export const onEndTaskClick = task => {
  return (dispatch, getState) => {
    const {
      taskId,
      projectId,
      taskName,
      parentTask,
      startDate,
      endDate,
      priority,
      userId,
      parentTaskId
    } = task;
    const payload = {
      taskId,
      projectId,
      taskName,
      parentTask,
      startDate,
      endDate,
      priority,
      userId,
      parentTaskId,
      status: "COMPLETED"
    };
    return axios.put("task/update", payload).then(result => {
      task.status = "COMPLETED";
      dispatch(_editTask(task));
    });
  };
};

export const searchTasksByProject = projectId => {
  return (dispatch, getState) => {
    return axios.get(`task/project/${projectId}`).then(result => {
      const tasks = [];

      result.data.forEach(task => {
        tasks.push(task);
      });

      dispatch(_getTasks(tasks));
    });
  };
};
