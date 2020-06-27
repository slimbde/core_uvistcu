import React, { Component } from 'react';
import { connect } from 'react-redux';
import { errorHandler } from '../extra/errorHandler';
import { blink } from '../extra/blink';
import actions from '../store/actions';

import { DepartmentList } from './list';
import { DepartmentCreate } from './create';
import { DepartmentDetails } from './details';


class Departments extends Component {
  static displayName = Departments.name;


  state = {
    mode: "list",
    linkText: "Создать",
    title: "список отделов"
  }


  componentDidMount = async () => {
    if (this.props.depts.length === 0)
      this.getDepts();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users.length === 0)
      this.getUsers();
  }

  ///// RENDER
  render() {
    let contents = [];
    if (this.state.mode === "list")
      contents = <DepartmentList depts={this.props.depts} users={this.props.users} deleteDept={this.props.deleteDept} blink={blink} />

    else if (this.state.mode === "create")
      contents = <DepartmentCreate users={this.props.users} blink={blink} addDept={this.createDept} />

    else if (this.state.mode === "details")
      contents = <DepartmentDetails offices={this.props.offices} fillOffices={this.props.fillOffices} blink={blink} />

    return (
      <div>
        <div className="display-4 text-uppercase text-muted">{this.state.title}</div>
        <a href="/department" className="text-primary" onClick={(e) => { e.preventDefault(); this.linkToggle(); }}>{this.state.linkText}</a>
        <div className="text-success" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }


  getDepts = async () => {
    const response = await fetch('api/department', {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0)
        this.props.fillDepts(data);

      else
        blink("Отделы отсутствуют", true);
    }
    else
      blink(`Error: ${response.statusText}`, true);

    await this.getUsers();
  }


  getUsers = async () => {
    const response = await fetch('api/user', {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length > 0)
        this.props.fillUsers(data);
    }
    else
      this.props.blink("Не могу найти пользователей", true);
  }


  createDept = async () => {
    const form = document.forms["CreateForm"];
    let name = form.elements["Name"].value;
    let id = form.elements["ChiefId"].value;

    const response = await fetch("api/department", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        managerId: id
      })
    });

    let data = await response.json();
    if (response.ok) {
      this.props.addDept({ id: data, name: name, managerId: id });
      blink(`Отдел ${data.name} успешно добавлен`);
      this.linkToggle();
    }
    else
      blink(errorHandler(data), true);
  }


  linkToggle = async () => {
    if (this.state.mode === "list")
      this.setState({ mode: "create", linkText: "Назад", title: "создать отдел" });
    else
      this.setState({ mode: "list", linkText: "Создать", title: "список отделов" });
  }

}

/////////// MAP STATE
function mapStateToProps(state) {
  return {
    depts: state.deptReducer.depts,
    users: state.deptReducer.users,
    title: state.deptReducer.title,
  }
}

export default connect(mapStateToProps, actions)(Departments);