import ReactTable from "react-table";
import React from "react";
import { connect } from "react-redux";
import {
  onTaskFieldChange,
  getTasks,
  addTask,
  removeTask,
  editTask,
  resetTask,
  _getTasks,
  onEditClick,
  onDeleteClick,
  getParentTasks,
  searchTasksByProject,
  onTabChange,
} from "../actions/taskAction";
import "react-table/react-table.css";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import {convertDateStringToLocalTime} from '../utils';
import SearchAndSortComponent from "./search-and-sort-component";
import { sortList } from "../utils";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  divider: {
    width: "100%",
    borderBottom: "1px solid #979797",
    marginBottom: "10px"
  },
});


const sortQueries = [
  { id: "startDate", desc: false, label: "Start Date" },
  { id: "endDate", desc: false, label: "End Date"},
  { id: "priority", desc: false, label: "Priority" },
    { id: "status", desc: false, label: "Completed" }
];


class TaskListComponent extends React.Component {

  handleSearch = searchText => {
    this.props.searchTasksByProject(searchText)
  };

  onClear = () => {
    this.props.getTasks();
  };

  onSort = sortQuery => {
    const sortedList = [...this.props.taskList];
    sortList(sortedList, sortQuery);
    this.props._getTasks([...sortedList]);
  };

  onEditClick = (taskObj) => {
      this.props.onTabChange(1); //update task screen
      this.props.onEditClick(taskObj)
  }

  render() {
    const { classes, taskList } = this.props;

    const columns = [
      {
        Header: "Task",
        accessor: "taskName",
        Cell: props => <span className="taskName">{props.value}</span> // Custom cell components!
      },
      {
        Header: "Parent",
        accessor: "parentTaskName",
        Cell: props => <span className="parentTaskName">{props.value}</span> // Custom cell components!
      },
                       {
        Header: "Priority",
        accessor: "priority",
        Cell: props => <span className="priority">{props.value}</span> // Custom cell components!
      },  
      {
        Header: "StartDate",
        accessor: "startDate",
        Cell: props => <span className="startDate">{props.value ? convertDateStringToLocalTime(props.value) : 'Not set'}</span> // Custom cell components!
      },          
      {
        Header: "EndDate",
        accessor: "endDate",
        Cell: props => <span className="endDate">{props.value ? convertDateStringToLocalTime(props.value) : 'Not set'}</span> // Custom cell components!
      },
      {
        id: "editTaskActions", // Required because our accessor is not a string
        Header: "",
        accessor: "taskId",
        Cell: props => {
          const { original } = props;
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.onEditClick(original);
              }}
              className={classes.button}
            >
              Edit
            </Button>
          );
        }
      },
      {
        id: "endTaskActions",
        Header: "",
        accessor: "taskId",
        Cell: props => {
          const { original } = props;
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.props.onEndTaskClick(original);
              }}
              className={classes.button}
            >
              End Task
            </Button>
          );
        }
      }
    ];
    return (
    <div>
        <SearchAndSortComponent
          handleSearch={this.handleSearch}
          onClear={this.onClear}
          onSort={this.onSort}
          sortQueries={sortQueries}
        />
        <div className={classes.divider} />        
      <ReactTable data={taskList} columns={columns} />;
      </div>
    )  
  }

  componentWillMount() {
    this.props.getTasks();
  }  
}

const mapStateToProps = state => {
  console.log("task", state.task);
  return {
    taskList: state.task.taskList,
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
    parentTaskList: state.task.parentTaskList,
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, {
    onTaskFieldChange,
    getTasks,
    addTask,
    removeTask,
    editTask,
    resetTask,
    _getTasks,
    onEditClick,
    onTabChange,
    searchTasksByProject,
  })(TaskListComponent)
);