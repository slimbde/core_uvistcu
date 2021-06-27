import 'bootstrap/dist/css/bootstrap.min.css';
import "./custom.scss";
import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Layout from './components/layout';
import Login from "./components/authenticate/login";
//import Home from './components/Home';
//import Departments from './components/departments';
//import Offices from './components/offices';
//import Users from './components/users';
//import Labours from './components/labours';
//import Vacations from './components/vacations';
//import Overtimes from './components/overtimes';
//import Authenticate from './components/authenticate';



export default class App extends Component {
  notFound = <div className="display-5 not-found">404 - Запрашиваемая страница не найдена на сервере</div>

  state = {
    //user: { role: "admin", id: "1" },
    user: null,
    routes: []
  }

  componentDidUpdate() {
    if (!!this.state.user) {
      this.setState(() => {
        const routes = this.user.role === "manager"
          ? this.manager
          : this.user.role === "admin"
            ? [this.admin, this.manager]
            : []
        return { routes }
      })
    }
  }

  admin =
    <Fragment key="1">
      {/*<Route exact path='/department' component={Departments} />
      <Route exact path='/department/:id' component={Departments} />*/}
    </Fragment>

  manager =
    <Fragment key="2">
      {/*<Route exact path='/user' component={Users} />
      <Route exact path='/user/:id' component={Users} />
      <Route exact path='/office' component={Offices} />
      <Route exact path='/office/:id' component={Offices} />
      <Route exact path='/labour' component={Labours} />
      <Route exact path='/labour/:id' component={Labours} />*/}
    </Fragment>



  render() {

    return !!this.state.user
      ? <Layout role={this.user.role} user={this.user}>
        {/*<Route exact path='/' component={Home} />
          <Route exact path='/overtime' component={Overtimes} />
          <Route exact path='/overtime/:id' component={Overtimes} />
          <Route exact path='/vacation' component={Vacations} />
          <Route exact path='/vacation/:id(\d+)' component={Vacations} />
          <Route exact path='/vacation/create' component={Vacations} />
          <Route exact path='/vacation/list' component={Vacations} />
          <Route exact path='/auth/:id' component={Authenticate} />
          {routes}*/}
      </Layout>
      : <Switch>
        <Route path="/" component={Login} />
      </Switch>
  }
}
