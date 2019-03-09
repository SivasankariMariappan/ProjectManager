import ReactTable from "react-table";
import React from "react";
import "react-table/react-table.css";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import {convertDateStringToLocalTime} from '../utils';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  }
});

class ProjectListComponent extends React.Component {
  render() {
    const { classes, projectList } = this.props;

    const columns = [
      {
        Header: "ProjectName",
        accessor: "projectName",
        Cell: props => <span className="projectName">{props.value}</span> // Custom cell components!
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
        Header: "No Of Tasks",
        accessor: "taskNumber",
        Cell: props => <span className="taskNumber">{props.value}</span> // Custom cell components!
      },
                  {
        Header: "No Of Completed Tasks",
        accessor: "completedTaskNumber",
        Cell: props => <span className="completedTaskNumber">{props.value}</span> // Custom cell components!
      },
                        {
        Header: "Priority",
        accessor: "priority",
        Cell: props => <span className="priority">{props.value}</span> // Custom cell components!
      },
      {
        id: "editProjectActions", // Required because our accessor is not a string
        Header: "",
        accessor: "projectId",
        Cell: props => {
          const { original } = props;
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.props.onEditClick(original);
              }}
              className={classes.button}
            >
              Update
            </Button>
          );
        }
      },
      {
        id: "deleteProjectActions", // Required because our accessor is not a string
        Header: "",
        accessor: "projectId",
        Cell: props => {
          const { original } = props;
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                this.props.onDeleteClick(original);
              }}
              className={classes.button}
            >
              Suspend
            </Button>
          );
        }
      }
    ];
    return <ReactTable data={projectList} columns={columns} />;
  }
}
export default withStyles(styles)(ProjectListComponent);
