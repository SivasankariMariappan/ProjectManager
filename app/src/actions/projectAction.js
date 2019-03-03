import axios from '../axios/axios';
import {actionTypes} from './action-types';

export const onUserChange = (userObj) => (dispatch) => {
  dispatch ({
    type: actionTypes.user.onUserChange,
    data: userObj
  });
}
const _addUser = (addedUser) => ({
    type: actionTypes.user.addUser,
    data: addedUser,
});
 
export const addUser = () => {
    return (dispatch, getState) => {
    	const userData = getState().user;
        const payload = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            employeeId: userData.employeeId,
        };
 
        return axios.post('user/add', payload).then(result => {
            dispatch(_addUser(result.data));
        });
    };
};
 
const _removeUser = ({ id } = {}) => ({
    type: actionTypes.user.removeUser ,
    data: id,
});
 
export const removeUser = ({ id } = {}) => {
    return (dispatch) => {
        return axios.delete(`user/${id}`).then(() => {
            dispatch(_removeUser({ id }));
        })
    }
};
 
const _editUser = (updatedUserObj) => ({
    type: actionTypes.user.editUser,
    data: updatedUserObj,
});
 
export const editUser = () => {
    return (dispatch, getState) => {
       	const userData = getState().user;
        const payload = {
        	userId: userData.userId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            employeeId: userData.employeeId,
        };
        return axios.put('user/update', payload).then((result) => {
            dispatch(_editUser(result.data));
        });
    }
};
 
const _getUsers = (users) => ({
    type: actionTypes.user.loadUserList,
    data: {userList: users},
});
 
export const getUsers = () => {
    return (dispatch) => {
        return axios.get('user/all').then(result => {
            const users = [];
 
            result.data.forEach(user => {
                users.push(user);
            });
 
            dispatch(_getUsers(users));
        });
    };
};

export const resetUser = () => ({
    type: actionTypes.user.resetUser,
});