import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import {
  onUserChange,
  getUsers,
  addUser,
  removeUser,
  editUser,
  resetUser,
  _getUsers,
  onEditClick
} from "../actions/userAction";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import UserListComponent from "./user-list-component";
import SearchAndSortComponent from "./search-and-sort-component";
import { sortList } from "../utils";
import DatePicker from "react-datepicker";
import Slider from "@material-ui/lab/Slider";
import moment from "moment";

const styles = theme => ({
  textField: {
    margin: "10px 0px 20px 50px",
    width: 200
  },
  label: {
    marginTop: "23px"
  },
  field: {
    display: "flex",
    flexWrap: "wrap"
  },
  button: {
    margin: theme.spacing.unit
  },
  divider: {
    width: "100%",
    borderBottom: "1px solid #979797",
    marginBottom: "10px"
  },
  search: {
    display: "flex"
  }
});

export class ProjectActionComponent extends React.Component {
  handleChange = name => event => {
    this.props.onUserChange({ [name]: event.target.value });
  };

  submitUser = () => {
    const { userId, addUser, editUser } = this.props;
    if (userId) editUser();
    else addUser();
  };

  resetUser = () => {
    this.props.resetUser();
  };

  handleSearch = searchText => {
    const { userList } = this.props;
    let filterUsers = [];
    if (searchText) {
      for (var i = 0; i < userList.length; i++) {
        let userValues = Object.values(userList[i]);
        if (userValues.indexOf(searchText) > -1) {
          filterUsers.push(userList[i]);
        }
      }
    }
    this.props._getUsers(filterUsers);
  };

  onClear = () => {
    this.props.getUsers();
  };

  onSort = sortQuery => {
    const sortedList = [...this.props.userList];
    sortList(sortedList, sortQuery);
    this.props._getUsers([...sortedList]);
  };

  render() {
    const { classes } = this.props;
    const { projectName, startDate, endDate, firstName, priority } = this.props;
    const enableSubmit = projectName && firstName && priority;
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
              value={firstName}
              onChange={this.handleChange("projectName")}
              margin="normal"
              variant="filled"
            />
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Start Date:
            </Typography>
            <DatePicker
              className="start-date-field"
              name="startDate"
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="DD/MM/YYYY HH:MM"
              dateFormat="DD/MM/YYYY HH:mm"
              selected={startDate}
              disableUnderline={false}
              onChange={this.handleStartDateChange}
              minDate={moment()}
            />
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              End Date:
            </Typography>
            <DatePicker
              className="end-date-field"
              name="endDate"
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="DD/MM/YYYY HH:MM"
              dateFormat="DD/MM/YYYY HH:mm"
              selected={endDate}
              disableUnderline={false}
              onChange={this.endDateChange}
              minDate={moment()}
            />
          </div>
          <div className={classes.field}>
            <Typography>Priority</Typography>
            <Slider
              className="priority-slider"
              min={0}
              max={30}
              step={5}
              value={priority}
              name="priority"
              id="priority"
              onChange={this.handleSliderChange}
            />
          </div>
          <div className={classes.field}>
            <Button
              variant="contained"
              color="primary"
              disabled={!enableSubmit}
              onClick={this.submitUser}
              className={classes.button}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!enableSubmit}
              onClick={this.resetUser}
              className={classes.button}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.props.getUsers();
  }
}
const mapStateToProps = state => {
  console.log("prjectuser", state.projectUser);

  return {
    firstName: state.projectUser.user.firstName,
    lastName: state.projectUser.user.lastName,
    employeeId: state.projectUser.user.employeeId,
    userId: state.projectUser.user.userId,
    userList: state.projectUser.user.userList
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, {
    onUserChange,
    getUsers,
    addUser,
    removeUser,
    editUser,
    resetUser,
    _getUsers,
    onEditClick
  })(ProjectActionComponent)
);
