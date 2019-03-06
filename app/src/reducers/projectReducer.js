import { actionTypes } from "../actions/action-types";

const userObj = {
  firstName: "",
  lastName: "",
  employeeId: "",
  userId: ""
};
const projectReducerDefaultState = {
  user: {
    ...userObj,
    userList: []
  }
};

export default (state = projectReducerDefaultState, action={}) => {
  console.log("in reducer");

  switch (action.type) {
    case actionTypes.user.onUserChange:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.data
        }
      };
    case actionTypes.user.loadUserList:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.data
        }
      };
    case actionTypes.user.addUser:
      const newUser = action.data;
      const userList = [...state.user.userList];
      userList.push(newUser);
      return {
        ...state,
        user: {
          ...userObj,
          userList
        }
      };
          case actionTypes.user.onEditClick:
          const userToShow = action.data
            return {
              ...state,
              user: {
                firstName: userToShow.firstName,
                lastName: userToShow.lastName,
                employeeId: userToShow.employeeId,
                userId: userToShow.userId,
                ...state.user.userList,
              }
            };
    case actionTypes.user.editUser:
      const updatedUser = action.data;
      const userListForEdit = [...state.user.userList];
      let index = userListForEdit.findIndex(
        user => user.userId === updatedUser.userId
      );
      if (index > -1) userListForEdit[index] = updatedUser
      return {
        ...state,
        user: {
          ...userObj,
          userList: userListForEdit
        }
      };
    case actionTypes.user.removeUser:
      const userListForRemove = state.user.userList.filter(
        ({ userId }) => userId !== action.data.userId
      );
      return {
        ...state,
        user: {
          ...userObj,
          userList: userListForRemove
        }
      };
    case actionTypes.user.resetUser:
      return {
        ...state,
        user: {
          ...state.user,
          ...userObj
        }
      };
    default:
      return state;
  }
};
