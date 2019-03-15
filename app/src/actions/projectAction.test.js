import * as actions from "./projectAction";
import { actionTypes } from "./action-types";

describe("Project Detail Action tests", () => {
  it("should, on onProjectFieldChange invocation, issue onProjectChange action", () => {
    const action = actions.onProjectFieldChange({ projectName: "Test" });
    const mockDispatch = jest.fn();
    action(mockDispatch);
    expect(mockDispatch.mock.calls.length).toBe(1);
    const firstAction = mockDispatch.mock.calls[0][0];
    expect(firstAction.type).toEqual(actionTypes.project.onProjectChange);
    expect(firstAction.data).toEqual({ projectName: "Test" });
  });
  it("should, on _addProject invocation, issue addProject action", () => {
    expect(
      actions._addProject({ projectName: "Test", projectId: "2" })
    ).toEqual({
      type: actionTypes.project.addProject,
      data: { projectName: "Test", projectId: "2" }
    });
  });
  it("should, on _removeProject invocation, issue removeProject action", () => {
    expect(actions._removeProject("2")).toEqual({
      type: actionTypes.project.removeProject,
      data: "2"
    });
  });
  it("should, on _editProject invocation, issue editProject action", () => {
    expect(
      actions._editProject({ projectId: "2", projectName: "test" })
    ).toEqual({
      type: actionTypes.project.editProject,
      data: { projectId: "2", projectName: "test" }
    });
  });
  it("should, on _getProjects invocation, issue getProjects action", () => {
    const projects = [{ id: "1" }, { id: "2" }];
    expect(actions._getProjects(projects)).toEqual({
      type: actionTypes.project.loadProjectList,
      data: { projectList: projects }
    });
  });
  it("should, on resetProject invocation, issue resetProject action", () => {
    expect(actions.resetProject()).toEqual({
      type: actionTypes.project.resetProject
    });
  });
  it("should, on onDeleteClick invocation, issue onDeleteClick action", () => {
    expect(actions.onDeleteClick("2")).toEqual({
      type: actionTypes.project.onProjectDeleteClick,
      data: "2"
    });
  });
});
