import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import UserActionsComponent from './user-action-component';

export class DashboardComponent extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render () {
  	const { value } = this.state;
  	return (
    <header>
        <h4>Project Mangement Application</h4>
		<AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            <Tab label="Add Project" />
            <Tab label="Add Task" />
            <Tab label="Add User" />
            <Tab label="View Task" />
          </Tabs>
        </AppBar>
          {value === 2 && <UserActionsComponent/> }
    </header>
    );
  };
};
 
export default DashboardComponent;