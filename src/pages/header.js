import React, { Component } from 'react';
import { Navbar } from 'reactstrap';
export default class Header extends Component {
  render() {
    return (
      <div>
        <Navbar
          position="static"
          variant="elevation"
          style={{ backgroundColor: '#000033' }}>
            <h5 className="text-light">LocDB</h5>
        </Navbar>
      </div>
    );
  }
}
