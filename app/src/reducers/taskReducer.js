import { actionTypes } from "../actions/action-types";

const taskObj = {
  taskId: "",
  taskName: "",
  projectId: "",
  projectName: "",
  startDate: null,
  endDate: null,
  priority: 0,
  userId: "",
  userName: "",
  parentTaskId: "",
  parentTaskName: "",
  parentTask: "",
  parentTaskList: [],
  status: null
};
const taskReducerDefaultState = {
  ...taskObj,
  taskList: []
};

export const taskReducer = (state = taskReducerDefaultState, action = {}) => {
  switch (action.type) {
    case actionTypes.task.onTaskChange:
      return {
        ...state,
        ...action.data
      };
    case actionTypes.task.loadTaskList:
      return {
        ...state,
        ...action.data
      };
    case actionTypes.task.loadParentTaskList:
      return {
        ...state,
        ...action.data
      };
    case actionTypes.task.addTask:
      return {
        ...state,
        ...taskObj
      };
    case actionTypes.task.onTaskEditClick:
      const {
        taskId,
        taskName,
        projectId,
        projectName,
        parentTask,
        parentTaskId,
        parentTaskName,
        startDate,
        endDate,
        priority,
        userId,
        userName,
        status
      } = action.data;
      return {
        ...state,
        taskId,
        taskName,
        projectId,
        projectName,
        parentTask,
        parentTaskId,
        parentTaskName,
        startDate,
        endDate,
        priority,
        userId,
        userName,
        status
      };
    case actionTypes.task.editTask:
      const updatedTask = action.data;
      const taskListForEdit = [...state.taskList];
      let index = taskListForEdit.findIndex(
        task => task.taskId === updatedTask.taskId
      );
      if (index > -1) taskListForEdit[index] = updatedTask;
      return {
        ...state,
        ...taskObj,
        taskList: [...taskListForEdit]
      };
    case actionTypes.task.removeTask:
      const taskListForRemove = state.taskList.filter(
        task => task.taskId !== action.data
      );
      return {
        ...state,
        ...taskObj,
        taskList: taskListForRemove
      };
    case actionTypes.task.resetTask:
      return {
        ...state,
        ...taskObj
      };
    default:
      return state;
  }
};
