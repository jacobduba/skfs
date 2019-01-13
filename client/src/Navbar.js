import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      // custsomizable stuff in the future
      instanceName: this.props.name,
      links: this.props.links
    };
  }

  changeActive() {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar bottom" role="navigation">
          <div className="navbar-brand">
            <div className="navbar-item">
              <p>{this.state.instanceName}</p>
            </div>

            <a role="button" className={this.state.isActive ? "navbar-burger burger is-active" : "navbar-burger burger"} onClick={() => this.changeActive()}>
              <span></span>
              <span></span>
              <span></span>
            </a>
          </div>

          <div className={this.state.isActive ? "navbar-menu is-active" : "navbar-menu"}>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <a className="button is-primary is-outlined is-inverted" href="/login">
                    Login / Sign up
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <nav className="custom-navbar" role="navigation">
          <ul>
            <li><Link to="/">INSTANCE FIREHOSE</Link></li><li><Link to="/about">ABOUT THIS INSTANCE</Link></li><li className="seperator">|</li>
            {this.state.links.map(link =>
                <li><a href={link.url} target="_blank">{link.name.toUpperCase()}</a></li>
            )}
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;
