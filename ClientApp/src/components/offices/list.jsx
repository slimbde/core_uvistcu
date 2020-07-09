import React, { Component } from 'react';
import Modal from '../view/templates';
import { blink, errorHandler } from '../extra/extensions';
import { Link } from 'react-router-dom';
import '../view/fixedTable.css';


export default class OfficeList extends Component {
  displayName = OfficeList.name;

  ///// RENDER
  render() {
    if (this.props.offices.length === 0)
      return <div></div>;

    return (
      <div>
        <table className='table table-sm table-hover mt-3 mytable' aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Наименование</th>
              <th width="35%">Руководитель</th>
              <th>Работники</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.offices.map(office => {
              let manager = this.props.users.find(u => u.id === +office.chiefId);
              let users = this.props.users.filter(u => u.officeId === +office.id).map(us =>
                <div key={us.id}>
                  <Link to={`/user/${us.id}`} >{us.fullName}</Link>
                </div>);

              return <tr key={office.id}>
                <td><Link to={`/office/${office.id}`}>{office.name}</Link></td>
                <td width="35%"><Link to={`/user/${manager.id}`}>{manager.fullName}</Link></td>
                <td>{users}</td>
                <td>
                  <div className="d-flex">
                    <Modal
                      buttonLabel="Удалить"
                      text={`Вы действительно хотите удалить бюро ${office.name}?`}
                      func={() => this.deleteClick(office.id, office.name)} />
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
    const response = await fetch(`api/office/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      blink(`Бюро ${name} успешно удалено`);
      this.props.deleteOffice(id);
    }
    else
      response.json()
        .then(error => blink(errorHandler(error), true));
  }

}