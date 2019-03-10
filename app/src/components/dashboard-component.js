import React from "react";
import { connect } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import UserActionsComponent from "./user-action-component";
import ProjectActionComponent from "./project-action-component";
import TaskActionComponent from "./task-action-component";
import TaskListComponent from "./task-list-component";
import { 
  onTabChange
} from "../actions/taskAction";

export class DashboardComponent extends React.Component {

  handleChange = (event, value) => {
    this.props.onTabChange(value);
  };

  render() {
    const { activeTab } = this.props;
    return (
      <header>
        <h4>Project Mangement Application</h4>
        <AppBar position="static">
          <Tabs value={activeTab} onChange={this.handleChange}>
            <Tab label="Add Project" />
            <Tab label="Add Task" />
            <Tab label="Add User" />
            <Tab label="View Task" />
          </Tabs>
        </AppBar>
        {activeTab === 0 && <ProjectActionComponent />}
                {activeTab === 1 && <TaskActionComponent />}
        {activeTab === 2 && <UserActionsComponent />}
        {activeTab === 3 && <TaskListComponent />}
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeTab: state.dashboard.activeTab,
  }
}


export default connect(mapStateToProps, {
    onTabChange
  })(DashboardComponent)
