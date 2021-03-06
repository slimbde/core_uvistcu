import React, { Component } from 'react';
import { connect } from 'react-redux';
import { blink, errorHandler, bring } from '../extra/extensions';
import { addOffice, deleteOffice, fillOffices, alterOffice, alterUser } from '../redux/actions';
import history from '../extra/history';
import { Loading } from '../view/templates';

import OfficeList from './list'
import OfficeCreate from './create';
import OfficeAlter from './alter';
import { bindActionCreators } from 'redux';


class Offices extends Component {
  displayName = Offices.name;

  state = this.props.match.params.id
    ? {
      mode: "alter",
      title: "изменить группу",
      titleLink: "Отмена",
      currentId: +this.props.match.params.id,
      loading: true,
    }
    : {
      mode: "list",
      title: "список групп",
      titleLink: "Создать",
      currentId: null,
      loading: true
    }


  componentDidMount = () => {
    let request = [];

    if (this.props.offices.length === 0)
      request.push("office");

    if (this.props.users.length === 0)
      request.push("user");

    request.length > 0
      ? bring(request)
        .catch(error => this.setState({ error: error, loading: false }))
        .then(result => {
          this.props.fillOffices({
            offices: result.get("office"),
            users: result.get("user"),
          });
          this.setState({ loading: false });
        })
      : this.setState({ loading: false });
  }



  ///// RENDER
  render() {
    if (this.state.loading)
      return <Loading />

    else if (!!this.state.error)
      return <div className="text-danger font-italic">{this.state.error}</div>

    let contents = [];

    if (this.state.mode === "list")
      contents = <OfficeList
        offices={this.props.offices}
        users={this.props.users}
        deleteOffice={this.props.deleteOffice}
      />

    else if (this.state.mode === "create")
      contents = <OfficeCreate
        users={this.props.users}
        createOffice={this.createOffice}
      />

    else if (this.state.mode === "alter")
      contents = <OfficeAlter
        office={this.props.offices.find(o => o.id === this.state.currentId)}
        users={this.props.users}
        alterClick={this.alterOffice}
      />

    return (
      <div>
        <div className="display-5 text-uppercase text-muted">{this.state.title}</div>
        <a href="/office" className="text-primary" onClick={this.linkToggle}>{this.state.titleLink}</a>
        <div className="text-success mb-3" style={{ opacity: 0, transition: "0.5s all" }} id="message">&nbsp;</div>
        {contents}
      </div>
    );
  }



  createOffice = async (e) => {
    const form = document.forms["CreateForm"];
    let name = form.elements["Name"].value;
    let id = +form.elements["ChiefId"].value;

    let officeChief = {};
    Object.assign(officeChief, this.props.users.find(u => u.id === id));

    const response = await fetch("api/office", {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        ChiefId: id,
        DeptId: 0
      })
    });

    response.json()
      .then(data =>
        response.ok
          ? blink(`Бюро ${name} успешно добавлено`)
            .then(this.props.addOffice({ id: +data, name: name, chiefId: id }))
            .then(fetch("api/user", {
              method: "POST",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                Id: officeChief.id,
                FullName: officeChief.fullName,
                TabNum: officeChief.tabNum,
                OfficeId: +data
              })
            }))
            .then(() => new Promise(resolve => { officeChief.officeId = +data; resolve(officeChief) }))
            .then(chief => this.props.alterUser(chief))
            .then(this.linkToggle())

          : blink(errorHandler(data), true)
      );
  }

  alterOffice = async () => {
    let office = {};
    Object.assign(office, this.props.offices.find(o => +o.id === +this.state.currentId));
    office.chiefId = +document.getElementById("chiefId").value;
    office.name = document.getElementsByName("name")[0].value;

    const response = await fetch(`api/office`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: office.id,
        Name: office.name,
        ChiefId: office.chiefId,
        DeptId: office.deptId ? office.deptId : 0
      })
    });

    response.ok
      ? blink(`Бюро ${office.name} успешно изменено`)
        .then(this.props.alterOffice(office))

      : response.json()
        .then(error => blink(errorHandler(error), true));
  }



  linkToggle = async (e) => {
    e && e.preventDefault();

    if (this.state.mode === "list")
      this.setState({ mode: "create", titleLink: "Отмена", title: "создать группу" });
    else {
      history.push("/office");
      this.setState({ mode: "list", titleLink: "Создать", title: "список групп" });
    }
  }

}

/////////// MAPPS
const chunkStateToProps = state => {
  return {
    offices: state.offices,
    users: state.users,
  }
}

const chunkDispatchToProps = dispatch =>
  bindActionCreators({
    addOffice,
    deleteOffice,
    fillOffices,
    alterOffice,
    alterUser
  }, dispatch)


export default connect(chunkStateToProps, chunkDispatchToProps)(Offices);