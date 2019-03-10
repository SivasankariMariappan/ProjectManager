import axios from "../axios/axios";
import { actionTypes } from "./action-types";

export const onUserChange = userObj => dispatch => {
  dispatch({
    type: actionTypes.user.onUserChange,
    data: userObj
  });
};

const _addUser = addedUser => ({
  type: actionTypes.user.addUser,
  data: addedUser
});

export const addUser = () => {
  return (dispatch, getState) => {
    const userData = getState().projectUser.user;
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      employeeId: userData.employeeId
    };

    return axios.post("user/add", payload).then(result => {
      dispatch(_addUser(result.data));
    });
  };
};

const _removeUser = (userId = {}) => ({
  type: actionTypes.user.removeUser,
  data: userId
});

export const removeUser = ({ userId } = {}) => {
  return dispatch => {
    return axios.delete(`user/${userId}`).then(() => {
      dispatch(_removeUser(userId));
    });
  };
};

const _editUser = updatedUserObj => ({
  type: actionTypes.user.editUser,
  data: updatedUserObj
});

export const editUser = () => {
  return (dispatch, getState) => {
    const userData = getState().projectUser.user;
    const payload = {
      userId: userData.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      employeeId: userData.employeeId
    };
    return axios.put("user/update", payload).then(result => {
      dispatch(_editUser(result.data));
    });
  };
};

export const _getUsers = users => ({
  type: actionTypes.user.loadUserList,
  data: { userList: users }
});

export const getUsers = () => {
  return dispatch => {
    return axios.get("user/all").then(result => {
      const users = [];

      result.data.forEach(user => {
        users.push(user);
      });

      dispatch(_getUsers(users));
    });
  };
};

export const resetUser = () => ({
  type: actionTypes.user.resetUser
});

export const onEditClick = user => ({
  type: actionTypes.user.onEditClick,
  data: user
});

export const onDeleteClick = userId => ({
  type: actionTypes.user.onDeleteClick,
  data: userId
});
