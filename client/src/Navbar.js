import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

class Navbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      // custsomizable stuff in the future
      instanceName: "skfs",
      links: [],
    };
  }

  changeActive() {
    this.setState({
      isActive: !this.state.isActive
    })
  }

  componentDidMount() {
    fetch("/api/v1/information")
      .then(res => res.json())
      .then(res => {
        this.setState({
          instanceName: res.instanceName,
          links: res.links
        })
      });
  }

  populateNavbar() {
    if (this.props.user == undefined) {
      return (
        <div className="navbar-item">
          <div className="buttons">
            <a className="button is-primary is-outlined is-inverted" href="/login">
              Login / Sign up
            </a>
          </div>
        </div>
      )
    } else {
      return (
        <div className="navbar-end">
          <a className="navbar-item">
            <span className="underline">create a post</span>
          </a>
          <div className="navbar-item has-dropdown is-hoverable">
            <Link className="navbar-link is-arrowless underline" to="#">
              logged in as @{this.props.user.username}
            </Link>
            <div className="navbar-dropdown">
              <Link className="navbar-item has-text-grey-darker underline" to={"/users/@" + this.props.user.username}>
                 Your Profile
              </Link>
              <a className="navbar-item has-text-grey-darker underline" href="/setting">
                  Account Settings
               </a>
              <hr className="navbar-divider"></hr>
              <a className="navbar-item has-text-grey-darker underline" href="/logout">
                Logout
              </a>
            </div>
          </div>
        </div>
      )
    }
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
                { this.populateNavbar() }
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
