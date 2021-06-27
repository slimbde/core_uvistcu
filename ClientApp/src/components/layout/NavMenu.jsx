import './NavMenu.css';
import React, { Component, Fragment } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { deleteCookie } from '../extra/extensions';



export default class NavMenu extends Component {

  state = {
    collapsed: true,
    links: [],
  }

  toggleNavbar = () => this.setState(() => ({ collapsed: !this.state.collapsed }))

  out = e => {
    e && e.preventDefault();
    deleteCookie("user");
    deleteCookie("role");
    window.location.reload();
  }


  componentDidMount() {
    const links = []

    if (!!this.props.user) {
      links.push(
        <Fragment key="3">
          <NavItem>
            <NavLink tag={Link} to={`/out`} onClick={e => this.out(e)} >Выйти</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={`/auth/${this.props.user.id}`}>{this.props.user.fullName}</NavLink>
          </NavItem>
        </Fragment>)

      if (user.role === "admin")
        links.push(
          <Fragment key="1">
            <NavItem>
              <NavLink tag={Link} className="admin" to="/department">Отделы</NavLink>
            </NavItem>
          </Fragment >
        )

      if (user.role === "manager")
        links.push(
          <Fragment key="2">
            <NavItem>
              <NavLink tag={Link} className="manager" to="/office">Группы</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className="manager" to="/user">Работники</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} className="manager" to="/labour">Субботники</NavLink>
            </NavItem>
          </Fragment>
        )

      this.setState(() => ({ links }))
    }
  }



  render = () =>
    <header className="position-relative" style={{ zIndex: 1 }}>
      <Navbar className="navbar-expand-lg navbar-toggleable-lg bg-dark box-shadow mb-3" dark>
        <Container>
          <NavbarBrand tag={Link} to="/">Главная</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-lg-inline-flex flex-lg-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow nav-ul" id="nav-ul">
              {links}
              <NavItem>
                <NavLink tag={Link} to="/overtime">Переработки</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/vacation">Отпуска</NavLink>
              </NavItem>
            </ul>
          </Collapse>
        </Container>
      </Navbar>
    </header>
}
