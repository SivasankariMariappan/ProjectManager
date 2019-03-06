import ReactTable from "react-table";
import React from "react";
import "react-table/react-table.css";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

class UserListComponent extends React.Component {
  render() {
    const { classes } = this.props;
    const data = [
      {
        firstName: "Tanner Linsley",
        lastName: "er",
        employeeId: "9023",
        userId: '1',
      },
      {
        firstName: "Tanner Linsley1",
        lastName: "er1",
        employeeId: "90231",
        userId: '2',
      },
      {
        firstName: "Tanner Linsley2",
        lastName: "er2",
        employeeId: "90232",
        userId: '3',
      }
    ];

    const columns = [
      {
        Header: "FirstName",
        accessor: "firstName",
        Cell: props => <span className="firstName">{props.value}</span> // Custom cell components!
      },
      {
        Header: "LastName",
        accessor: "lastName",
        Cell: props => <span className="lastName">{props.value}</span> // Custom cell components!
      },
      {
        id: "employeeID", // Required because our accessor is not a string
        Header: "Employee ID",
        accessor: "employeeId",
        Cell: props => <span className="employeeId">{props.value}</span> // Custom cell components!
      },
            {
              id: "editUserActions", // Required because our accessor is not a string
              Header: "",
              accessor: "userId",
              Cell: props =>{
               const { original } = props
              return(
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={()=> {this.props.onEditClick(original)}}
                          className={classes.button}
                        >
                          Edit
                        </Button>
              )
              }
              },
                {
              id: "deleteUserActions", // Required because our accessor is not a string
              Header: "",
              accessor: "userId",
              Cell: props =>{
              const { original } = props
              return(
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={()=> {this.props.onDeleteClick(original)}}
                          className={classes.button}
                        >
                          Delete
                        </Button>
              )
              }
            }
    ];
    return <ReactTable data={data} columns={columns} />;
  }
}
export default withStyles(styles)(UserListComponent);
