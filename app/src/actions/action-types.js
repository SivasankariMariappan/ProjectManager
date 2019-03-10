export const actionTypes = {
  user: {
    onUserChange: "ON_USER_CHANGE",
    addUser: "ADD_USER",
    removeUser: "REMOVE_USER",
    editUser: "EDIT_USER",
    loadUserList: "LOAD_USER_LIST",
    resetUser: "RESET_USER",
    onEditClick: "ON_EDIT_CLICK",
    onDeleteClick: "ON_DELETE_CLICK"
  },
  project: {
    onProjectChange: "ON_PROJECT_CHANGE",
    addProject: "ADD_PROJECT",
    removeProject: "REMOVE_PROJECT",
    editProject: "EDIT_PROJECT",
    loadProjectList: "LOAD_PROJECT_LIST",
    resetProject: "RESET_PROJECT",
    onProjectEditClick: "ON_EDIT_CLICK_PROJECT",
    onProjectDeleteClick: "ON_DELETE_CLICK_PROJECT"
  },
  task: {
    onTaskChange: "ON_TASK_CHANGE",
    addTask: "ADD_TASK",
    removeTask: "REMOVE_TASK",
    editTask: "EDIT_TASK",
    loadTaskList: "LOAD_TASK_LIST",
        loadParentTaskList: "LOAD_PARENT_TASK_LIST",
    resetTask: "RESET_TASK",
    onTaskEditClick: "ON_EDIT_CLICK_TASK",
    onTaskDeleteClick: "ON_DELETE_CLICK_TASK",
    onSetParentTask: "ON_SET_PARENT_TASK",
    searchTasksByProject: "SEARCH_TASK_BY_PROJECT",
    onTabChange: "ON_TAB_CHANGE",
  },
};
