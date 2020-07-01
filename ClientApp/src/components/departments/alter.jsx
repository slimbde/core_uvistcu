import React, { Component } from 'react';
import { blink, errorHandler } from '../extra/extensions';


export default class DepartmentAlter extends Component {
  displayName = DepartmentAlter.name;


  state = {
    deptOffices: this.props.offices.filter(of => of.deptId === this.props.dept.id)
  }


  /////////// RENDER
  render() {
    let usrOptions = this.props.users.map(user => <option key={user.id} value={user.id}> {user.fullName}</option>);
    let ofcOptions = this.props.offices.map(office => <option key={office.id} value={office.id}>{office.name}</option>);

    let offices = this.state.deptOffices.map(o =>
      <li className="list-group-item" key={o.id}>
        {o.name}
        <a href="/office" className="float-right" onClick={(e) => { e.preventDefault(); this.appendRemoveClick(o.id, false); }}>Удалить</a>
      </li>);

    return (
      <div>
        <form name="alterForm" className="d-flex flex-column">
          <div className="d-flex flex-row col-md-12 pl-0">

            <div className="col-md-4 pl-0">
              <div className="form-group">
                <button type="submit" disabled style={{ display: 'none' }} ></button>
                <label htmlFor="name" className="text-muted">Наименование отдела:</label>
                <input className="form-control" name="name" defaultValue={this.props.dept.name} />
              </div>

              <div className="form-group">
                <label htmlFor="managerId" className="text-muted">Руководитель отдела:</label>
                <div className="input-group">
                  <select
                    className="custom-select"
                    name="managerId"
                    id="managerId"
                    defaultValue={this.props.dept.managerId}
                  >{usrOptions}</select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="add" className="text-muted">Добавить бюро:</label>
                <div className="input-group">
                  <select className="custom-select" id="newOffice" name="add">{ofcOptions}</select>
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => this.appendRemoveClick(document.getElementById("newOffice").value)}
                    >Добавить</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-1">&nbsp;</div>

            <div className="col-md-7">
              <div className="form-group">
                <div className="card">
                  <div className="card-header text-muted">Бюро в отделе:</div>
                  <ul className="list-group list-group-flush">{offices.length > 0 ? offices : <li className="list-group-item">Нет бюро</li>}</ul>
                </div>
              </div>
            </div>

          </div>

          <div className="mb-4 col-md-3 pl-0"><br /><hr />
            <button type="button" className="btn btn-outline-primary" onClick={this.props.alterClick}>Изменить</button>
          </div>
        </form >
      </div>
    );
  }


  appendRemoveClick = async (officeId, append = true) => {
    let office = this.props.offices.find(o => o.id === +officeId);

    let alreadyThere = this.state.deptOffices.includes(office);
    if ((alreadyThere && append) || (!alreadyThere && !append))
      return;

    append
      ? office.deptId = this.props.dept.id
      : office.deptId = null;

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
        DeptId: +office.deptId
      })
    });

    if (response.ok) {
      blink(`Бюро ${office.name} успешно ${append ? "добавлено" : "удалено"}`);

      let newOfficeSet = append
        ? [...this.state.deptOffices, office]
        : this.state.deptOffices.filter(o => o.id !== officeId);

      this.setState({ deptOffices: newOfficeSet });
    }
    else {
      response.json()
        .then(error => blink(errorHandler(error), true));
    }
  }

}