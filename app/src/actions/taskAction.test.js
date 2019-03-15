import * as actions from "./taskAction";
import { actionTypes } from "./action-types";

describe("Task Detail Action tests", () => {
  it("should, on onTaskFieldChange invocation, issue onTaskChange action", () => {
    const action = actions.onTaskFieldChange({ taskName: "Test" });
    const mockDispatch = jest.fn();
    action(mockDispatch);
    expect(mockDispatch.mock.calls.length).toBe(1);
    const firstAction = mockDispatch.mock.calls[0][0];
    expect(firstAction.type).toEqual(actionTypes.task.onTaskChange);
    expect(firstAction.data).toEqual({ taskName: "Test" });
  });
  it("should, on _addTask invocation, issue addTask action", () => {
    expect(actions._addTask({ taskName: "Test", taskId: "2" })).toEqual({
      type: actionTypes.task.addTask,
      data: { taskName: "Test", taskId: "2" }
    });
  });
  it("should, on _removeTask invocation, issue _removeTask action", () => {
    expect(actions._removeTask("2")).toEqual({
      type: actionTypes.task.removeTask,
      data: "2"
    });
  });
  it("should, on _editTask invocation, issue editTask action", () => {
    expect(actions._editTask({ taskId: "2", taskName: "test" })).toEqual({
      type: actionTypes.task.editTask,
      data: { taskId: "2", taskName: "test" }
    });
  });
  it("should, on _getTasks invocation, issue getTasks action", () => {
    const tasks = [{ id: "1" }, { id: "2" }];
    expect(actions._getTasks(tasks)).toEqual({
      type: actionTypes.task.loadTaskList,
      data: { taskList: tasks }
    });
  });
  it("should, on resetTask invocation, issue resetTask action", () => {
    expect(actions.resetTask()).toEqual({
      type: actionTypes.task.resetTask
    });
  });
  it("should, on _getParentTasks invocation, issue loadParentTaskList action", () => {
    const tasks = [{ id: "1" }, { id: "2" }];
    expect(actions._getParentTasks(tasks)).toEqual({
      type: actionTypes.task.loadParentTaskList,
      data: { parentTaskList: tasks }
    });
  });
});
