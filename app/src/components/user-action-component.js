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

export class UserActionsComponent extends React.Component {
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
    const { firstName, lastName, employeeId } = this.props;
    const enableSubmit = firstName && lastName && employeeId;
    return (
      <div>
        <form noValidate autoComplete="off">
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              First Name:{" "}
            </Typography>
            <TextField
              id="first-name"
              className={classes.textField}
              value={firstName}
              onChange={this.handleChange("firstName")}
              margin="normal"
              variant="filled"
            />
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Last Name:{" "}
            </Typography>
            <TextField
              id="last-name"
              className={classes.textField}
              value={lastName}
              onChange={this.handleChange("lastName")}
              margin="normal"
              variant="filled"
            />
          </div>
          <div className={classes.field}>
            <Typography variant="h5" gutterBottom className={classes.label}>
              Employee ID:{" "}
            </Typography>
            <TextField
              id="employee-id"
              className={classes.textField}
              value={employeeId}
              onChange={this.handleChange("employeeId")}
              margin="normal"
              variant="filled"
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
        <div className={classes.divider} />
        <SearchAndSortComponent
          handleSearch={this.handleSearch}
          onClear={this.onClear}
          onSort={this.onSort}
        />
        <UserListComponent
          userList={this.props.userList}
          onDeleteClick={this.props.removeUser}
          onEditClick={this.props.onEditClick}
        />
      </div>
    );
  }

  componentDidMount() {
    this.props.getUsers();
  }
}
const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    employeeId: state.user.employeeId,
    userId: state.user.userId,
    userList: state.user.userList
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
  })(UserActionsComponent)
);
