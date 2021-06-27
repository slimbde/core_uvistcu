import React from "react";
import NavMenu from './NavMenu';
import Footer from './Footer';
import Particles from 'react-particles-js';
import config from './particles.json';


const Layout = (user) => {

  return <>
    {window.particles && <Particles params={config} />}
    <NavMenu user={user} />
    <div>
      {this.props.children}
    </div>
    <Footer />
  </>
}

export default Layout