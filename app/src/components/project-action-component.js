import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import {
  getUsers,
} from "../actions/userAction";
import {
  onProjectFieldChange,
  getProjects,
  addProject,
  removeProject,
  editProject,
  resetProject,
  _getProjects,
  onEditClick,
  onDeleteClick
} from "../actions/projectAction";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import UserListComponent from "./user-list-component";
import SearchAndSortComponent from "./search-and-sort-component";
import { sortList } from "../utils";
import DatePicker from "react-datepicker";
import Slider from "@material-ui/lab/Slider";
import moment from "moment";
import Checkbox from '@material-ui/core/Checkbox';
import "react-datepicker/dist/react-datepicker.css";
import AutoSuggestComponent from './auto-suggest-component'
import ProjectListComponent from './project-list-component'

const styles = theme => ({
  textField: {
    width: "35%",
  },
  label: {
    textAlign: "center",
    width: "10%",
  },
  priority: {
    width: "38px",
    textAlign: "center",
    border: "1px solid darkgrey",
  },
  field: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: "auto"
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
    width: "100%",
  },
  search: {
    display: "flex"
  }
});

const sortQueries = [
  { id: "startDate", desc: false, label: "Start Date" },
  { id: "endDate", desc: false, label: "End Date"},
  { id: "priority", desc: false, label: "Priority" },
    { id: "completedTaskNumber", desc: false, label: "Completed" }
];

export class ProjectActionComponent extends React.Component {
  state = {
    setDate: false
  };

  fetchSuggestions = () => {
    const {userList} = this.props;
    const suggestions = [];
    if(userList.length){
       userList.forEach(user => {
        suggestions.push({label: user.firstName, value: user.firstName, userId: user.userId});
      });
    };

    return suggestions;
  }

  onManagerSelect = (suggestion) => {
    this.props.onProjectFieldChange({ 'userId': suggestion.userId, 'manager': suggestion.value });
  };

  handleUserTypedManagerName = managerName => {
        this.props.onProjectFieldChange({ 'manager' : managerName });
  }

  handleChange = name => event => {
    this.props.onProjectFieldChange({ [name]: event.target.value });
  };

  handleStartDateChange = date => {
        this.props.onProjectFieldChange({ 'startDate': date });
  }

  handleEndDateChange = date => {
        this.props.onProjectFieldChange({ 'endDate': date });
  }

  handlePriorityChange = (event, value) => {
    this.props.onProjectFieldChange({ 'priority': value });
  };

  submitProject = () => {
    const { projectId, addProject, editProject } = this.props;
    if (projectId) editProject();
    else addProject();
  };

  resetProject = () => {
    this.props.resetProject();
  };

  handleSearch = searchText => {
    const { projectList } = this.props;
    let filterProjects = [];
    if (searchText) {
      for (var i = 0; i < projectList.length; i++) {
        let projectValues = Object.values(projectList[i]);
        if (projectValues.indexOf(searchText) > -1) {
          filterProjects.push(projectList[i]);
        }
      }
    }
    this.props._getProjects(filterProjects);
  };

  onClear = () => {
    this.props.getProjects();
  };

  onSort = sortQuery => {
    const sortedList = [...this.props.projectList];
    sortList(sortedList, sortQuery);
    this.props._getProjects([...sortedList]);
  };

  handleCheckboxClick = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;
    const { projectId, projectName, startDate, endDate, priority, userId, userList, manager } = this.props;
    const isDateSelected = this.state.setDate ? startDate && endDate : true
    const enableSubmit = projectName && priority && priority && isDateSelected;
    const buttonText = projectId ? 'Update' : 'Add';
    return (
      <div>
        <form noValidate autoComplete="off">
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Project:{" "}
            </Typography>
            <TextField
              id="project-name"
              className={classes.textField}
              value={projectName}
              onChange={this.handleChange("projectName")}
              margin="normal"
              variant="filled"
            />
          </div>
           <div className={classes.field}>
           <div className={classes.field}>
                   <Checkbox
          checked={this.state.setDate}
          onChange={this.handleCheckboxClick('setDate')}
          value="setDate"
          color="primary"
        />
                    <Typography variant="h5" gutterBottom>
              Set Start and End Date
            </Typography>
          </div>  
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom>
              Start Date:
            </Typography>
            <DatePicker
              className="start-date-field"
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
              disabled={!this.state.setDate}
            />
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom>
              End Date:
            </Typography>
            <DatePicker
              className="end-date-field"
              name="endDate"
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="End Date"
              dateFormat="DD/MM/YYYY"
              selected={endDate}
              disableUnderline={false}
              onChange={this.handleEndDateChange}
              minDate={moment(new Date()).add(1,'days')}
              disabled={!this.state.setDate}
            />
          </div>
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Priority:{" "}
            </Typography>
            <div style={{width: '35%'}}>
            <Slider
              className={classes.slider}
              min={0}
              max={30}
              step={5}
              value={priority}
              name="priority"
              id="priority"
              onChange={this.handlePriorityChange}
            />
            <span style={{float: 'left'}}> 0 </span>
            <span style={{float: 'right'}}> 30 </span>
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
              Manager:{" "}
            </Typography>
            <div className={classes.textField}>
            <AutoSuggestComponent suggestions={this.fetchSuggestions()} placeholder={"Search and select Manager"} 
              onSuggestionSelected={this.onManagerSelect}
              inputchangecallback={this.handleUserTypedManagerName}
              value={manager}
              />
            </div>
          </div>
          <div className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              disabled={!enableSubmit}
              onClick={this.submitProject}
              className={classes.button}
            >
              {buttonText}
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!enableSubmit}
              onClick={this.resetProject}
              className={classes.button}
            >
              Reset
            </Button>
          </div>
        </form>
          <div className={classes.divider} />
        <SearchAndSortComponent
          handleSearch={this.handleSearch}
          onClear={this.onClear}
          onSort={this.onSort}
          sortQueries={sortQueries}
        />
        <ProjectListComponent
          projectList={this.props.projectList}
          onDeleteClick={this.props.removeProject}
          onEditClick={this.props.onEditClick}
        /> 
      </div>
    );
  }

  componentWillMount() {
    this.props.getUsers();
    this.props.getProjects();
  }
}
const mapStateToProps = state => {
  console.log("project", state.project);
  return {
    projectId: state.project.projectId,
    projectName: state.project.projectName,
    startDate: state.project.startDate,
    endDate: state.project.endDate,
    priority: state.project.priority,
    userId: state.project.userId,
    manager: state.project.manager,
    projectList: state.project.projectList,
    userList: state.projectUser.user.userList,
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, {
    onProjectFieldChange,
    getProjects,
    addProject,
    removeProject,
    editProject,
    resetProject,
    _getProjects,
    onEditClick,
    getUsers
  })(ProjectActionComponent)
);
