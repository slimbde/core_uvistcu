import React, { Component } from 'react';
import Modal from '../view/templates';
import { blink, errorHandler } from '../extra/extensions';
import { Link } from 'react-router-dom';
import '../view/fixedTable.css'


export default class UserList extends Component {
  displayName = UserList.name;

  ///// RENDER
  render() {
    if (this.props.offices.length === 0)
      return <div></div>;

    return (
      <div>
        <table className='table mytable table-sm table-hover mt-3' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th width="25%">Ф.И.О.</th>
              <th width="10%">Таб.№</th>
              <th>Бюро</th>
              <th>Руководитель</th>
              <th width="10%"></th>
            </tr>
          </thead>
          <tbody>
            {this.props.users.map(user => {
              let office = this.props.offices.find(o => o.id === user.officeId);
              let chief = office ? this.props.users.find(u => u.id === office.chiefId) : undefined;

              return <tr key={user.id}>
                <td width="25%"><Link to={`/user/${user.id}`}>{user.fullName}</Link></td>
                <td width="10%">ЧМ-{user.tabNum}</td>
                <td><Link to={`/office/${user.officeId}`}>{office ? office.name : ""}</Link></td>
                <td><Link to={`/user/${chief ? chief.id : ""}`}>{chief ? chief.fullName : ""}</Link></td>
                <td width="10%">
                  <div className="d-flex">
                    <Modal
                      buttonLabel="Удалить"
                      text={`Вы действительно хотите удалить работника ${user.fullName}?`}
                      func={() => this.deleteClick(user.id, user.fullName)} />
                  </div>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    );
  }


  deleteClick = async (id, name) => {
    const response = await fetch(`api/user/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      blink(`Работник ${name} успешно удален`);
      this.props.deleteUser(id);
    }
    else
      response.json()
        .then(error => blink(errorHandler(error), true));
  }

}