import React from 'react';
import Navbar from './Navbar.js';
import Timeline from "./Timeline.js";
import Post from "./Post.js";
import Cookies from "universal-cookie";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const cookies = new Cookies();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined
    }
  }

  componentDidMount() {
    if (cookies.get('token') != undefined) {
      fetch('/api/v1/information/token', {
        method: "POST",
        body: JSON.stringify({
          token: cookies.get('token')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(res => this.setState({ user: res }));
    }
  }

  render() {
    return (
      <div className="special-container">
      <Router>
        <div>
          <Navbar user={this.state.user} />
          <Route path="/" exact component={Timeline} />
          <Route path="/posts/:id" component={Post} />
        </div>
      </Router>
      </div>
    );
  }
}

export default App;
