import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Moment from 'react-moment';

class Timeline extends React.Component {
  state = {
    timeline: []
  };

  componentDidMount() {
    fetch('/api/v1/timeline')
      .then(res => res.json())
      .then(data => {
        this.setState({timeline: data});
      });
  }

  render() {
    const list = this.state.timeline.map(post => {
      return <li key={post.id}><Link to={'/posts/' + post.id}>{post.title}</Link></li>
    });
    return (
      <ul>
        {list}
      </ul>
    );
  }
}

class Comments extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>Comments</h3>
        {this.props.data.map(comment =>
          <div>
            <strong><p key={comment.id}><Moment fromNow>{comment.date_created}</Moment> {comment.user.username} commented: {comment.comment}</p></strong>
            {comment.replies.map(reply =>
              <p key={reply.id}><Moment fromNow>{reply.date_created}</Moment> {reply.user.username} replied: {reply.reply}</p>
            )}
            <br />
          </div>
        )}
      </div>
    );
  }
}


class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    };
  }

  componentWillMount() {
    fetch('/api/v1/posts/' + this.props.match.params.id)
      .then(res => res.json())
      .then(data => {
        this.setState({
          data: data
        });
      });
  }
  render() {
    if(this.state.data == null)
      return (<p>Loading</p>);
    else {
      return (
        <div>
          <h3>{this.state.data.title}</h3>
          <p>Written by {this.state.data.user.username}</p>
          <p><br />{this.state.data.content}</p>
          <Comments data={this.state.data.comments} />
        </div>
      );
    }
  }
}

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <Link to='/'><h1>skfs</h1></Link>
          <Route exact path="/" component={Timeline} />
          <Route path="/posts/:id" component={Post} />
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
