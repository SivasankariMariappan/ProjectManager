import ReactTable from "react-table";
import React from 'react';
import 'react-table/react-table.css'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  }
})

class UserListComponent extends React.Component {


	render(){
			const { classes } = this.props;
		  const data = [{
    firstName: 'Tanner Linsley',
    lastName: 'er',
    employeeId: '9023',
  },{
    firstName: 'Tanner Linsley1',
    lastName: 'er1',
    employeeId: '90231', 
  },
  {
    firstName: 'Tanner Linsley2',
    lastName: 'er2',
    employeeId: '90232', 
  }];

			  const columns = [{
   				 Header: 'FirstName',
   				 accessor: 'firstName' ,
				  Cell: props => <span className='firstName'>{props.value}</span> // Custom cell components!
  			  }, {
   				 Header: 'LastName',
   				 accessor: 'lastName',
  				  Cell: props => <span className='lastName'>{props.value}</span> // Custom cell components!
 			 }, {
 			     id: 'employeeID', // Required because our accessor is not a string
  			     Header: 'Employee ID',
 			     accessor: 'employeeId',
 				  Cell: props => <span className='employeeId'>{props.value}</span> // Custom cell components!
 			 }, ];
		return(
		<ReactTable
		    data={data}
            columns={columns}
		/>
		);
	};
};
export default UserListComponent;
