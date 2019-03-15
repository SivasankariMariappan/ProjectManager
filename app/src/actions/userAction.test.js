import * as actions from "./userAction";
import { actionTypes } from "./action-types";

describe("User Detail Action tests", () => {
  it("should, on onUserChange invocation, issue onUserChange action", () => {
    const action = actions.onUserChange({ userName: "Test" });
    const mockDispatch = jest.fn();
    action(mockDispatch);
    expect(mockDispatch.mock.calls.length).toBe(1);
    const firstAction = mockDispatch.mock.calls[0][0];
    expect(firstAction.type).toEqual(actionTypes.user.onUserChange);
    expect(firstAction.data).toEqual({ userName: "Test" });
  });
  it("should, on _addUser invocation, issue addUser action", () => {
    expect(actions._addUser({ userName: "Test", userId: "2" })).toEqual({
      type: actionTypes.user.addUser,
      data: { userName: "Test", userId: "2" }
    });
  });
  it("should, on _removeUser invocation, issue removeUser action", () => {
    expect(actions._removeUser("2")).toEqual({
      type: actionTypes.user.removeUser,
      data: "2"
    });
  });
  it("should, on _editUser invocation, issue editUser action", () => {
    expect(actions._editUser({ userId: "2", userName: "test" })).toEqual({
      type: actionTypes.user.editUser,
      data: { userId: "2", userName: "test" }
    });
  });
  it("should, on _getUsers invocation, issue getUsers action", () => {
    const users = [{ id: "1" }, { id: "2" }];
    expect(actions._getUsers(users)).toEqual({
      type: actionTypes.user.loadUserList,
      data: { userList: users }
    });
  });
  it("should, on resetUser invocation, issue resetUser action", () => {
    expect(actions.resetUser()).toEqual({
      type: actionTypes.user.resetUser
    });
  });
  it("should, on onDeleteClick invocation, issue onDeleteClick action", () => {
    expect(actions.onDeleteClick("2")).toEqual({
      type: actionTypes.user.onDeleteClick,
      data: "2"
    });
  });
  it("should, on onEditClick invocation, issue onEditClick action", () => {
    expect(actions.onEditClick({ id: "1", name: "test" })).toEqual({
      type: actionTypes.user.onEditClick,
      data: { id: "1", name: "test" }
    });
  });
});
