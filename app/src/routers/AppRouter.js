import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DashboardComponent from '../components/dashboard-component';
 
const AppRouter = () => (
    <BrowserRouter>
        <div className='container'>
            <Switch>
                <Route path="/" component={DashboardComponent} exact={true} />
            </Switch>
        </div>
    </BrowserRouter>
);
 
export default AppRouter;