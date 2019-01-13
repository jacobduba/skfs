import React from 'react';
import Navbar from './Navbar.js';
import Timeline from "./Timeline.js";
import Post from "./Post.js";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="special-container">
      <Router>
        <div>
          <Navbar name="this is a skfs dev instance" links={[{name: "our patreon", "url": "https://patreon.com"}]}/>
          <Route path="/" exact component={Timeline} />
          <Route path="/posts/:id" component={Post} />
        </div>
      </Router>
      </div>
    );
  }
}

export default App;
