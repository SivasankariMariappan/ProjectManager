import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { getUsers } from "../actions/userAction";
import { getProjects } from "../actions/projectAction";
import {
  onTaskFieldChange,
  getTasks,
  addTask,
  removeTask,
  editTask,
  resetTask,
  _getTasks,
  onEditClick,
  getParentTasks
} from "../actions/taskAction";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import DatePicker from "react-datepicker";
import Slider from "@material-ui/lab/Slider";
import moment from "moment";
import Checkbox from "@material-ui/core/Checkbox";
import "react-datepicker/dist/react-datepicker.css";
import AutoSuggestComponent from "./auto-suggest-component";

const styles = theme => ({
  textField: {
    width: "35%"
  },
  label: {
    textAlign: "center",
    width: "10%"
  },
  priority: {
    width: "38px",
    textAlign: "center",
    border: "1px solid darkgrey"
  },
  field: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  dateField: {
    paddingTop: "25px",
    paddingLeft: "190px",
    paddingBottom: "9px",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  button: {
    margin: theme.spacing.unit
  },
  divider: {
    width: "100%",
    borderBottom: "1px solid #979797",
    marginBottom: "10px"
  },
  slider: {
    width: "100%"
  },
  search: {
    display: "flex"
  },
  startDate: {},
  endDate: {}
});

export class TaskActionComponent extends React.Component {
  fetchProjectSuggestions = () => {
    const { projectList } = this.props;
    const suggestions = [];
    if (projectList.length) {
      projectList.forEach(project => {
        suggestions.push({
          label: project.projectName,
          value: project.projectName,
          projectId: project.projectId
        });
      });
    }

    return suggestions;
  };

  fetchParentTaskSuggestions = () => {
    const { parentTaskList } = this.props;
    const suggestions = [];
    if (parentTaskList.length) {
      parentTaskList.forEach(task => {
        suggestions.push({
          label: task.parentTask,
          value: task.parentTask,
          parentId: task.parentId
        });
      });
    }

    return suggestions;
  };

  fetchUserSuggestions = () => {
    const { userList } = this.props;
    const suggestions = [];
    if (userList.length) {
      userList.forEach(user => {
        suggestions.push({
          label: user.firstName,
          value: user.firstName,
          userId: user.userId
        });
      });
    }

    return suggestions;
  };

  onProjectSelect = suggestion => {
    this.props.onTaskFieldChange({
      projectId: suggestion.projectId,
      projectName: suggestion.value
    });
  };

  handleUserTypedProjectName = projectName => {
    this.props.onTaskFieldChange({ projectName: projectName });
  };

  onParentTaskSelect = suggestion => {
    this.props.onTaskFieldChange({
      parentTaskId: suggestion.parentId,
      parentTaskName: suggestion.value
    });
  };

  handleUserTypedParentTaskName = parentTaskName => {
    this.props.onTaskFieldChange({ parentTaskName: parentTaskName });
  };

  onUserSelect = suggestion => {
    this.props.onTaskFieldChange({
      userId: suggestion.userId,
      userName: suggestion.value
    });
  };

  handleUserTypedUserName = userName => {
    this.props.onTaskFieldChange({ userName: userName });
  };

  handleChange = name => event => {
    this.props.onTaskFieldChange({ [name]: event.target.value });
  };

  handleStartDateChange = date => {
    this.props.onTaskFieldChange({ startDate: date });
    this.validateStartAndEndDate(date, this.props.endDate);
  };

  handleEndDateChange = date => {
    this.props.onTaskFieldChange({ endDate: date });
    this.validateStartAndEndDate(this.props.startDate, date);
  };

  validateStartAndEndDate(startDate, endDate) {
    let momentA = moment(startDate);
    let momentB = moment(endDate);
    if (momentA > momentB) {
      this.props.onTaskFieldChange({ endDate: momentA });
    }
  }
  handlePriorityChange = (event, value) => {
    this.props.onTaskFieldChange({ priority: value });
  };

  submitTask = () => {
    const { taskId, addTask, editTask } = this.props;
    if (taskId) editTask();
    else addTask();
  };

  resetTask = () => {
    this.props.resetTask();
  };

  handleCheckboxClick = name => event => {
    this.props.onTaskFieldChange({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    const {
      projectId,
      taskId,
      taskName,
      projectName,
      parentTask,
      parentTaskName,
      startDate,
      endDate,
      priority,
      userId,
      userName
    } = this.props;
    const enableTaskSubmit =
      projectId && taskName && priority && startDate && endDate && userId;
    const enableSubmit = parentTask ? taskName : enableTaskSubmit;
    const buttonText = taskId ? "Update" : "Add";
    return (
      <div>
        <form noValidate autoComplete="off">
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Project:{" "}
            </Typography>
            <div className={classes.textField}>
              <AutoSuggestComponent
                suggestions={this.fetchProjectSuggestions()}
                placeholder={"Search and Select Project"}
                onSuggestionSelected={this.onProjectSelect}
                inputchangecallback={this.handleUserTypedProjectName}
                value={projectName}
                disabled={parentTask || taskId}
              />
            </div>
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Task:{" "}
            </Typography>
            <TextField
              id="task-name"
              className={classes.textField}
              value={taskName}
              onChange={this.handleChange("taskName")}
              margin="normal"
              variant="filled"
            />
          </div>
          <div className={classes.field}>
            <Checkbox
              checked={parentTask}
              onChange={this.handleCheckboxClick("parentTask")}
              value="parentTask"
              color="primary"
              disabled={taskId}
            />
            <Typography variant="h5" gutterBottom>
              Parent Task
            </Typography>
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Priority:{" "}
            </Typography>
            <div style={{ width: "35%" }}>
              <Slider
                className={classes.slider}
                min={0}
                max={30}
                step={1}
                value={priority}
                name="priority"
                id="priority"
                onChange={this.handlePriorityChange}
                disabled={parentTask}
              />
              <span style={{ float: "left" }}> 0 </span>
              <span style={{ float: "right" }}> 30 </span>
            </div>
            <TextField
              id="priority"
              className={classes.priority}
              value={priority}
              margin="normal"
              variant="filled"
              disabled={true}
            />
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Parent Task:{" "}
            </Typography>
            <div className={classes.textField}>
              <AutoSuggestComponent
                suggestions={this.fetchParentTaskSuggestions()}
                placeholder={"Search and Select Parent Task"}
                onSuggestionSelected={this.onParentTaskSelect}
                inputchangecallback={this.handleUserTypedParentTaskName}
                value={parentTaskName ? parentTaskName : ""}
                disabled={parentTask}
              />
            </div>
          </div>
          <div className={classes.dateField}>
            <div className={classes.field}>
              <Typography variant="h5" gutterBottom>
                Start Date:{"  "}
              </Typography>
              <DatePicker
                className={classes.startDate}
                name="startDate"
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                dateFormat="DD/MM/YYYY"
                selected={startDate}
                disableUnderline={false}
                onChange={this.handleStartDateChange}
                minDate={moment()}
                disabled={parentTask}
              />
            </div>
            <div className={classes.field}>
              <Typography variant="h5" gutterBottom>
                End Date:{"  "}
              </Typography>
              <DatePicker
                className={classes.endDate}
                name="endDate"
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                placeholderText="End Date"
                dateFormat="DD/MM/YYYY"
                selected={endDate}
                disableUnderline={false}
                onChange={this.handleEndDateChange}
                minDate={moment(new Date()).add(1, "days")}
                disabled={parentTask}
              />
            </div>
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              User:{" "}
            </Typography>
            <div className={classes.textField}>
              <AutoSuggestComponent
                suggestions={this.fetchUserSuggestions()}
                placeholder={"Search and select User"}
                onSuggestionSelected={this.onUserSelect}
                inputchangecallback={this.handleUserTypedUserName}
                value={userName}
                disabled={parentTask}
              />
            </div>
          </div>
          <div className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              disabled={!enableSubmit}
              onClick={this.submitTask}
              className={classes.button}
            >
              {buttonText}
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!enableSubmit}
              onClick={this.resetTask}
              className={classes.button}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    );
  }

  componentWillMount() {
    this.props.getUsers();
    this.props.getProjects();
    this.props.getParentTasks();
  }
}
const mapStateToProps = state => {
  return {
    projectId: state.task.projectId,
    projectName: state.task.projectName,
    taskId: state.task.taskId,
    taskName: state.task.taskName,
    startDate: state.task.startDate,
    endDate: state.task.endDate,
    priority: state.task.priority,
    userId: state.task.userId,
    userName: state.task.userName,
    parentTask: state.task.parentTask,
    parentTaskName: state.task.parentTaskName,
    parentTaskId: state.task.parentTaskId,
    projectList: state.project.projectList,
    userList: state.projectUser.user.userList,
    parentTaskList: state.task.parentTaskList
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, {
    onTaskFieldChange,
    getProjects,
    getTasks,
    addTask,
    removeTask,
    editTask,
    resetTask,
    _getTasks,
    onEditClick,
    getUsers,
    getParentTasks
  })(TaskActionComponent)
);
